# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure pour l'industrie : le guide d'architecture 2026 |
| Meta description | Azure pour l'industrie manufacturière en 2026 : état des services, architecture de référence, sécurité OT (IEC 62443, NIST CSF 2.0), traçabilité, IA et FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure pour l'industrie manufacturière : le guide complet de l'IT manufacturière sur Microsoft Azure (novembre 2026)

**Réponse courte :** fin 2026, Azure pour l'industrie manufacturière se résume à trois couches : Azure IoT Operations sur Kubernetes compatible Azure Arc dans l'usine, Microsoft Fabric (Real-Time Intelligence et OneLake) comme plateforme de données, et Microsoft Foundry, Power BI et Copilot pour l'analyse, l'IA et le poste de travail. Les anciens blocs fonctionnels sont retirés (Time Series Insights, les aperçus d'agents manufacturiers) ou programmés pour l'être (IoT Central en 2029, la sécurité OT de Defender for IoT). Le succès dépend moins des services que de la maîtrise de votre modèle de données, d'une conception de sécurité OT alignée sur les recommandations ISA/IEC 62443 et NIST, et du choix de cas d'usage dotés d'une référence mesurée.

**Points clés**

- Prévoyez les nouvelles connexions des installations sur **Azure IoT Operations**, et non sur IoT Central ni sur des chaînes de modules IoT Edge développées sur mesure. Choisissez la référence **Standard** si vos machines parlent OPC UA ; l'offre Essentials n'inclut pas le connecteur OPC UA.
- Utilisez **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) pour les données de séries temporelles. Time Series Insights a été retiré le 7 juillet 2024.
- Ne plaçez pas votre logique métier sur des services en préversion. Microsoft a retiré en 2025 son modèle de données manufacturier et les aperçus de l'agent d'usine, environ un an après leur lancement.
- Planifiez dès maintenant le remplacement de votre **supervision OT**. Microsoft retirera complètement la sécurité OT de Defender for IoT en octobre 2029 ; un billet de blog d'un partenaire Microsoft cite le 31 mai 2028 comme fin du support.
- Alignez votre programme de sécurité sur **ISA/IEC 62443** (zones et conduits) et **NIST CSF 2.0** ; les fournisseurs de la défense ont également besoin de **CMMC** pour les systèmes qui traitent des FCI ou des CUI.
- Commencez par des cas d'usage dotés d'une référence et d'un responsable : le TRS (OEE) en temps réel et la traçabilité rapportent généralement avant la maintenance prédictive.

## Table des matières

1. [Ce que signifie Azure pour l'industrie manufacturière aujourd'hui](#ce-que-signifie-azure-pour-lindustrie-manufacturière-aujourdhui)
2. [État des services Azure pour l'industrie manufacturière, novembre 2026](#statut-des-services-azure-pour-la-fabrication-novembre-2026)
3. [Le modèle de données d'abord : ISA-95 et l'espace de noms unifié](#commencer-par-le-modèle-de-données--isa-95-et-lespace-de-noms-unifié)
4. [Architecture de référence Azure pour l'industrie manufacturière](#architecture-de-référence-azure-pour-la-fabrication)
5. [Convergence IT/OT et sécurité : ISA/IEC 62443, NIST CSF 2.0, CMMC et NIS2](#convergence-itot-et-sécurité)
6. [Cas d'usage 1 : maintenance prédictive sur Azure](#cas-dusage-1--maintenance-prédictive-sur-azure)
7. [Cas d'usage 2 : traçabilité et généalogie](#cas-dusage-2--traçabilité-et-généalogie)
8. [Cas d'usage 3 : jumeaux numériques](#cas-dusage-3--jumeaux-numériques)
9. [Cas d'usage 4 : KPI en temps réel, TRS et chaînes de valeur](#cas-dusage-4--kpi-temps-réel-trs-et-chaînes-de-valeur)
10. [Intégration ERP et MES : SAP, Dynamics 365 et flux de données de l'atelier](#intégration-erp-et-mes)
11. [IA et Copilot dans l'industrie manufacturière : ce qui est réaliste](#ia-et-copilot-dans-lindustrie-manufacturière)
12. [FinOps pour l'informatique industrielle](#finops-pour-linformatique-industrielle)
13. [Construire le dossier d'investissement pour Azure dans l'industrie manufacturière](#élaborer-le-dossier-de-rentabilité-dazure-dans-lindustrie-manufacturière)
14. [Feuille de route : cinq phases vers une plateforme Azure manufacturière évolutive](#feuille-de-route--cinq-phases-vers-une-plateforme-azure-de-fabrication-évolutive)
15. [Erreurs courantes dans les projets Azure manufacturiers](#erreurs-courantes-dans-les-projets-azure-pour-la-fabrication)
16. [Applications sectorielles dans l'écosystème Microsoft : l'exemple d'iFAKT Polaris](#applications-sectorielles-dans-lécosystème-microsoft)
17. [FAQ](#faq)
18. [Conclusion](#conclusion)

---

## Ce que signifie Azure pour l'industrie manufacturière aujourd'hui

Il y a cinq ans, une recherche sur « Azure for manufacturing » ou « Azure IoT for manufacturing » renvoyait une liste familière : IoT Hub, IoT Edge, Stream Analytics, Time Series Insights et Synapse. Cette liste ne décrit plus la situation en 2026. Microsoft a reconstruit sa stratégie d'IoT industriel selon trois axes :

1. **L'edge à la place de l'appareil :** La collecte de données dans l'usine s'appuie désormais sur **Azure IoT Operations**, un ensemble de services de données fonctionnant sur des clusters Kubernetes et administrés depuis le cloud via **Azure Arc**. Microsoft décrit ce service comme un « plan de données unifié pour l'edge » [3]. La disponibilité générale a été annoncée en novembre 2024 [5].
2. **Une plateforme de données à la place de services ponctuels :** Les séries temporelles, les événements et les données de référence aboutissent dans **Microsoft Fabric**, en particulier dans Real-Time Intelligence avec Eventstream, Eventhouse et Activator. Microsoft a retiré Time Series Insights et recommande aux clients de migrer vers Fabric Eventhouse [10].
3. **Une plateforme à la place d'une application packagée :** Dans l'IoT et l'industrie, Microsoft se retire de ses propres applications préconfigurées. IoT Central n'accepte plus de nouvelles applications depuis le 23 septembre 2026 et sera retiré le 20 septembre 2029 [8], [64]. Les préversions sectorielles « Manufacturing data solutions » et « Factory Operations Agent » ont été retirées le 30 mai 2025 [2].

L'offre sectorielle s'appelle désormais **Microsoft for Manufacturing** (anciennement « Microsoft Cloud for Manufacturing »). Microsoft l'organise en quatre domaines de solutions : ingénierie numérique, chaînes d'approvisionnement résilientes, usines intelligentes et clients connectés [1]. Pour l'usine intelligente, Microsoft identifie quatre scénarios : moderniser l'edge et l'infrastructure, optimiser les opérations grâce à l'IA, connecter et donner du pouvoir aux équipes, et maintenance et qualité [1]. Microsoft présente Fabric comme la plateforme du « digital thread » [1].

Pour vous, responsable IT, OT ou de la transformation numérique, cela signifie que les briques de base sont devenues plus génériques, et qu'une part plus importante de la responsabilité du modèle de données, de l'intégration et des opérations vous revient, ou revient à vos partenaires. Ce guide montre comment assumer cette responsabilité de manière structurée. Il relie les technologies Azure aux sujets qui déterminent la réussite : le modèle de données, la sécurité, l'[Industrie 4.0](https://www.m365.fm/entity/industry-4-0/) en tant que sujet organisationnel, les KPI et les coûts.

### À qui s'adresse ce guide

- **Les responsables IT et les équipes cloud** qui exploitent déjà Microsoft 365 et Azure et à qui l'on a demandé de connecter les usines.
- **Les ingénieurs OT et automatisme** qui souhaitent comprendre ce que Kubernetes, MQTT et Fabric signifient pour leurs équipements.
- **Les directeurs d'usine, qualité et maintenance** qui évaluent des cas d'usage tels que la maintenance prédictive ou la traçabilité.
- **Les équipes finance et achats** qui doivent rendre prévisibles les coûts du cloud dans l'industrie.

### Termes industriels pour les administrateurs Microsoft 365 et Azure

Si vous venez de l'IT d'entreprise, les projets industriels apportent leur propre vocabulaire. Voici les termes clés utilisés dans ce guide, chacun en une phrase :

| Terme | Signification | Analogie la plus proche en IT |
|---|---|---|
| **OT** (operational technology) | Technologie qui pilote des processus physiques : machines, automates, systèmes de commande | Comme un centre de données séparé dont une panne arrête la production |
| **PLC** (programmable logic controller) | Ordinateur industriel qui commande une machine en temps réel | Un système embarqué dont la durée de vie est de 15 ans ou plus |
| **SCADA** | Système de supervision pour surveiller et piloter plusieurs machines ou lignes | Une console de supervision avec droits d'écriture |
| **MES** (manufacturing execution system) | Pilote et enregistre l'exécution des ordres de fabrication dans l'usine | Un système de workflow entre l'ERP et la machine |
| **OPC UA** | Norme industrielle indépendante des fabricants pour l'échange de données, avec modèle d'information et sécurité intégrée | Une API REST, plus un schéma, plus des certificats, pour les machines |
| **MQTT** | Protocole léger de publication/abonnement | Un bus de messages, comparable aux rubriques Event Grid ou Service Bus |
| **Unified namespace (UNS)** | Structure centrale et hiérarchique d'événements où tous les systèmes publient leur état actuel | Un annuaire de rubriques à l'échelle de l'entreprise |
| **OEE** (overall equipment effectiveness) | Efficacité des équipements calculée à partir de la disponibilité, de la performance et de la qualité | Un SLA de disponibilité, mais pour les machines et incluant la qualité |
| **KQL** (Kusto Query Language) | Langage de requête d'Fabric Eventhouse et d'Azure Data Explorer | Le même langage que vous utilisez dans Log Analytics et Microsoft Sentinel |
| **Modèle de Purdue** | Modèle de référence qui organise les systèmes de l'usine en couches, des équipements de terrain jusqu'à l'entreprise ; l'ISA-95 s'appuie sur lui [26] | Un modèle de segmentation réseau, du VLAN des équipements jusqu'au WAN d'entreprise |

La ligne KQL est un bon point d'entrée pour les administrateurs : si vous connaissez KQL depuis Sentinel ou Log Analytics, vous pouvez interroger immédiatement les données machines dans un Eventhouse.

### Par où commencer en tant qu'administrateur Microsoft 365 ou Azure

Vous n'avez pas besoin de devenir ingénieur en automatisation pour apporter de la valeur dans un projet industriel. Cinq tâches relèvent généralement de l'IT centrale et peuvent être préparées avant le raccordement de la première machine :

1. **Identités et rôles :** Créez des groupes Microsoft Entra ID et des rôles Azure RBAC pour le personnel OT, les partenaires et les équipes de production ; utilisez Privileged Identity Management pour limiter dans le temps les accès privilégiés.
2. **Une zone d'atterrissage Azure pour les usines :** Définissez une structure d'abonnements et de groupes de ressources par usine, et utilisez Azure Policy pour imposer des balises (usine, centre de coûts, cas d'usage) ainsi que les régions autorisées.
3. **Tester Azure Arc :** Raccordez un serveur de test ou un cluster Kubernetes à Arc et faites valider avec votre équipe réseau les points de terminaison sortants requis via la chaîne de proxys. Dans de nombreuses entreprises, ces validations de pare-feu sont ce qui prend le plus de temps.
4. **Bases de Fabric :** Décidez de la capacité, de la structure des espaces de travail et du modèle d'accès ; reprenez votre gouvernance Power BI existante.
5. **Établir une relation de travail avec l'OT :** Comprenez le modèle de zones de l'usine avant de proposer des modifications réseau. Dans l'OT, la disponibilité passe avant la confidentialité, et les fenêtres de maintenance suivent le planning de production, non le Patch Tuesday.

---

## Statut des services Azure pour la fabrication, novembre 2026

Microsoft renomme des services, lance des préversions puis les retire à nouveau. Pour les projets industriels d'une durée de vie de cinq à dix ans, le cycle de vie des produits constitue donc un critère d'architecture. Le tableau ci-dessous résume le statut vérifié au 20 novembre 2026.

### Vue d'ensemble des services : finalité, statut, source

| Service | Finalité en fabrication | Statut, novembre 2026 | Source |
|---|---|---|---|
| **Azure IoT Operations** | Plan de données en périphérie : broker MQTT, connecteurs (OPC UA, HTTP/REST), flux de données, gestion des actifs | Généralement disponible depuis novembre 2024 ; versions régulières. Microsoft Learn désigne la version 1.5.x (version 2610) comme celle qui introduit un nouveau SKU, **Essentials** (uniquement clusters à nœud unique, sans connecteur OPC UA), à côté de **Standard** avec l'ensemble complet des fonctionnalités | [3], [5], [7] |
| **Azure Device Registry** | Représentation cloud des actifs et des appareils, registre de schémas | Partie intégrante d'Azure IoT Operations ; intégration avec IoT Hub en préversion | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Passerelle cloud pour les appareils connectés directement, cycle de vie des appareils | Actif ; recommandé par Microsoft comme cible pour les clients IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS IoT low-code | Aucune nouvelle application depuis le 23 septembre 2026 ; retrait le 20 septembre 2029 | [8], [64] |
| **Azure IoT Edge** | Runtime de conteneurs pour appareils de périphérie (modules) | Produit pris en charge ; la version 1.5 LTS n'est plus prise en charge depuis le 10 novembre 2026 (de même pour EFLOW 1.5 pour Windows) ; version actuelle 1.6 LTS (juillet 2026) prise en charge jusqu'au 14 novembre 2028 ; aucune version EFLOW 1.6 LTS n'est répertoriée sur la page des versions (seule une piste de versions continues EFLOW existe) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Ingestion en flux, analyse de séries temporelles avec KQL, alertes | Généralement disponible depuis Ignite, novembre 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Stockage central des données de référence, transactionnelles et de capteurs | Généralement disponible | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Représentations numériques basées sur une ontologie des actifs et des processus | Préversion | [15] |
| **Ontologie Fabric IQ** | Couche métier sémantique pour l'analytique et les agents | Préversion ; l'ancienne expérience d'ontologie est retirée le 31 janvier 2027, et les ontologies existantes doivent être copiées dans la nouvelle expérience | [16] |
| **Azure Digital Twins** | Jumeaux en graphe avec DTDL | Actif, aucun avis de retrait sur la page de présentation ; 3D Scenes Studio en préversion | [14] |
| **Azure Data Explorer** | Base de données de séries temporelles KQL hors Fabric | Actif, aucun avis de retrait ; utilise KQL comme l'Eventhouse Fabric | [19] |
| **Microsoft Foundry** (anciennement Azure AI Foundry / Azure AI Studio) | Modèles, agents et outils pour les applications d'IA | Actif ; les « Azure AI Services » s'appellent désormais « Foundry Tools » ; prompt flow est retiré le 20 avril 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Entraînement, déploiement et MLOps pour les modèles de ML classiques | Actif ; Microsoft positionne Foundry pour l'IA générative et Azure ML pour le ML classique et les MLOps. L'étiquetage de données intégré a été retiré le 30 septembre 2026 | [37], [38] |
| **Azure Arc** | Gestion de Kubernetes et de serveurs hors Azure | Actif ; fondement d'Azure IoT Operations | [3] |
| **Azure Local** (anciennement Azure Stack HCI) | Infrastructure hyperconvergée dans l'usine | Actif ; renommé en novembre 2024 | [21] |
| **Microsoft Defender for IoT (sécurité OT)** | Surveillance passive du réseau OT, inventaire des actifs, détection d'anomalies | Retrait officiellement annoncé le 2 novembre 2026 ; retrait complet en octobre 2029 ; d'ici là, uniquement des mises à jour de sécurité et des corrections de bogues, sans nouvelle fonctionnalité OT. Un blog de partenaire Microsoft cite le 31 mai 2028 comme fin de support. Connecteurs pour Armis, Dragos et Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Explorateur de séries temporelles (historique) | Retiré le 7 juillet 2024 ; Microsoft désigne l'Eventhouse Fabric comme cible de migration | [10] |
| **Azure Percept** | Kit de développement d'IA en périphérie | Retiré le 30 mars 2023 | [11] |
| **Manufacturing data solutions** (Azure) et **Factory Operations Agent** (Azure AI et Copilot Studio) | Modèle de données manufacturières et copilote de fabrication (préversions) | Retirés au 30 mai 2025 (annoncés en février 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agent de sécurité au travail (préversion) | Retiré au 23 juin 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Modèle de données manufacturières dans Fabric (préversion depuis avril 2024) | Statut incertain : les avis de retrait mentionnent « Manufacturing data solutions » sans le suffixe Fabric, sans inclure ni exclure la variante Fabric ; aucune entrée distincte depuis avril 2024. Ne pas le prévoir dans de nouveaux projets ; demander à Microsoft son statut. | [2] |

### Ce que le tableau signifie pour votre architecture

**Premièrement :** planifiez les nouvelles connexions de site sur Azure IoT Operations, et non sur IoT Central ni sur vos propres chaînes de modules IoT Edge, sauf raison particulière. IoT Edge reste pris en charge, mais c'est un modèle d'exécution pour appareils ; Azure IoT Operations traite le plan de données de l'usine avec un broker, des connecteurs et un modèle d'actifs [3]. Lors du choix de la référence (SKU), notez qu'Essentials n'inclut pas le connecteur OPC UA [3]. Pour une usine type dotée de machines OPC UA, Standard est le point de départ.

**Deuxièmement :** gardez la logique métier à l'écart des services en préversion. L'historique des solutions de données de fabrication Manufacturing montre qu'un modèle de données de fabrication Microsoft peut passer de la préversion à la retraite en un peu plus d'un an [2]. Votre modèle de données vous appartient et doit être documenté dans des formats ouverts (tables Delta dans OneLake, schémas JSON dans le broker, modèles d'information DTDL ou OPC UA).

**Troisièmement :** réexaminez votre stratégie de sécurité OT. L'avis officiel d'Azure indique octobre 2029 comme fin de la sécurité OT dans Defender for IoT, tandis qu'un blog d'un partenaire Microsoft donne le 31 mai 2028 comme fin de support [22], [39]. Planifiez avec la date la plus proche : l'achat, le déploiement et la réception de nouveaux capteurs demandent souvent plus d'un an dans les environnements réglementés.

**Quatrièmement :** réexaminez votre parc IoT Edge. Les appareils sous IoT Edge 1.5 ne reçoivent plus de mises à jour de sécurité depuis le 10 novembre 2026. Microsoft décrit le passage à 1.6 LTS comme simple, car il ne contient pas de changements fonctionnels majeurs [12]. La même fin de support s'applique aux appareils Windows exécutant IoT Edge pour Linux sur Windows (EFLOW) 1.5 ; la page des versions ne mentionne aucune version EFLOW 1.6 LTS, seulement un canal de publication continu [12]. Clarifiez la voie de migration cible pour ces appareils avec Microsoft ou votre fournisseur de matériel.

> **Note sur l'actualité :** ce tableau est un instantané. Avant chaque décision d'architecture, vérifiez les pages Microsoft liées et le portail Azure Updates filtré sur « Retirements ».

---

## Commencer par le modèle de données : ISA-95 et l'espace de noms unifié

De nombreux projets industriels échouent non pas à cause du cloud, mais parce que personne n'a défini ce qu'est une « machine », un « ordre » ou un « événement d'arrêt » dans le modèle de données. Répondez à cette question avant de déployer le premier service Azure.

### ISA-95 et la pyramide de l'automatisme

La série **ANSI/ISA-95** (internationalement IEC 62264) décrit l'intégration des systèmes d'entreprise et des systèmes de contrôle [26]. L'ISA la décrit comme un ensemble de normes d'intégration des systèmes logistiques avec les systèmes de contrôle de fabrication, fondé sur le modèle de référence de Purdue et applicable aux industries discrètes, continues et logistiques ; la série comporte huit parties [26]. Elle apporte deux éléments utiles à toute architecture cloud :

- **Un modèle par niveaux :** les niveaux 0 à 2 couvrent le processus physique, les capteurs, les actionneurs et la commande (automates, SCADA). Le niveau 3 correspond au management des opérations de fabrication (MES, MOM). Le niveau 4 correspond à la planification d'entreprise ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). En Europe, cette hiérarchie est souvent représentée sous forme de « pyramide de l'automatisme » ; en Amérique du Nord, le modèle de Purdue est l'image la plus courante.
- **Un modèle d'objets :** ISA-95 définit des termes tels que la hiérarchie des équipements (entreprise, site, zone, poste de travail, unité de travail), les matières, le personnel, les ordres de production et les données de performance. L'OPC Foundation a traduit ce modèle dans sa propre spécification complémentaire pour OPC UA [35].

La critique de la pyramide est bien connue : les données ne circulent qu'niveau par niveau, chaque interface est une intégration point à point, et une nouvelle application doit se connecter à plusieurs systèmes. Le modèle d'objets, en revanche, reste précieux, car il donne à l'IT, à l'OT et au métier un langage commun.

### Espace de noms unifié : des événements plutôt que la pyramide

L'**espace de noms unifié (UNS, unified namespace)** est un modèle d'architecture, et non une norme. Tous les systèmes publient leur état courant sous forme d'événements vers un broker central à structure hiérarchique, généralement MQTT. Les consommateurs s'abonnent aux topics dont ils ont besoin. La hiérarchie des topics suit souvent la hiérarchie des équipements ISA-95, par exemple :

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations comprend un courtier MQTT natif de la périphérie qui prend en charge MQTT 3.1.1 et MQTT 5 [40]. Le connecteur OPC UA publie les données des serveurs OPC UA au format JSON OPC UA PubSub vers les topics du courtier et peut également écrire des valeurs dans les nœuds OPC UA ; les requêtes d'écriture utilisent le modèle requête/réponse de MQTT 5 [4]. Cela permet de construire un UNS dans l'usine sans exploiter un courtier séparé.

Si vous exploitez déjà un UNS sur un autre courtier, vous n'êtes pas obligé de le remplacer : les flux de données peuvent transférer les messages vers des courtiers MQTT externes [3]. Utiliser le courtier Microsoft comme UNS de l'usine ou comme alimentation d'un courtier existant relève d'une décision opérationnelle. Ce qui compte, c'est une convention de topics et de charges utiles contraignante, indépendante du produit.

### ISA-95 ou UNS ? Les deux.

La réponse productive est la suivante : utilisez **ISA-95 comme vocabulaire** et **l'UNS comme modèle de transport**. Concrètement :

| Question | Recommandation |
|---|---|
| Comment nommer les actifs ? | Hiérarchie des équipements ISA-95, cohérente à l'échelle de l'entreprise |
| Comment structurer les topics ? | Par hiérarchie des équipements, avec les domaines métier en dessous (état, ordre, qualité, énergie) |
| Comment décrire les charges utiles ? | Schémas JSON dans le registre de schémas d'Azure Device Registry [3] ; pour les machines, privilégiez les spécifications compagnons OPC UA |
| Où se trouvent les données de référence ? | Dans le système de référence (ERP, MES, PLM) ; l'UNS ne diffuse que des références et des états |
| Comment gérer l'historique ? | Pas dans le courtier, mais dans l'Eventhouse ou le Lakehouse de Fabric |

### Le modèle de données de fabrication minimal

Quels que soient les outils, les cas d'usage de ce guide nécessitent un modèle de base comportant sept entités :

1. **Actif** (machine, poste, outil) avec un identifiant unique et une place dans la hiérarchie
2. **Signal** (tag, variable mesurée) avec unité, fréquence d'échantillonnage et lien vers l'actif
3. **État** (en marche, arrêt planifié, arrêt non planifié, changement de série) avec un code motif
4. **Ordre** (ordre de fabrication, opération) avec un lien vers l'ERP
5. **Matière et numéro de lot/de série** avec un lien vers la nomenclature
6. **Événement** (alarme, constat qualité, maintenance)
7. **Personne/équipe**, dans la mesure permise par les règles de confidentialité et les accords collectifs de travail

Si vous reliez proprement ces sept entités, vous pouvez alimenter le TRS, la maintenance prédictive, la traçabilité et un jumeau numérique à partir de la même base de données. Nous expliquons comment dériver un tel modèle à partir d'une chaîne de valeur dans l'épisode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) ; la méthode elle-même est présentée dans notre guide sur la [cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Architecture de référence Azure pour la fabrication

L'architecture de référence ci-dessous résume ce que Microsoft décrit dans la documentation Azure IoT Operations [3] et dans l'architecture de référence Fabric « Connected Factory » [17], et ajoute les couches que ces sources omettent : la sécurité, les données de référence et le poste de travail.

### Modèle en couches

| Couche | Rôle | Briques Azure et Microsoft | Décisions typiques |
|---|---|---|---|
| **0 : Terrain et commande** | Machines, automates, capteurs, bancs d'essai, caméras | Aucun composant Azure ; serveur OPC UA sur le contrôleur ou une passerelle, capteurs de rétrofit si nécessaire | Quelles machines parlent OPC UA ? Où une rétrofit est-elle nécessaire ? |
| **1 : Infrastructure edge** | Calcul en usine, segmentation réseau | Ordinateurs industriels ou serveurs avec Kubernetes (par exemple AKS Edge Essentials sous Windows, clusters basés sur Ubuntu) [3], ou Azure Local [21] ; gérés via Azure Arc | Cluster mono-nœud ou multi-nœuds ? Qui exploite le matériel ? Remarque : la version Essentials est limitée à un seul nœud [3] |
| **2 : Plan de données edge** | Collecte, normalisation, mise en mémoire tampon, UNS local | Azure IoT Operations : broker MQTT, connecteur OPC UA, connecteur HTTP/REST (connecteurs Akri), flux de données, expérience opérationnelle, découverte automatique des appareils et des actifs [3], [4] | Structure des topics, schémas, agrégation en edge, tampon disque du broker, comportement hors ligne (72 heures maximum, possiblement dégradé [3]) |
| **3 : Gestion des actifs et des appareils** | Quel actif correspond à quel équipement ? Quels points de données ? | Azure Device Registry avec espaces de noms et registre de schémas [3] ; pour les appareils directement connectés, IoT Hub et DPS [8] | Qui maintient les données de référence des actifs ? Réconciliation avec le système de maintenance (GMAO) ? |
| **4 : Streaming et analytique temps réel** | Ingestion des événements, enrichissement, déclenchement d'alertes | Fabric Real-Time Intelligence : Eventstream, Eventhouse (KQL), Activator, tableaux de bord temps réel [17], [18] ; en variante, Azure Event Hubs et Azure Data Explorer [19] | Capacité Fabric ou PaaS Azure ? Rétention chaude/froide ? |
| **5 : Plateforme de données** | Historique, données de contexte, produits de données | OneLake, Lakehouse, Data Factory pour les données ERP, MES et de postes [17] | Structure en médaillon, propriété des produits de données, modèle d'accès |
| **6 : Sémantique et jumeau** | Sens, relations, ontologie | Ontologie Fabric IQ (préversion) [16], Digital Twin Builder (préversion) [15] ou Azure Digital Twins avec DTDL [14] | Une préversion est-elle acceptable ? Conserver la maîtrise du modèle |
| **7 : Analytique et IA** | Modèles, prévisions, agents | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Où entraîner, où exécuter l'inférence (cloud ou edge) ? |
| **8 : Poste de travail et processus** | Informer les personnes et leur permettre d'agir | Power BI, Teams (y compris les scénarios de première ligne), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Quel rôle voit quoi ? Mobilité sur l'atelier ? |
| **Transversal : sécurité et gouvernance** | Identités, réseau, supervision, conformité | Microsoft Entra ID, Azure Policy, gamme Microsoft Defender, Microsoft Purview, capteurs OT (Defender for IoT uniquement en transition, solutions partenaires) [22] | Modèle de zones selon ISA/IEC 62443, profil NIST CSF 2.0, circuits de notification d'incidents |
| **Transversal : coûts** | Transparence, répartition, optimisation | Microsoft Cost Management, métriques de capacité Fabric, pratiques FinOps [25] | Coût par usine, par ligne, par cas d'usage |

### Flux de données en dix étapes

1. Le contrôleur expose les valeurs de processus via un serveur OPC UA.
2. Le connecteur OPC UA dans Azure IoT Operations lit les points de données configurés d'un actif et les publie sur un topic du broker, par exemple `azure-iot-operations/data/<asset>` [4].
3. Le connecteur peut découvrir automatiquement les actifs sur les serveurs OPC UA et ajouter leur configuration à Azure Device Registry [4].
4. Les flux de données filtrent, normalisent, convertissent les unités et enrichissent avec le contexte [3], [31].
5. Les applications locales (par exemple un tableau andon ou une inspection en ligne) s'abonnent directement au broker.
6. Un flux de données transfère les données agrégées vers un point de terminaison cloud : Event Hubs/Kafka, le broker MQTT d'Event Grid, Data Lake Storage, Fabric OneLake ou Azure Data Explorer [3].
7. Dans Fabric, un Eventstream ingère les données et l'Eventhouse les stocke pour les requêtes KQL [17].
8. Data Factory synchronise les données ERP, MES, de postes et de coûts vers OneLake [17].
9. Les événements sont enrichis avec la hiérarchie des actifs et la topologie des lignes ; les modèles sont entraînés et évalués, et les résultats sont stockés dans OneLake [17].
10. Real-Time Dashboards et Power BI assurent la visualisation, Activator notifie les techniciens, et Copilot répond aux questions en langage naturel [17].

Microsoft dimensionne la référence Connected Factory à plus d'un million d'événements IIoT par heure, à partir de 30 000 tags répartis sur 40 usines [17]. Considérez ce chiffre comme une indication d'ordre de grandeur, et non comme une garantie de performance pour votre environnement.

### Enseignements tirés des projets

Le cabinet de conseil b.telligent décrit trois enseignements tirés de projets avec Azure IoT Operations et Fabric [31] :

- **Configurer le stockage du broker :** sans stockage persistant configuré, les messages qui ne peuvent pas être transférés peuvent saturer la mémoire. Microsoft le confirme indirectement : le tampon de messages sur disque du broker ne peut être défini que lors du déploiement initial, et non ultérieurement [40]. Décidez du profil mémoire et du tampon avant le déploiement.
- **Garder des schémas stables :** la modification des structures JSON fragilise le traitement en aval. Une enveloppe uniforme avec métadonnées et charge utile aide.
- **Consolider les Eventstreams :** chaque Eventstream générant des coûts d'exploitation, l'article recommande de les consolider par usine plutôt que par source, et d'effectuer les transformations dans l'Eventhouse avec des politiques de mise à jour et KQL plutôt que dans l'Eventstream.

Ces conseils proviennent d'un article de mars 2025 (mis à jour en juin 2025) ; vérifiez s'ils s'appliquent toujours à votre version.

### Chemins alternatifs

Tous les fabricants n'ont pas besoin de l'architecture complète. Quatre variantes sont courantes :

| Variante | Quand elle est pertinente | Briques de base |
|---|---|---|
| **Cloud direct** | Peu d'appareils récents et connectés ; pas d'exigences de latence | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Centré sur la périphérie** | Nombreuses machines, OPC UA, décisions locales, réseau OT sans connexion cloud directe | Azure IoT Operations sur Arc, Fabric |
| **Edge partenaire** | Plateforme edge industrielle existante d'un fournisseur d'automatisation | Plateforme partenaire plus Fabric ou Azure ; Microsoft cite, par exemple, l'exécution de modèles Azure AI sur Siemens Industrial Edge comme recommandation d'architecture [2] |
| **Démarrage léger (fabricant de taille moyenne, une usine)** | Quelques lignes, pas d'équipe Kubernetes en interne, premier cas d'usage TRS ou surveillance de l'état | Un cluster mononœud avec Azure IoT Operations Standard (en raison d'OPC UA), une petite capacité Fabric, Power BI ; exploitation du cluster éventuellement confiée à un partenaire |

Pour un fabricant de taille moyenne avec une seule usine, l'architecture complète en couches est une image cible, et non un point de départ. Commencez par les couches 1, 2, 4 et 8, puis ajoutez la sémantique, l'IA et la gouvernance multi-sites une fois le premier cas d'usage opérationnel.

---

## Convergence IT/OT et sécurité

Une fois les données machines transmises vers le cloud, l'usine fait partie de la surface d'attaque. Dans le même temps, les exigences réglementaires et clients augmentent. La CISA range la fabrication de métaux primaires, de machines, d'équipements électriques et de composants, et d'équipements de transport au cœur du **secteur de la fabrication critique** américain [52] ; de nombreuses usines qui alimentent Azure appartiennent donc à un secteur d'infrastructures critiques.

Cette section commence par les normes qui façonnent la conception technique (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), puis présente les obligations applicables à certains groupes de fabricants (CMMC, SEC, CIRCIA) et, pour les entreprises ayant des activités ou des clients dans l'UE, NIS2 et le Cyber Resilience Act.

### ISA/IEC 62443 : zones, conduits, niveaux de sécurité

La série **ISA/IEC 62443** constitue le référentiel de référence pour la sécurité des systèmes d'automatisation et de contrôle industriels. Ses concepts clés sont les zones (groupes d'actifs ayant les mêmes besoins de protection), les conduits (chemins de communication contrôlés entre zones) et les niveaux de sécurité cibles par zone, de SL 1 (protection contre les violations fortuites ou occasionnelles) à SL 4 (protection contre des attaquants sophistiqués disposant de moyens étendus) [27]. La norme définit également sept exigences fondamentales, de la maîtrise de l'identification et de l'authentification à la disponibilité des ressources [27]. Pour une architecture Azure, cela signifie :

- **Le cluster de périphérie constitue sa propre zone :** le cluster Kubernetes qui exécute Azure IoT Operations n'appartient ni au réseau bureautique ni directement au réseau de contrôle, mais à une zone intermédiaire (souvent appelée « DMZ industrielle », niveau Purdue 3.5).
- **Connexions sortantes uniquement :** Arc et les flux de données ouvrent des connexions depuis l'usine vers le cloud. Les connexions entrantes depuis Internet vers l'usine ne sont pas nécessaires et ne doivent pas être ouvertes.
- **Réseaux en couches :** Microsoft indique qu'Azure IoT Operations prend en charge la gestion sécurisée des appareils dans des réseaux en couches [3]. Planifiez tôt la chaîne de proxys et de pare-feux avec la sécurité OT.
- **Accorder l'accès en écriture de manière délibérée :** le connecteur OPC UA peut réécrire des valeurs dans les automates [4]. Cette capacité nécessite sa propre évaluation des risques et son propre processus d'approbation, et idéalement elle est désactivée au départ.
- **Certificats plutôt que mots de passe :** pour OPC UA, sont disponibles l'identifiant/mot de passe, les certificats X.509 et l'accès anonyme (tests uniquement) [4]. Utilisez des certificats et une liste de confiance, et traitez le renouvellement des certificats comme un processus d'exploitation récurrent.

### NIST CSF 2.0 et NIST SP 800-82 : la référence américaine

Pour la plupart des fabricants américains, le **NIST Cybersecurity Framework (CSF) 2.0** est le langage commun entre l'usine, l'informatique et la direction. Le NIST l'a publié le 26 février 2024 ; il étend les cinq fonctions Identifier, Protéger, Détecter, Répondre et Rétablir par une nouvelle fonction **Gouverner**, et s'applique aux organisations de tous secteurs et de toutes tailles [49]. Le référentiel est volontaire, mais les clients, les assureurs et les auditeurs demandent de plus en plus un profil CSF.

Deux documents du NIST concrétisent le référentiel pour les usines :

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (septembre 2023) traite des architectures OT, des menaces et des contre-mesures, et ajoute une surcouche OT avec des bases de contrôles SP 800-53 adaptées aux systèmes OT à impact faible, modéré et élevé [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, a été publié sous forme de projet initial ouvert au public le 29 septembre 2025 ; la période de commentaires s'est terminée le 17 novembre 2025, et à la date de novembre 2026 aucune version finale n'est répertoriée [51]. Utilisez-le comme référence de projet, et non comme norme définitive.

Comment les différents éléments s'articulent dans un projet Azure :

| Fonction CSF 2.0 | Ce que cela signifie pour la plateforme de fabrication Azure |
|---|---|
| Gouverner | Responsables nommés pour la plateforme d'usine, acceptation des risques pour les services en préversion, liste des fournisseurs (Microsoft, intégrateur, fournisseurs OT) |
| Identifier | Inventaire des actifs OT réconcilié avec le registre des appareils Azure ; cartographie des flux de données par zone et par conduit |
| Protéger | Rôles Entra ID avec moindre privilège, PIM, certificats OPC UA, connectivité sortante uniquement, accès en écriture désactivé par défaut |
| Détecter | Surveillance du réseau OT (solution partenaire après Defender for IoT), journaux centralisés depuis la périphérie et le cloud dans Sentinel ou votre SIEM |
| Répondre | Playbook d'incident couvrant l'usine et le cloud, incluant qui peut déconnecter un cluster pendant la production |
| Rétablir | Redéploiement testé du cluster de périphérie (infrastructure as code), sauvegarde du broker et de la configuration des actifs |

Les petits et moyens fabricants n'ont pas à faire cela seuls : le réseau national du NIST Manufacturing Extension Partnership (MEP) propose des auto-évaluations fondées sur le CSF, des analyses d'écarts, des plans d'actions correctives, des plans de réponse aux incidents et une aide pour les exigences DFARS [58].

### CMMC pour les fournisseurs de la défense

Si vous fabriquez des pièces ou fournissez des services pour le département de la Défense des États-Unis, le **Cybersecurity Maturity Model Certification (CMMC)** s'applique aux systèmes qui traitent, stockent ou transmettent des informations contractuelles fédérales (FCI) ou des informations non classifiées contrôlées (CUI). La règle du programme (32 CFR Part 170) est entrée en vigueur le 16 décembre 2024 [53]. La règle DFARS qui intègre le CMMC aux contrats est entrée en vigueur le 10 novembre 2025, avec un déploiement par phases : la phase 1 a commencé à cette date, la phase 2 débutera le 10 novembre 2026, et la phase 3 est prévue pour le 10 novembre 2027 [54]. Les niveaux sont le niveau 1 (auto-évaluation, FCI), le niveau 2 (auto-évaluation ou évaluation par un tiers C3PAO, sur la base du NIST SP 800-171) et le niveau 3 (évaluation DIBCAC, ajoutant les pratiques du NIST SP 800-172) [53], [54].

Ce que cela signifie pour Azure :

- **Délimiter les données, pas le cloud.** Le CMMC s'applique à vos systèmes, et non à Azure en tant que plateforme ; il n'existe aucun certificat CMMC pour Azure lui-même [55]. Les simples télémesures machine peuvent ne pas être des CUI, alors que les plans, les spécifications et certains paramètres de procédé pour les pièces de défense peuvent en être ; ce sont les marquages CUI et les clauses contractuelles de votre client qui tranchent. Décidez quelles données de l'UNS et de OneLake entrent dans le périmètre.
- **Choisir délibérément l'environnement cloud.** Microsoft indique qu'Azure commercial et Azure Government disposent tous deux d'autorisations FedRAMP High couvrant le NIST SP 800-171, et que vous pouvez obtenir une certification CMMC pour des solutions dans l'un ou l'autre ; Azure Government ajoute les autorisations DoD IL4/IL5 et des engagements contractuels sur le stockage des données aux États-Unis et sur le personnel américain filtré, et Microsoft le considère comme le meilleur choix pour la plupart des entrepreneurs de la défense [55]. Notez que la page CMMC de Microsoft a été mise à jour pour la dernière fois en avril 2023 ; vérifiez les détails auprès de votre équipe de compte Microsoft.
- **Vérifier la disponibilité des fonctionnalités.** Tous les services de ce guide ne sont pas disponibles dans Azure Government ni dans l'environnement Microsoft 365 GCC High. Vérifiez la disponibilité d'Azure IoT Operations, de Fabric et de Copilot pour votre cloud cible avant de concevoir autour d'eux [unverified: pour les services individuels ; consulter les pages de disponibilité des fonctionnalités Microsoft US Government].

### Déclaration à la SEC et signalement d'incidents CIRCIA

Deux régimes de déclaration américains influencent la manière dont vous concevez la journalisation et la réponse aux incidents pour la plateforme d'usine :

- **Sociétés cotées :** En vertu des règles de la SEC adoptées le 26 juillet 2023, les émetteurs doivent déclarer un incident de cybersécurité significatif sur le formulaire 8-K (Item 1.05) dans les quatre jours ouvrés suivant la détermination de son caractère significatif, et décrire leur gestion des risques de cybersécurité, leur stratégie et leur gouvernance dans le formulaire 10-K annuel [56]. Une attaque par rançongiciel qui arrête une usine est un cas typique d'évaluation de la significativité ; votre playbook d'incident OT doit donc prévoir une voie rapide vers le comité de divulgation.
- **Infrastructures critiques (CIRCIA) :** Le Cyber Incident Reporting for Critical Infrastructure Act oblige les entités concernées à signaler les incidents cyber couverts à la CISA dans les 72 heures, et les paiements de rançon dans les 24 heures, mais uniquement une fois que la règle finale de la CISA entrera en vigueur. En octobre 2026, la CISA avait transmis la règle finale à la Maison-Blanche pour examen, et elle n'avait pas encore été publiée [57]. Suivez la règle finale ; elle définira quels fabricants sont concernés.

### NIS2 et le Cyber Resilience Act pour les opérations dans l'UE

Si vous exploitez des sites dans l'UE ou si vous y vendez des machines, deux textes européens vous concernent également. Les exemples allemands ci-dessous sont tirés de l'édition originale allemande de ce guide et montrent comment les règles européennes s'appliquent concrètement.

**NIS2 (exemple : Allemagne).** La loi allemande de transposition de NIS2 (NIS2UmsuCG) est entrée en vigueur le 6 décembre 2025 ; l'Office fédéral allemand de la sécurité de l'information (BSI) supervise désormais environ 29 500 entités, contre environ 4 500 auparavant [28]. Les entreprises sont dans le champ d'application si elles relèvent de l'un des types d'entités des annexes 1 et 2 de la loi BSI et remplissent les seuils de l'article 28 : au moins 50 salariés, ou plus de 10 millions d'euros de chiffre d'affaires annuel et de total de bilan [41]. Les entrées de fabrication de l'annexe 2 incluent les dispositifs médicaux, les ordinateurs, les produits électroniques et optiques, les équipements électriques, les machines et les véhicules ; la chimie et l'alimentaire constituent des secteurs distincts. Obligations principales :

- **Enregistrement** en deux étapes, via le compte « Mein Unternehmenskonto » et le portail du BSI, ouvert le 6 janvier 2026 [28].
- **Gestion des risques**, avec une responsabilité au niveau de la direction.
- **Mesures techniques et organisationnelles**, incluant la sécurité de la chaîne d'approvisionnement et l'authentification multifacteur.
- **Notification des incidents** significatifs : alerte précoce dans les 24 heures suivant la prise de connaissance, notification de l'incident dans les 72 heures, rapport final au plus tard un mois après la notification [41].

Les entreprises doivent évaluer elles-mêmes si elles sont concernées ; le BSI ne les en informe pas. Il propose un autodiagnostic en ligne, non contraignant, et recommande de recourir à un conseil juridique en cas de doute [41]. Les autres États membres de l'UE disposent de leurs propres lois de transposition, aux structures comparables.

**Cyber Resilience Act.** Si vous fabriquez des machines ou des produits comportant des éléments numériques et les mettez sur le marché de l'UE, le **Cyber Resilience Act (règlement (UE) 2024/2847)** s'applique également, y compris aux fabricants américains. Depuis le 11 septembre 2026, les fabricants doivent signaler les vulnérabilités activement exploitées et les incidents graves via la plateforme de signalement unique de l'ENISA : alerte précoce dans les 24 heures, notification dans les 72 heures, et rapport final au plus tard 14 jours après la disponibilité d'un correctif pour les vulnérabilités, ou dans un délai d'un mois pour les incidents [30]. À partir du 11 décembre 2027, les produits doivent satisfaire aux exigences essentielles de cybersécurité avant leur mise sur le marché ; celles-ci incluent des paramètres par défaut sécurisés, une nomenclature logicielle (SBOM) et des mises à jour de sécurité sur une période de support annoncée, généralement d'au moins cinq ans [42]. Pour les constructeurs de machines qui livrent des équipements accompagnés de services cloud, l'informatique industrielle devient une question de conformité produit.

Pour l'architecture Azure, NIS2, CSF 2.0 et CMMC vont dans le même sens : un inventaire (qu'est-ce qui est connecté au cloud ?), la journalisation (qui a modifié quoi, et quand ?), la transparence de la chaîne d'approvisionnement (quels services et partenaires sont impliqués ?) et un circuit de notification testé à l'avance.

### Surveillance OT après le retrait de Defender for IoT

Le 2 novembre 2026, Microsoft a officiellement annoncé dans Azure Updates qu'il retirera totalement le composant de sécurité OT de Defender for IoT en octobre 2029, après une période de transition de trois ans [22]. D'ici là, le service reçoit des mises à jour de sécurité et des corrections de bogues, mais aucune nouvelle fonctionnalité OT ; les contrats existants et les renouvellements sont honorés jusqu'en octobre 2029 [22]. Les capacités IoT d'entreprise de Defender for Endpoint, ainsi que la découverte d'appareils et l'évaluation des vulnérabilités, ne sont pas concernées [22]. Il n'existe pas de remplacement propre à Microsoft [39]. Microsoft propose des connecteurs pour Armis, Dragos et Forescout qui intègrent les données d'actifs et de vulnérabilités OT dans Microsoft Security Exposure Management et le portail Defender ; ces solutions partenaires nécessitent leurs propres licences et leur propre déploiement [22], [24].

Dates contradictoires : un article de blog d'un partenaire Microsoft de novembre 2026 indique le **31 mai 2028** comme fin de support de la sécurité OT [39]. Au moment de la rédaction, il n'a pas été clarifié s'il s'agit d'une date différente pour certains types de contrats ou d'une erreur.

Recommandation : si vous introduisez dès maintenant une surveillance OT, évaluez directement les solutions partenaires. Si vous utilisez Defender for IoT, planifiez le remplacement de sorte qu'il soit achevé avant mi-2028, et confirmez la date applicable à votre contrat auprès de votre équipe de compte Microsoft.

### Liste de contrôle de sécurité pour la première connexion de l'usine

- [ ] Modèle de zones selon ISA/IEC 62443 documenté pour l'usine
- [ ] Cluster de périphérie dans sa propre zone, connexions sortantes uniquement, via un proxy
- [ ] Points de terminaison Arc et Azure explicitement autorisés dans le pare-feu, tout le reste bloqué
- [ ] Connexions OPC UA avec certificats ; accès en écriture désactivé ou soumis à approbation
- [ ] Rôles Entra ID pour le personnel OT selon le principe du moindre privilège ; accès privilégiés limités dans le temps
- [ ] Journaux de la périphérie et du cloud collectés de manière centralisée
- [ ] Inventaire des actifs OT réconcilié avec Azure Device Registry
- [ ] Profil CSF 2.0 (actuel et cible) rédigé pour la plateforme de l'usine
- [ ] Périmètre CMMC décidé si l'usine traite des FCI ou des CUI
- [ ] Chemin de déclaration d'incident testé (SEC, CIRCIA une fois en vigueur, NIS2 pour les sites européens)
- [ ] Processus de mise à jour défini pour les versions d'Azure IoT Operations et de Kubernetes (fenêtres de maintenance convenues avec la production)

---

## Cas d'usage 1 : Maintenance prédictive sur Azure

La maintenance prédictive est l'un des cas d'usage manufacturiers les plus fréquemment cités sur Azure, et aussi l'un de ceux où de nombreux pilotes échouent. Une raison courante : le modèle arrive avant les données. Nous approfondissons ce point dans l'épisode [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Distinguer les termes

| Stratégie | Déclencheur | Données requises |
|---|---|---|
| Maintenance corrective | Défaillance | Aucune |
| Maintenance préventive | Intervalle de temps ou de compteur | Heures de fonctionnement, cycles |
| Maintenance conditionnelle (surveillance d'état) | Seuil dépassé | Variables d'état (vibration, température, courant) |
| Maintenance prédictive | Prévision de la durée de vie résiduelle ou de la probabilité de défaillance | Variables d'état, historique des défaillances étiquetées et contexte d'exploitation |
| Maintenance prescriptive | Action recommandée | Plus la connaissance des causes et des actions |

De nombreuses entreprises ne tirent l'essentiel du bénéfice que de la maintenance conditionnelle seule. Les modèles prédictifs se rentabilisent lorsque les défaillances sont coûteuses, suffisamment fréquentes et physiquement annoncées à l'avance. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) fournit la stratégie globale ; ses piliers de maintenance autonome et de maintenance planifiée fonctionnent aussi sans IA.

### Prérequis en matière de données

Avant d'entraîner un modèle, vous devriez pouvoir répondre oui à ces questions :

1. **Existe-t-il un historique des défaillances ?** Un modèle supervisé a besoin de défaillances horodatées avec leur type. Ces informations se trouvent généralement dans le système de maintenance (par exemple SAP PM ou une GMAO) et sont rarement codées proprement.
2. **Les horodatages sont-ils synchronisés ?** L'heure des capteurs, celle des automates et la date d'enregistrement dans l'ERP doivent pouvoir être mises en correspondance. Ce n'est pas un hasard si Microsoft a ajouté aux capteurs Defender for IoT des messages de santé dédiés aux serveurs NTP absents ou injoignables [23] ; cela vaut aussi pour votre chaîne de données. Le connecteur OPC UA transmet l'horodatage source de chaque valeur [4] ; utilisez-le plutôt que l'heure d'arrivée dans le cloud.
3. **La fréquence d'échantillonnage convient-elle au mode de défaillance ?** Un endommagement de roulement apparaît dans les spectres de vibration dans la plage du kilohertz ; l'usure des résistances chauffantes apparaît dans des valeurs à la minute. Une balise OPC UA avec une résolution d'une seconde suffit pour l'un, pas pour l'autre.
4. **Le contexte d'exploitation est-il disponible ?** Sans information sur le produit, la recette, l'ordre de fabrication et l'état (changement de format, production, arrêt), le modèle considère chaque changement de produit comme une anomalie.
5. **L'action est-elle définie ?** Qui réagit à un avertissement, avec quel délai, et comment le résultat est-il remonté ?

### Six étapes

1. **Sélectionner les candidats :** Actifs à forts coûts de défaillance, modes de défaillance récurrents et capteurs existants. Une analyse de Pareto des causes d'arrêt issues du MES vous donne la liste.
2. **Connecter les données :** Connecteur OPC UA dans Azure IoT Operations, points de données par actif, flux de données vers Fabric [3], [4]. Agréger les données de vibration haute fréquence en périphérie pour obtenir des caractéristiques (RMS, kurtosis, énergies de bande).
3. **Surveillance d'état d'abord :** Seuils et détection d'anomalies simple dans Eventhouse et Activator. Activator peut notifier directement les techniciens [17]. Cela crée de la valeur en quelques semaines plutôt qu'en plusieurs mois, tout en collectant les étiquettes en parallèle.
4. **Créer les étiquettes :** Associer les ordres de maintenance avec leurs codes de défaillance aux séries temporelles. C'est là que se situe l'effort réel. Prévoyez un outil pour cela : Microsoft a retiré l'étiquetage de données intégré d'Azure Machine Learning le 30 septembre 2026 et renvoie vers des fournisseurs tiers [38]. Pour les étiquettes de séries temporelles issues de la maintenance, une Power App qui réécrit dans le système de maintenance suffit souvent.
5. **Entraîner le modèle :** Dans Fabric Data Science ou Azure Machine Learning ; stocker les résultats dans OneLake [17]. Commencer par des méthodes interprétables (gradient boosting sur les caractéristiques) avant d'utiliser le deep learning.
6. **Opérationnaliser :** Envoyer les prédictions sous forme d'événements dans le processus de maintenance (notification dans le système de maintenance, message Teams, formulaire Power Apps pour le retour d'information). Surveiller la qualité du modèle et la dérive.

### Indicateurs de réussite

Mesurez l'impact opérationnel, et non la précision du modèle : arrêts non planifiés, temps moyen entre pannes (MTBF), temps moyen de réparation (MTTR), part des heures de maintenance planifiée dans le total, et stock de pièces de rechange. Ces [KPI](https://www.m365.fm/entity/key-performance-indicator/) nécessitent une référence de départ avant le lancement du projet ; sans cela, vous ne pouvez pas prouver le moindre bénéfice. Notre guide sur les [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) présente les définitions.

### Périphérie ou cloud pour l'inférence ?

| Critère | Inférence dans le cloud | Inférence en périphérie |
|---|---|---|
| Latence | De quelques secondes à quelques minutes | Millisecondes |
| Volume de données | Seules les données agrégées sont envoyées | Les données brutes restent en local |
| Exploitation | Plus simple (modèles centralisés) | Déploiements distribués, versionnage par site |
| Résilience | Dépend de la connectivité | Fonctionne hors ligne |
| Usage typique | Durée de vie utile restante, planification de la maintenance | Arrêt rapide, qualité en ligne |

Pour la maintenance prédictive classique, l'inférence dans le cloud sur des données agrégées suffit dans la plupart des cas. Depuis la version 2603, Microsoft positionne explicitement Azure IoT Operations pour les scénarios d'IA plus proches de la machine (« Physical AI ») [6] ; pour l'inférence en périphérie, consultez les notes de version actuelles [7].

### Maintenance prédictive sur Azure : les briques en un coup d'œil

| Étape | Brique Azure et Microsoft | Alternative |
|---|---|---|
| Collecter les données | Azure IoT Operations (connecteur OPC UA, flux de données) [3], [4] | IoT Hub pour les capteurs connectés directement [36] |
| Stocker et analyser les séries temporelles | Fabric Eventhouse avec KQL [17] | Azure Data Explorer [19] |
| Seuils et alertes | Fabric Activator [17] | Azure Monitor ou logique personnalisée |
| Entraîner le modèle | Fabric Data Science, Azure Machine Learning [17], [37] | Application propre au constructeur de machines |
| Déclencher l'action | Power Automate, Teams, Power Apps, système de maintenance | API directe vers le CMMS |

---

## Cas d'usage 2 : Traçabilité et généalogie

La traçabilité répond à la question « Où cette pièce est-elle installée, et de quoi est-elle composée ? ». La généalogie décrit la chaîne complète d'origine d'un produit : matière, lot, étape de processus, machine, paramètres, résultat de contrôle et opérateur. Dans les industries réglementées, elle est obligatoire ; ailleurs, elle accélère le traitement des réclamations et permet de cibler plus précisément les rappels. L'épisode [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) traite le sujet en profondeur.

### Exigences par secteur

| Secteur / règle | Exigence de données essentielles | Remarque |
|---|---|---|
| Alimentaire, règle FDA sur la traçabilité des aliments (FSMA section 204) | Éléments de données clés (KDE) pour chaque événement de traçabilité critique (CTE) tel que la réception, la transformation et l'expédition, liés à un code de lot de traçabilité ; enregistrements fournis à la FDA dans les 24 heures suivant une demande, plus un tableur électronique triable lors d'épidémies ou de rappels | [59] ; la FDA n'appliquera pas la règle avant le 20 juillet 2028 suite à une directive du Congrès (date initiale du 20 janvier 2026) |
| Dispositifs médicaux, QMSR de la FDA (21 CFR partie 820) | Depuis le 2 février 2026, le règlement sur le système de gestion de la qualité intègre par référence la norme ISO 13485:2016, y compris ses exigences d'identification et de traçabilité | [61] |
| Enregistrements électroniques réglementés par la FDA, 21 CFR partie 11 | Pistes d'audit sécurisées, générées par ordinateur et horodatées, qui enregistrent les saisies et modifications des opérateurs sans masquer les entrées antérieures, conservées aussi longtemps que les enregistrements | [60] ; pertinent pour la pharmacie, les dispositifs médicaux et les enregistrements alimentaires tenus électroniquement |
| Automobile, IATF 16949 | La section 8.5.2.1 complète les exigences d'identification et de traçabilité de l'ISO 9001 (y compris un plan de traçabilité fondé sur l'analyse des risques) ; la section 7.5.3.2.1 traite de la conservation de certains enregistrements, généralement interprétée comme la durée de fourniture des pièces de production et de service plus un an civil, sauf exigence contraire du client ou du régulateur | Le texte de la norme est payant ; détails issus de sources secondaires. Les exigences spécifiques des clients OEM (CSR) vont souvent plus loin |
| Aérospatiale, AS9100D (EN 9100 en Europe, JIS Q 9100 au Japon) | Traçabilité sur l'ensemble du cycle de vie du produit, identification de la configuration, capacité à retrouver les produits issus du même lot de matière première ou du même lot de production | L'AS9100D (2016) est la révision en vigueur ; l'EN 9100 est l'édition européenne techniquement équivalente [62]. La référence de clause (8.5.2) n'a pas été vérifiée par rapport au texte original de la norme |
| Batteries vendues dans l'UE, règlement européen sur les batteries (règlement (UE) 2023/1542) | Passeport électronique de batterie à partir du 18 février 2027 pour les batteries de traction des véhicules électriques, les batteries des moyens de transport légers (par exemple vélos électriques, trottinettes électriques) et les batteries industrielles de plus de 2 kWh | [29] ; calendrier selon la Commission européenne, donné à titre indicatif ; pertinent pour les exportateurs américains vers l'UE |
| Produits vendus dans l'UE au titre du règlement écoconception (ESPR, règlement (UE) 2024/1781) | Passeport numérique de produit selon l'acte délégué ; registre européen des DPP opérationnel depuis le 20 juillet 2026 (initialement avec un environnement de test) ; acte délégué pour le fer et l'acier prévu au quatrième trimestre 2026, textiles, aluminium et pneumatiques en 2027 ; période de transition d'au moins 18 mois après l'adoption d'un acte délégué | [29] ; calendrier selon la Commission européenne, donné à titre indicatif |

Pour l'aérospatiale, Mirko Peters explique dans son article [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) pourquoi le délai de fabrication et la traçabilité sont étroitement liés dans ce secteur ; notre guide sur la [planification de la production aérospatiale](https://www.m365.fm/en/learn/aerospace-production-planning/) couvre le contexte AS9100, FAA et contrôle des exportations.

### Le modèle de données de la généalogie

Une généalogie robuste repose sur trois types de relations :

1. **Matière dans matière :** le lot A et le composant B entrent dans l'assemblage C (référence de nomenclature, numéro de série ou de lot).
2. **Matière vers processus :** l'assemblage C a été traité à l'opération 30, au poste 20, avec le jeu de paramètres X, par l'équipe Y.
3. **Processus vers résultat :** l'opération 30 a produit le résultat de contrôle Z et, le cas échéant, une non-conformité.

Ces relations forment un graphe. Vous pouvez le représenter dans Fabric sous forme de structure de tables dans le Lakehouse et le parcourir avec KQL ou SQL, ou le modéliser comme un graphe dans un jumeau numérique (ontologie Fabric ou Azure Digital Twins) [14], [16]. L'essentiel est que l'identification se fasse à la source : numérisation, RFID ou codes Data Matrix au poste, liés à l'événement de commande dans l'UNS.

### Mise en œuvre sur Azure

- **Capturer les événements en périphérie :** Les scanners et les postes publient « la pièce X a démarré/terminé au poste Y » vers le courtier MQTT d'Azure IoT Operations [3]. Les paramètres de process arrivent par le connecteur OPC UA [4] ; le « dataset triggering » permet à un point de donnée de déclencher la publication des autres, par exemple « cycle terminé » [4].
- **Rassembler le contexte :** Dans Fabric, les événements sont joints aux données de commandes et de nomenclature issues de l'ERP et du MES [17].
- **Garantir l'immuabilité :** Les enregistrements réglementaires exigent un stockage immuable ou, à défaut, un journal des modifications infalsifiable (pour les enregistrements soumis à la FDA, l'exigence de piste d'audit de la Part 11 [60]). La politique d'immuabilité de OneLake ne s'applique actuellement qu'aux journaux de diagnostic, et non aux données métier [43]. Pour des archives de traçabilité à l'épreuve de l'audit, ajoutez Azure Blob Storage avec des politiques de stockage immuable (WORM) ; Fabric reste la couche d'analyse.
- **Fournir des requêtes :** Les requêtes typiques sont la traçabilité ascendante (quels produits finis contiennent le lot A ?) et la traçabilité descendante (de quoi est composé le numéro de série S ?). Un rapport Power BI ou une Power App pour l'assurance qualité rend ces requêtes utilisables sans compétences en KQL. Dans le cadre de la FSMA 204, la capacité à exporter un tableur triable sous 24 heures [59] constitue un test d'acceptation concret pour cette couche.

### Du dossier de traçabilité au passeport numérique de produit

Un passeport numérique de produit est essentiellement un extrait accessible de l'extérieur de votre généalogie, complété par des données de durabilité et de matériaux. Si vous construisez aujourd'hui une généalogie propre, vous avez accompli l'essentiel du travail préparatoire. Veillez à ce que les identifiants soient uniques et permanents, et à pouvoir distinguer les données publiques, celles destinées aux régulateurs et celles strictement internes.

---

## Cas d'usage 3 : Jumeaux numériques

Le terme [jumeau numérique](https://www.m365.fm/entity/digital-twin/) désigne des choses très différentes : d'un modèle 3D à un modèle de simulation, jusqu'à une représentation en temps réel d'une usine. Pour des besoins d'architecture, une distinction s'avère utile. Notre guide sur les [jumeaux numériques dans l'industrie manufacturière](https://www.m365.fm/en/learn/digital-twin-manufacturing/) va au-delà de la vision Azure.

### Trois types de jumeaux

| Type | Question | Données | Outils de l'écosystème Microsoft |
|---|---|---|---|
| **Jumeau d'information** | Qui se trouve où, et comment est-il relié ? | Hiérarchie des actifs, relations, états en temps réel | Fabric digital twin builder (préversion) [15], ontologie Fabric IQ (préversion) [16], Azure Digital Twins [14] |
| **Jumeau de simulation** | Que se passe-t-il si … ? | Logique de process, durées, capacités, comportement en cas de perturbation | Applications industrielles pour la simulation des flux de matière et des process, éventuellement sur l'infrastructure Azure |
| **Jumeau d'ingénierie** | Comment le produit ou la machine se comporte-t-il physiquement ? | CAO, CAE, logique de commande | PLM/CAE sur Azure ; Microsoft propose notamment des recommandations d'architecture pour Siemens NX sur Azure Virtual Desktop avec des VM GPU et Ansys Discovery sur des VM GPU [2] |

La [mise en service virtuelle](https://www.m365.fm/entity/virtual-commissioning/) relie les jumeaux d'ingénierie et de simulation : le code de commande est testé sur un modèle de l'installation avant que l'équipement réel n'existe.

### Azure Digital Twins ou Fabric ?

Microsoft souligne lui-même que digital twin builder dans Fabric est un produit distinct d'Azure Digital Twins [14], [15]. Les différences pratiques :

| Critère | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Statut | Actif, aucune annonce de retrait sur la page de présentation [14] | Préversion [15] |
| Modélisation | DTDL (Digital Twins Definition Language), version 3 [14] | Ontologie avec types d'entités et relations [15] |
| Stockage | Graphe de jumeaux propre ; historique via l'historique de données vers Azure Data Explorer [14] | OneLake ; les données doivent d'abord se trouver dans un lakehouse Fabric [15] |
| Intégration | Routes d'événements vers Event Hubs, Event Grid, Service Bus [14] | Native dans Fabric Real-Time Intelligence, Power BI |
| Public | Équipes de développement, orientées API | Équipes données et métier, low-code |
| Visualisation | 3D Scenes Studio (préversion) [14] | Expériences Fabric, Power BI |

**Recommandation :** Si votre plateforme de données est Fabric et que vous avez besoin de jumeaux analytiques pour les KPI et l'analyse des causes racines, suivez de près digital twin builder et l'ontologie Fabric IQ, et testez-les en pilote, mais ne faites pas dépendre votre modèle de données d'une version en préversion. Microsoft n'a pas encore documenté la manière dont les deux briques Fabric évolueront l'une par rapport à l'autre ; l'ontologie a déjà connu un changement d'expérience avec une migration obligatoire [16]. Si vous construisez aujourd'hui une application de jumeau de production basée sur des API, Azure Digital Twins est le service généralement disponible. Dans tous les cas, conservez une copie de votre ontologie dans un format indépendant de tout outil.

### Par où commencer ?

L'erreur la plus courante consiste à commencer par la visualisation 3D. Commencez plutôt par une question à laquelle le jumeau doit répondre, par exemple « Quelles commandes sont affectées si le poste 20 tombe en panne ? ». Cette question définit les entités et les relations dont vous avez besoin. Mirko Peters décrit cette approche dans [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) ainsi que le cheminement de l'ERP vers un jumeau d'atelier dans [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Nous abordons la mise en œuvre technique sur Azure dans l'épisode [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Cas d'usage 4 : KPI temps réel, TRS et chaînes de valeur

Les KPI temps réel sont souvent le moyen le plus rapide de tirer de la valeur d'une connexion à l'atelier. Ils ne nécessitent pas d'IA, mais ils exigent un modèle d'état propre.

### Calculer correctement le TRS

Le taux de rendement synthétique (TRS, ou OEE en anglais) est le produit de la disponibilité, de la performance et de la qualité. La formule est simple ; les définitions ne le sont pas :

- **Disponibilité :** Quels arrêts sont comptés comme planifiés (pauses, maintenance planifiée, absence d'ordre) ? Cette décision fait varier le TRS de plusieurs points de pourcentage.
- **Performance :** Quel temps de cycle sert de référence : la valeur de conception, le meilleur temps de cycle atteint ou le standard de l'ERP ?
- **Qualité :** Une pièce retravaillée compte-t-elle comme bonne ou comme mauvaise pièce ?

Mettez-vous d'accord sur ces définitions entre les sites avant de construire un tableau de bord. Sinon, les sites comparent des chiffres qui ne sont pas comparables.

### Architecture pour les KPI temps réel

1. Les états machines et les compteurs de pièces circulent via OPC UA vers le broker [4].
2. Un flux de données fait correspondre les états à un modèle de statut uniforme (correspondance des codes propres à chaque machine) [3].
3. L'Eventhouse calcule des KPI glissants par poste, ligne et équipe avec KQL.
4. Un Real-Time Dashboard sert l'atelier ; Power BI sert les rapports de direction [17].
5. Activator déclenche des alertes lorsque les valeurs passent sous les seuils [17].

### La chaîne de valeur comme modèle de données vivant

La cartographie de la chaîne de valeur est traditionnellement un exercice sur papier. Si vous reliez les étapes de process d'une chaîne de valeur à des données en direct, vous obtenez un modèle de données simple mais efficace : le délai de traversée, les stocks entre processus, les temps de cycle et les goulots d'étranglement deviennent mesurables. L'épisode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) montre comment cela fonctionne en pratique. Pour une planification détaillée s'appuyant sur ces données, les systèmes de [planification avancée et ordonnancement](https://www.m365.fm/entity/advanced-planning-and-scheduling/) entrent en jeu ; voir notre guide sur la [planification de production et l'APS](https://www.m365.fm/en/learn/production-scheduling-aps/). La manière dont ces chiffres sont utilisés dans les réunions quotidiennes de tiers fait l'objet de notre guide sur le [management visuel de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/).

### Catalogue de KPI de départ

| KPI | Source de données | Granularité |
|---|---|---|
| TRS et ses facteurs | État machine, compteurs, constats qualité | Poste, équipe |
| Délai de traversée | Événements de commande (début/fin par opération) | Commande, produit |
| Encours (travaux en cours) | Mouvements de stock, scans | Stock tampon, ligne |
| Livraison à date | ERP (date demandée vs date réelle) | Client, famille de produits |
| MTBF / MTTR | Arrêts, ordres de maintenance | Équipement |
| Énergie par bonne pièce | Compteurs d'énergie, comptage des pièces | Ligne, produit |
| Taux de première passe | Résultats de contrôle | Opération |

---

## Intégration ERP et MES

Les données d'atelier sans contexte de commande et de matière ne sont que des mesures, pas de l'information. C'est l'intégration avec l'ERP et le MES qui détermine la valeur de l'ensemble de la plateforme.

### Quel système fait office de système de référence ?

| Objet de données | Système de référence (typique) | Rôle de la plateforme Azure |
|---|---|---|
| Matière, nomenclature, gammes | ERP / PLM | Copie pour enrichissement, sans maintenance |
| Ordre de fabrication (planification) | ERP / APS | Copie ; retour d'état sous forme d'événement |
| Exécution et confirmation d'opération | MES | Événements dans l'UNS, historique dans Fabric |
| États machine, valeurs de process | Automate / edge | Source de données principale |
| Ordres de maintenance | Maintenance ERP / GMAO | Déclenchés par les prédictions, historique pour les étiquettes |
| Constats qualité | QMS / MES | Liés aux données de process |

### Intégration SAP

Plusieurs voies permettent de faire entrer les données SAP dans Fabric : les connecteurs Data Factory, les solutions de miroir ouvert proposées par des partenaires, et « SAP Business Data Cloud Connect for Microsoft Fabric », qui vise à rendre les produits de données SAP disponibles dans OneLake sans copie ; la disponibilité générale de cette dernière solution a été annoncée pour le troisième trimestre 2026 [44]. Nous n'avons pas pu confirmer la disponibilité générale effective au moment de la rédaction [unverified : statut non confirmé à la date de rédaction] ; vérifiez le statut actuel et les exigences de licence côté SAP avant de planifier. Pour l'intégration de l'atelier avec SAP Digital Manufacturing, le DSAG (le groupe d'utilisateurs SAP germanophone) a publié en avril 2026 le guide « SAP DM Shopfloor Integration » ; la page de synthèse est disponible en anglais. Selon son introduction, il couvre l'architecture, les structures et modèles de données, la mise à l'échelle, les modèles, le modèle opérationnel et les achats ; le texte intégral est réservé aux membres du DSAG [48]. Règle de base : les confirmations vers SAP passent par le MES ou par des API définies, et non directement depuis la plateforme de données.

### Dynamics 365

Si vous utilisez Dynamics 365 Supply Chain Management, vous bénéficiez de sa proximité avec l'écosystème Microsoft : grâce à « Link to Microsoft Fabric », les données Dataverse, y compris certaines tables finance et opérations sélectionnées, peuvent être mises à disposition dans Fabric sans pipeline ETL propre [45]. Microsoft décrit son offre manufacturière comme une combinaison de capacités Dynamics 365, Microsoft 365 et Azure [1].

### Historiens et SCADA existants

De nombreuses usines américaines exploitent déjà un historien de process à côté du SCADA. Considérez-le comme une source, et non comme un élément à remplacer : l'historien continue de servir localement les opérateurs et les ingénieurs procédé, tandis que la plateforme Azure reçoit soit les signaux bruts de la couche OPC UA, soit des données curées provenant de l'historien. Décidez, signal par signal, quel chemin fait office de système de référence pour l'historique, afin de ne pas stocker et payer deux fois la même série temporelle ; vérifiez auprès de l'éditeur de l'historien quelles interfaces et licences s'appliquent avant de concevoir le flux de données.

### Le flux de données d'atelier vers l'ERP

Un schéma courant :

1. L'ERP libère un ordre ; l'événement « ordre libéré » arrive dans l'UNS.
2. Le MES démarre une opération ; l'événement « opération démarrée » indique le poste et l'ordre.
3. Les données machine sont enrichies dans le flux de données avec le numéro d'ordre en cours.
4. Le MES confirme les quantités et les temps ; l'ERP les enregistre.
5. Fabric réunit tous les événements en un historique complet des ordres, pour l'analyse et la traçabilité.

---

## IA et Copilot dans l'industrie manufacturière

L'IA générative est arrivée dans l'industrie manufacturière, mais différemment de ce qui était attendu en 2024. Microsoft a retiré en 2025 ses préversions d'agents spécifiques à l'industrie manufacturière (Factory Operations Agent, Factory Safety Agent) [2] et s'appuie désormais sur des briques génériques de la plateforme : Microsoft Foundry pour les agents et les modèles [20], Copilot in Fabric pour les questions sur les données [17], ainsi que Copilot Studio et Microsoft 365 Copilot pour les scénarios de bureau. Lors d'Ignite 2025, Fabric IQ et Foundry IQ sont arrivés en préversion, destinés à fournir aux agents respectivement une couche sémantique et une base de connaissances [34]. La vision du cycle de vie s'applique aussi ici : prompt flow, un outil largement utilisé pour les premières applications LLM dans Foundry et Azure Machine Learning, sera retiré le 20 avril 2027 ; Microsoft recommande de migrer vers le Microsoft Agent Framework [37].

### Scénarios réalistes

| Scénario | Briques | Prérequis |
|---|---|---|
| Questions en langage naturel sur les données de production (« Pourquoi la ligne 3 a-t-elle été plus lente hier ? ») | Copilot in Fabric, agents de données Fabric, ontologie [16], [17] | Modèle de données propre, noms de tables et de colonnes compréhensibles, KPI définis |
| Synthèse des transmissions de poste et des rapports d'incident | Microsoft 365 Copilot, Teams, Copilot Studio | Saisie structurée, par exemple via Power Apps ou des formulaires Teams |
| Assistant de maintenance (recherche dans les manuels et l'historique des pannes) | Microsoft Foundry avec récupération, Copilot Studio | Documents numérisés et à jour, droits d'accès maintenus |
| Inspection visuelle de la qualité | Modèles de vision par ordinateur, inférence en périphérie | Données d'images étiquetées (outil d'étiquetage tiers, puisque l'étiquetage de données Azure ML est retiré [38]), éclairage stable |
| Assistant de planification (comparaison de scénarios) | Application industrielle (APS, simulation) plus IA | Un modèle de planification valide |

### Microsoft 365 comme passerelle vers l'atelier

Pour les organisations qui utilisent déjà Microsoft 365, le levier le plus important à court terme se trouve souvent non pas dans Azure, mais dans la connexion des événements de l'atelier au poste de travail :

- **Teams pour les opérateurs de terrain :** communication de poste, tâches, notifications issues d'Activator ou de Power Automate directement dans Teams [17].
- **Power BI :** rapports de KPI pour la direction et la direction de l'usine, construits sur les mêmes données Fabric.
- **Power Apps :** saisie des motifs d'arrêt, des constats qualité et des retours de maintenance sur tablette au poste de travail. Cela crée précisément les étiquettes dont la maintenance prédictive a besoin.
- **Copilot :** synthèses des rapports de poste, analyses d'écarts et comptes rendus de réunions de management de l'atelier.
- **Anticiper les licences :** les salariés de l'atelier reçoivent généralement des licences frontline (Microsoft 365 F1 ou F3). Vérifiez avant le déploiement quelles capacités, comme Power Apps ou Copilot, elles incluent et quelles licences complémentaires vous devez ajouter ; sinon, un bon pilote s'enlise à grande échelle.

### Limites et gouvernance

- **Aucune décision de commande par des modèles de langage.** Les modèles de langage relèvent de l'assistance, et non de la boucle de commande fermée d'une machine.
- **Utiliser un cadre de gestion des risques.** Le **NIST AI Risk Management Framework (AI RMF 1.0)**, publié le 26 janvier 2023, est un cadre volontaire organisé autour de quatre fonctions : Govern, Map, Measure et Manage [63]. C'est un moyen pratique de documenter les risques de l'IA dans l'inspection qualité ou la planification, à l'attention des clients et des auditeurs.
- **AI Act européen pour les opérations en UE :** si vous exploitez des systèmes d'IA dans des usines européennes ou si vous y vendez des produits dotés d'IA, vérifiez si un système sert de composant de sécurité d'un produit ou à la gestion des travailleurs ; des obligations pour les systèmes à haut risque peuvent alors s'appliquer. Le « Digital Omnibus on AI » (règlement (UE) 2026/1744, en vigueur depuis fin juillet 2026) a reporté ces échéances : au 2 décembre 2027 pour les systèmes autonomes à haut risque (par exemple dans les ressources humaines) et au 2 août 2028 pour les systèmes intégrés dans des produits. L'IA dans les machines doit être réglementée par des actes délégués au titre du règlement européen sur les machines [46]. La classification de votre système spécifique nécessite une revue juridique.
- **Main-d'œuvre et relations sociales :** les systèmes capables d'évaluer la performance ou le comportement des salariés soulèvent des questions sociales. Dans les usines américaines syndiquées, vérifiez si votre convention collective couvre le suivi des performances ; dans les usines allemandes, de tels systèmes exigent généralement l'accord du comité d'entreprise (Betriebsrat), qui dispose de droits de cogestion. Impliquez tôt les représentants des salariés dans tous les cas.
- **Droits d'accès :** Copilot montre ce qu'un utilisateur est autorisé à voir. Un partage trop large dans SharePoint ou Fabric devient visible grâce à l'IA.

---

## FinOps pour l'informatique industrielle

Les coûts cloud dans l'industrie se comportent différemment des charges informatiques classiques : les volumes de données croissent avec chaque machine connectée, les charges tournent en continu, et une partie de l'infrastructure se trouve dans l'usine. FinOps aide à rendre ces coûts prévisibles et à les relier à la valeur créée. L'épisode [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) traite des spécificités de ce domaine.

### Le cadre FinOps en bref

Microsoft fonde ses recommandations FinOps sur le cadre de la FinOps Foundation [25]. Il comprend six principes (parmi lesquels « Teams need to collaborate », « Business value drives technology decisions » et « Take advantage of the variable cost model of the cloud »), trois phases du cycle de vie (Inform, Optimize, Operate) et quatre domaines [25] :

| Domaine | Ce que cela signifie pour l'industrie |
|---|---|
| Comprendre l'usage et les coûts | Rendre visibles les coûts par usine, par ligne et par cas d'usage (balisage, capacités Fabric ou espaces de travail séparés) |
| Quantifier la valeur métier | Coût par pièce bonne, par machine connectée ou par heure d'arrêt évitée |
| Optimiser l'usage et les coûts | Réduire le volume de données en périphérie, étager la rétention, dimensionner correctement les capacités |
| Gérer la pratique FinOps | Responsabilités, politiques, refacturation aux usines |

Le cadre recommande d'évaluer la maturité capacité par capacité plutôt que globalement, et de la réexaminer tous les trois à six mois [25].

### Les dix leviers de coût les plus importants

1. **Agréger en périphérie :** toutes les valeurs à une résolution d'une seconde n'ont pas besoin d'atteindre le cloud. Les flux de données peuvent filtrer et agréger [3]. C'est le levier le plus important.
2. **Envoyer sur changement :** par défaut, le connecteur OPC UA n'envoie que les valeurs modifiées et ajoute périodiquement des trames clés contenant toutes les valeurs afin que les consommateurs puissent reconstituer l'état [4]. Vérifiez aussi les bandes mortes dans le contrôleur ou le serveur OPC UA afin que le bruit ne soit pas compté comme un changement.
3. **Consolider les Eventstreams :** par usine plutôt que par source, avec des transformations dans l'Eventhouse [31].
4. **Étager la rétention :** les données chaudes dans le cache de l'Eventhouse pendant des jours ou des semaines, les données plus anciennes dans le stockage OneLake.
5. **Dimensionner délibérément la capacité Fabric :** suivre l'utilisation avec l'application Capacity Metrics, séparer les charges de développement et de production, suspendre les capacités dont vous n'avez pas besoin. La suspension est documentée pour les SKU F ; lors d'une suspension, les dépassements accumulés sont facturés immédiatement et le contenu de la capacité devient indisponible [47]. Une capacité qui alimente un Eventstream ou un tableau de bord d'usine n'est donc pas candidate à la suspension.
6. **Choisir le bon SKU en périphérie :** depuis la version 2610, Azure IoT Operations propose un SKU Essentials à moindre coût pour les déploiements à fort volume, à côté du SKU Standard, limité aux clusters mono-nœud et sans le connecteur OPC UA [3]. Il convient par exemple aux sites dont les données arrivent déjà en MQTT ou HTTP. Vérifiez, site par site, les fonctionnalités dont vous avez réellement besoin.
7. **Utiliser les réservations et les plans d'économies** pour les ressources Azure fonctionnant en continu.
8. **Répartir les coûts :** imposer les balises d'usine, de centre de coûts et de cas d'usage (Azure Policy).
9. **Introduire l'économie unitaire :** rapporter le coût cloud par unité produite ou par machine connectée. Ce n'est qu'ainsi que l'on peut comparer les usines entre elles.
10. **Retirer l'existant obsolète :** migrer les services en fin de vie (IoT Central, IoT Edge 1.5) avant que les structures parallèles ne doublent vos coûts.

### Ne pas oublier les coûts de périphérie

Le matériel d'usine, l'exploitation de Kubernetes, les licences des services activés par Azure Arc et le personnel chargé des mises à jour doivent figurer dans le même calcul. Un dossier d'investissement qui ne considère que la facture Azure sous-estime systématiquement le coût total. Ce guide ne donne délibérément aucun prix, car ils changent souvent ; vous trouverez les modèles de tarification actuels pour Azure IoT Operations (Standard et Essentials), Azure Arc et Azure Local sur les pages de tarification Azure et dans le calculateur de prix Azure.

---

## Élaborer le dossier de rentabilité d'Azure dans l'industrie manufacturière

Les affirmations générales sur les bénéfices issues des études sectorielles aident rarement à obtenir un budget, car elles ne tiennent pas compte de votre point de départ. Une logique de calcul que vous alimentez avec vos propres chiffres est plus solide.

### Catégories de bénéfices

| Catégorie | Calcul | Source de données |
|---|---|---|
| Arrêts imprévus évités | Heures d'arrêt × marge sur coûts variables par heure × réduction attendue | Historique des arrêts MES, finance |
| TRG plus élevé | Pièces bonnes supplémentaires × marge sur coûts variables par pièce | Référence TRG |
| Baisse des coûts de rebut et de retouche | Quantité de rebut × coût de fabrication × réduction | QMS |
| Traitement plus rapide des réclamations | Heures par réclamation × taux horaire × réduction ; périmètre de rappel réduit | Historique des réclamations |
| Coûts de maintenance | Stock de pièces de rechange, prestations de sous-traitants, heures supplémentaires | Maintenance ERP |
| Conformité | Effort évité pour les preuves manuelles (audits, demandes FSMA 204, évaluations CMMC, DPP) | Équipe qualité et conformité |

### Catégories de coûts

- Matériel et exploitation de l'edge par site
- Consommation Azure et Fabric (récurrente)
- Licences (Power BI, Copilot, applications sectorielles, sécurité OT si nécessaire)
- Mise en œuvre (interne et externe)
- Conduite du changement et formation
- Équipement de capteurs supplémentaires pour les machines plus anciennes

### Exemple chiffré avec des données fictives

Une ligne subit 120 heures d'arrêt imprévu par an, et la marge sur coûts variables est de 1 600 $ par heure. Si la surveillance de l'état et une réaction plus rapide permettent d'éviter 20 % de ces heures, cela représente 24 heures × 1 600 $ = 38 400 $ par an. À cela s'opposent les coûts affectés : matériel et exploitation de l'edge, consommation Fabric, licences et heures internes. Les chiffres sont volontairement simples. Ce qui compte, c'est que chaque hypothèse ait une source interne à votre entreprise (historique MES, finance) et que vous mesuriez la réduction par rapport à la référence après trois à six mois.

### Règle empirique pour la priorisation

Commencez par le cas d'usage qui réunit trois conditions : une référence mesurable, des données disponibles et un responsable de processus qui souhaite utiliser les résultats. Il s'agit plus souvent du TRG en temps réel ou de la traçabilité que de la maintenance prédictive.

---

## Feuille de route : cinq phases vers une plateforme Azure de fabrication évolutive

La feuille de route ci-dessous suit le schéma courant « d'abord les fondations et un cas d'usage phare, puis la montée en charge ». Les durées sont indicatives pour un premier site et dépendent fortement de votre point de départ, des validations réseau et des ressources disponibles.

### Phase 1 : Clarification (4 à 8 semaines)

- Portefeuille de cas d'usage avec estimations de bénéfices ; sélection d'un ou deux cas d'usage phares
- État actuel : parc machines, protocoles (OPC UA est-il disponible ?), réseau, systèmes existants
- Modèle de données cible (hiérarchie ISA-95, convention de topics UNS)
- Concept de sécurité couvrant la sécurité OT, le profil CSF 2.0, le périmètre CMMC le cas échéant, la protection de la vie privée et les représentants du personnel
- Vérification du cycle de vie de tous les services par rapport au tableau de statut de ce guide

### Phase 2 : Fondations (6 à 12 semaines)

- Infrastructure edge sur le site pilote, connexion Arc, Azure IoT Operations
- Structure des espaces de travail Fabric, planification de la capacité, modèle d'accès
- Premières machines connectées via OPC UA, actifs dans Azure Device Registry
- Bases FinOps : balises, budgets, rapports de coûts par site

### Phase 3 : Premiers résultats (8 à 12 semaines)

- Cas d'usage phare en production, par exemple TRG en temps réel avec saisie des motifs d'arrêt dans une Power App
- Tableau de bord d'atelier et rapport de management
- Référence et première mesure d'impact

### Phase 4 : Approfondissement (3 à 6 mois)

- Intégration du contexte ERP et MES, historique des commandes et généalogie
- Surveillance de l'état, collecte d'étiquettes pour la maintenance prédictive
- Premiers scénarios Copilot sur des données organisées

### Phase 5 : Montée en charge (du mois 9 au mois 15, selon l'avancement)

- Déploiement sur davantage de lignes et de sites avec infrastructure as code et GitOps
- Indicateurs transversaux aux sites avec définitions uniformes
- Maintenance prédictive pour des actifs sélectionnés, scénarios de jumeaux numériques
- Modèle opérationnel : équipe plateforme, responsables de produits de données par domaine, gestion des mises à jour des versions d'Azure IoT Operations, généralement mensuelles [7]

Le changement clé est le passage de la preuve de concept au produit minimum viable : une PoC prouve que la technologie fonctionne. Un MVP prouve que les personnes travaillent mieux avec elle. Si vous souhaitez ancrer ce passage dans un programme d'amélioration plus large, consultez nos guides sur le [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) et l'[excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/).

---

## Erreurs courantes dans les projets Azure pour la fabrication

1. **La technologie avant la question :** construire une plateforme sans unité métier qui souhaite résoudre un problème précis.
2. **La préversion comme fondation :** fonder la logique métier sur des services en préversion. La mise hors service de Manufacturing data solutions et des agents d'usine illustre ce risque [2].
3. **Des briques obsolètes issues d'anciens guides :** planifier de nouveaux projets sur IoT Central, Time Series Insights ou IoT Edge 1.5 parce qu'un article de 2021 le recommande [8], [10], [12].
4. **La mauvaise référence SKU :** prévoir Azure IoT Operations Essentials pour une usine dotée de machines OPC UA, alors que ce SKU ne comprend pas le connecteur OPC UA [3].
5. **Absence de modèle d'état :** reprendre sans filtrage les codes d'état propres à chaque machine. Les comparaisons entre usines deviennent impossibles.
6. **Tout envoyer dans le cloud :** transmettre les données brutes en pleine résolution puis être surpris par la facture.
7. **La sécurité OT traitée après coup :** placer un cluster de périphérie sur le réseau sans concept de zones et laisser ouvert l'accès en écriture aux automates.
8. **Oublier les étiquettes :** démarrer la maintenance prédictive sans historique structuré des défaillances.
9. **Des KPI sans définitions :** construire des tableaux de bord TRS avant que les usines n'aient convenu des définitions de la disponibilité.
10. **Sous-estimer l'exploitation :** mises à jour régulières, mises à jour de Kubernetes, rotation des certificats et tampon du courtier, qui ne peut être défini qu'au déploiement initial [40], sans responsable désigné.
11. **Laisser les équipes de terrain de côté :** les opérateurs de production apprennent l'existence du projet au moment où la tablette est fixée à leur poste de travail.
12. **Ignorer le périmètre de conformité :** transférer des plans ou des spécifications de pièces de défense dans un espace de travail Fabric partagé sans décision de cadrage CMMC.

---

## Applications sectorielles dans l'écosystème Microsoft

> **Remarque : l'auteur travaille chez iFAKT GmbH.**

Une plateforme construite sur Azure IoT Operations et Fabric fournit des données, mais aucune logique métier pour la planification, les flux de valeur ou la simulation. Les applications sectorielles disponibles via Microsoft AppSource ou Microsoft Marketplace comblent cette lacune.

Un exemple est [Polaris](https://www.m365.fm/entity/polaris/) de [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), une société de logiciels dont le siège se trouve à Stuttgart, en Allemagne. L'éditeur décrit Polaris comme un logiciel permettant de numériser, simuler et optimiser la production, avec les modules VSM/BSM (modélisation des flux de valeur et des swimlanes), Simulator, Optimizer (planification), Operator et Analyzer (analyse des KPI). Selon l'éditeur, la planification est basée sur les contraintes et prend en compte les ressources, les qualifications, les équipes et les stocks tampons ; un cockpit de KPI présente le délai de traversée, les stocks, le taux d'utilisation et le respect des délais de livraison. Polaris VSM est référencé comme offre SaaS dans Microsoft Marketplace [33] ; Microsoft a présenté iFAKT dans le cadre de son programme « ISV Success for Business Applications » [32]. Notre guide sur [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) décrit le produit plus en détail.

Dans l'architecture de ce guide, une telle application se situe dans les couches 6 à 8 : elle utilise les données de processus et de commandes pour modéliser les flux de valeur, simuler des scénarios et optimiser les plans. La forme concrète d'une intégration avec votre plateforme de données reste à préciser avec l'éditeur ; cet article n'avance aucune affirmation à ce sujet.

Quel que soit l'éditeur, quatre questions aident à sélectionner ces applications : l'application lit-elle les données dans des formats ouverts (par exemple des tables Delta dans OneLake ou des événements issus du courtier), ou nécessite-t-elle ses propres interfaces ? Quel système fait référence pour les données de référence, comme les gammes de fabrication et les capacités ? Où les données et les calculs s'exécutent-ils (région, locataire) ? Et comment les résultats, tels qu'un plan optimisé, reviennent-ils dans l'ERP ou le MES de manière maîtrisée ?

---

## FAQ

### Qu'est-ce qu'Azure pour l'industrie manufacturière ?

Azure pour l'industrie manufacturière désigne l'ensemble des services cloud et edge de Microsoft que les industriels utilisent pour connecter leurs usines, stocker et analyser les données de production, et créer par-dessus des applications d'IA et de travail. En 2026, le cœur de l'offre repose sur Azure IoT Operations sur Kubernetes compatible Azure Arc dans l'usine, sur Microsoft Fabric comme plateforme de données, et sur Foundry, Power BI et Copilot pour l'analyse et l'IA [3], [17]. Microsoft regroupe son offre sectorielle sous le nom « Microsoft for Manufacturing », qui combine Azure, Dynamics 365 et Microsoft 365 [1].

### Quelle est la différence entre Azure IoT Hub et Azure IoT Operations ?

IoT Hub est un service cloud auquel les appareils se connectent directement un à un. Azure IoT Operations est un plan de données qui fonctionne dans l'usine sur Kubernetes compatible Azure Arc et relie les machines via OPC UA et d'autres connecteurs à un broker MQTT local [3]. Pour les usines comptant de nombreuses machines, Azure IoT Operations est généralement le bon point de départ ; IoT Hub convient aux appareils distribués et connectés directement. Pour les compromis avec IoT Edge, voir [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### Azure IoT Central est-il en cours de retrait ?

Oui. Depuis le 23 septembre 2026, il n'est plus possible de créer de nouvelles applications IoT Central ; les applications existantes continuent de fonctionner jusqu'au 20 septembre 2029. Microsoft recommande comme cible IoT Hub avec le Device Provisioning Service, Azure Device Registry et Microsoft Fabric ; les tableaux de bord et l'analyse passent à Fabric Real-Time Intelligence [8], [64]. Un avis de retrait pour le 31 mars 2027, apparu dans le portail Azure en février 2024, a été retiré par Microsoft à l'époque en tant que message système erroné [9]. L'annonce de 2026, en revanche, est un avis ordinaire assorti d'un délai de trois ans.

### Qu'est-ce qui a remplacé Azure Time Series Insights ?

Time Series Insights a été retiré le 7 juillet 2024. Microsoft désigne comme cible de migration l'Eventhouse de Microsoft Fabric Real-Time Intelligence [10]. Si vous n'utilisez pas Fabric, Azure Data Explorer est une alternative qui utilise également KQL [19].

### Qu'est-il advenu de Microsoft Cloud for Manufacturing ?

L'offre sectorielle s'appelle désormais « Microsoft for Manufacturing » et regroupe des fonctionnalités d'Azure, de Dynamics 365 et de Microsoft 365 [1]. Les préversions spécifiques « Manufacturing data solutions » et « Factory Operations Agent » ont été retirées le 30 mai 2025, et « Factory Safety Agent » le 23 juin 2025 [2]. Il n'existe pas d'avis distinct pour « Manufacturing data solutions in Microsoft Fabric » ; ne l'intégrez pas dans de nouveaux projets.

### Quels services Azure faut-il pour une usine intelligente ?

Pour une connexion d'usine type : Azure Arc et un cluster Kubernetes dans l'usine, Azure IoT Operations par-dessus (broker, connecteur OPC UA, flux de données), Azure Device Registry pour les actifs, Microsoft Fabric avec Eventstream, Eventhouse et Activator pour les données en temps réel, et Power BI pour le reporting [3], [17]. Les briques d'IA (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) et les jumeaux viennent ensuite. Entra ID, Azure Policy, Cost Management et une solution de sécurité OT forment le cadre.

### Quelle est la différence entre Azure IoT Operations Essentials et Standard ?

Standard offre l'ensemble complet des fonctionnalités. Essentials, disponible depuis la version 2610, est une option à moindre coût pour les déploiements à fort volume ; elle ne fonctionne que sur des clusters à nœud unique et n'inclut pas le connecteur OPC UA [3]. Pour les usines dotées de machines OPC UA, Standard est le point de départ.

### Faut-il des compétences Kubernetes pour Azure IoT Operations ?

Oui, au moins côté exploitation. Azure IoT Operations fonctionne sur des clusters Kubernetes compatibles Azure Arc et se configure à la manière Kubernetes [3]. Pour démarrer, Microsoft documente des installations sur Ubuntu et sur Windows avec AKS Edge Essentials [3]. Prévoyez un développement des compétences ou un partenaire d'exploitation.

### La production continue-t-elle si la connexion Internet tombe ?

Selon Microsoft, Azure IoT Operations peut fonctionner hors ligne pendant 72 heures au maximum, éventuellement en mode dégradé, et retrouve son fonctionnement complet à la reconnexion [3]. Le nombre de messages mis en mémoire tampon pendant cette période dépend de la configuration du broker, définie au déploiement initial [40]. Les fonctions de commande ne doivent jamais dépendre du cloud ; le contrôle reste dans les automates programmables et les systèmes locaux.

### Azure Digital Twins ou digital twin builder dans Fabric ?

Azure Digital Twins est un service généralement disponible, doté de modèles DTDL et d'un accès par API [14]. Digital twin builder fait partie de Fabric Real-Time Intelligence, travaille avec des ontologies sur les données OneLake et est en préversion [15]. Pour des jumeaux numériques de production, pilotés par les développeurs, Azure Digital Twins est aujourd'hui le choix sûr ; pour des jumeaux analytiques sur une plateforme Fabric, un pilote avec digital twin builder vaut la peine. Mirko Peters explique une distinction apparentée, entre le device twin dans IoT Hub et Azure Digital Twins, dans [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Quelles données faut-il pour la maintenance prédictive ?

Des variables de condition à une fréquence d'échantillonnage adaptée, des horodatages synchronisés, le contexte d'exploitation (ordre, produit, état de la machine) et, surtout, un historique de pannes étiqueté issu de la maintenance. Sans historique de pannes, seule la détection d'anomalies est possible dans un premier temps.

### Que signifie la fin de Defender for IoT pour la sécurité de mes systèmes OT ?

Le 2 novembre 2026, Microsoft a officiellement annoncé qu'il retirera complètement le composant de sécurité OT de Defender for IoT en octobre 2029 ; d'ici là, seules des mises à jour de sécurité et des corrections de bogues seront fournies [22]. Un blog de partenaire Microsoft cite plutôt le 31 mai 2028 comme fin de support [39]. Il n'existe pas de remplacement de première partie ; Microsoft propose des connecteurs pour Armis, Dragos et Forescout, dont les solutions sont sous licence séparée [22]. Planifiez le remplacement de façon à ce qu'il soit terminé avant mi-2028.

### IoT Edge vaut-il encore la peine d'être utilisé ?

IoT Edge, en tant que produit, reste pris en charge. La version 1.5 LTS a atteint la fin de support le 10 novembre 2026 ; la version actuelle 1.6 LTS est prise en charge jusqu'au 14 novembre 2028 [12]. Pour les parcs d'appareils Linux existants, la mise à niveau vers la 1.6 est la voie directe. Pour les appareils Windows sous EFLOW 1.5, la page de versions ne mentionne pas d'EFLOW 1.6 LTS ; clarifiez la voie cible à cet endroit. Pour les nouveaux plans de données d'usine, évaluez Azure IoT Operations.

### Azure est-il conforme à CMMC ?

Il n'existe pas de certification CMMC pour Azure lui-même, car CMMC s'applique aux systèmes d'un contractant, et non à une plateforme cloud [55]. Microsoft indique qu'Azure et Azure Government détiennent tous deux des autorisations FedRAMP High couvrant NIST SP 800-171, que vous pouvez obtenir une certification CMMC pour des solutions dans l'un ou l'autre cloud, et que la plupart des contractants de la défense sont mieux alignés avec Azure Government [55]. La règle DFARS qui intègre les exigences CMMC dans les contrats du DoD est déployée par phases depuis le 10 novembre 2025 [54].

### Quel cadre de sécurité un industriel américain doit-il utiliser pour Azure et l'OT ?

Utilisez-les ensemble. NIST CSF 2.0 vous donne la structure de gouvernance et un langage commun avec la direction, les assureurs et les clients [49] ; ISA/IEC 62443 vous fournit le modèle technique pour l'OT (zones, conduits, niveaux de sécurité) [27] ; NIST SP 800-82 Rev. 3 relie les deux avec des recommandations propres à l'OT et des overlays de contrôles [50]. Ajoutez CMMC si vous traitez des FCI ou des CUI pour le DoD [53], et NIS2 pour les sites européens [41].

### Combien coûte Azure pour l'industrie manufacturière ?

Il n'existe pas de chiffre global fiable. Les coûts dépendent du nombre d'usines et de machines, du volume de données, de la rétention, de la capacité Fabric choisie, du matériel en périphérie et des licences. Le principal levier est l'agrégation des données en périphérie. Utilisez le calculateur de prix Azure et introduisez les pratiques FinOps dès la phase 2 [25].

### Quel rôle joue Microsoft 365 dans l'industrie ?

Microsoft 365 est la couche de travail : Teams pour la communication et les notifications entre équipes, Power BI pour les KPI, Power Apps pour la saisie de données au poste de travail et Copilot pour les synthèses et les questions sur les données. Pour les entreprises disposant déjà d'un environnement Microsoft 365, ce lien est souvent le moyen le plus rapide de rendre exploitables les données de l'atelier.

### Par où commencer en tant qu'administrateur Microsoft 365 ou Azure ?

Par les tâches qui relèvent de toute façon de l'IT centrale : les rôles Entra ID pour le personnel OT et les partenaires, une zone d'atterrissage Azure avec des stratégies de balises par usine, un cluster de test Arc incluant les approbations de pare-feu via la chaîne de proxys, et une structure d'espaces de travail Fabric. En parallèle, rencontrez le responsable OT pour comprendre le modèle de zones de l'usine. Les détails figurent dans la section « Où commencer en tant qu'administrateur Microsoft 365 ou Azure » au début de ce guide.

---

## Conclusion

Azure pour l'industrie manufacturière en 2026 relève moins du choix de services que de la discipline. La base technique est claire : Azure IoT Operations on Arc dans l'usine, Microsoft Fabric comme plateforme de données, et Foundry, Power BI et Copilot pour l'analyse et le poste de travail. Dans le même temps, la mise hors service de Time Series Insights et des préversions manufacturières, ainsi que la retraite programmée d'IoT Central et de la sécurité OT de Defender for IoT, montrent que la gestion du cycle de vie fait partie du travail d'architecture.

Trois éléments font la différence : votre propre modèle de données neutre vis-à-vis des outils, fondé sur ISA-95 ; une conception de sécurité fondée sur ISA/IEC 62443 et NIST CSF 2.0, couvrant également CMMC ou NIS2 lorsqu'ils s'appliquent ; et une concentration constante sur les cas d'usage, avec une référence mesurée. En procédant ainsi, vous construisez une plateforme qui sert la maintenance prédictive, la traçabilité, les jumeaux numériques et l'IA à partir d'une même base de données, et qui survit au prochain changement de nom de Microsoft.

### Pour aller plus loin sur m365.fm

**Épisodes**
- [Maintenance prédictive sur Azure : ce dont vous avez réellement besoin avant le modèle](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps pour l'IT industriel](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Traçabilité et généalogie](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Jumeaux numériques sur Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Cartographie de la chaîne de valeur comme modèle de données vivant](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Articles**
- [Jumeau numérique dans l'industrie : par où commencer](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [De l'ERP à l'atelier : construire le jumeau numérique](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Planification de la production aéronautique : délai de livraison et traçabilité](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge ou Azure IoT Operations : choisir la bonne architecture industrielle](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin ou Azure Digital Twins : choisir la bonne couche pour l'IoT industriel](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Glossaire**
- [Industrie 4.0](https://www.m365.fm/entity/industry-4-0/) · [Jumeau numérique](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Planification et ordonnancement avancés](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Maintenance productive totale](https://www.m365.fm/entity/total-productive-maintenance/) · [Indicateur clé de performance](https://www.m365.fm/entity/key-performance-indicator/) · [Mise en service virtuelle](https://www.m365.fm/entity/virtual-commissioning/)

**Guides connexes**
- [Jumeau numérique dans l'industrie](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Indicateurs de performance industrielle](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Management de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/)
- [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/)
- [Planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Lean](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Sur m365.fm, il écrit sur l'intersection entre la planification de production, les jumeaux numériques et le cloud Microsoft, en traduisant des sujets industriels tels que les chaînes de valeur, la traçabilité et la maintenance prédictive pour un public Microsoft 365 et Azure.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

*Dernière relecture : 20 novembre 2026 (vérification des faits auprès des sources primaires de Microsoft, NIST, CISA, FDA, SEC, BSI et de l'UE). Prochaine révision du tableau d'état des services : février 2027.*

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
