# SEO metadata

| Field | Value |
|---|---|
| Meta title | Système d'exécution de fabrication (MES) et ISA-95 : guide |
| Meta description | Rôle d'un système d'exécution de fabrication, niveaux et modèles d'activité ISA-95, MES vs ERP vs SCADA, liste de contrôle fournisseurs, feuille de route et ROI. |
| Slug | `mes-isa-95` |

# Système d'exécution de fabrication (MES) et ISA-95 : fonctions, niveaux, sélection et ROI

> **Réponse courte :** Un système d'exécution de fabrication (MES) est la couche logicielle qui gère, surveille et enregistre l'exécution des ordres de fabrication sur l'atelier, en temps réel, entre le système ERP qui planifie et les systèmes de commande qui pilotent les machines [8]. La norme ISA-95 (ANSI/ISA-95, au niveau international CEI 62264) définit la place de cette couche (niveau 3, gestion des opérations de fabrication), les activités qu'elle couvre et les informations qu'elle échange avec l'ERP [1][3].

> **Points clés**
> - Gartner définit le MES comme un logiciel orienté production qui « gère, surveille et synchronise l'exécution des processus physiques en temps réel » et coordonne les ordres de travail avec la planification, l'ERP, le PLM et les systèmes qualité [8].
> - La norme ISA-95 comporte huit parties. La partie 1 (modèles et terminologie) a été republiée en 2025 ; la partie 3 (modèles d'activités) date de 2013 [1][2].
> - La norme ISA-95 décrit cinq niveaux. Les niveaux 0 à 2 correspondent au processus physique et à sa commande, le niveau 3 à la gestion des opérations de fabrication (MES et systèmes associés), le niveau 4 à la planification d'entreprise et à la logistique (ERP) [1].
> - Le modèle d'activités de la partie 3 répartit le niveau 3 en quatre catégories (production, maintenance, essais qualité, stocks) et reprend les mêmes huit activités dans chacune : gestion des définitions, gestion des ressources, ordonnancement détaillé, distribution, gestion de l'exécution, collecte de données, suivi et analyse de performance [3].
> - Le modèle MESA International de 1997 identifiait 11 fonctions MES ; la norme ISA-95 a ensuite intégré cette réflexion [9][12]. MESA a cessé ses activités le 30 juin 2026, et son contenu est passé à l'ISA [11].
> - Un espace de noms unifié (UNS) modifie la façon dont les données circulent ; il ne remplace ni la logique MES ni le vocabulaire ISA-95.
> - Un dossier de rentabilité MES tient généralement à une ou deux lignes de bénéfices. Dans l'exemple détaillé ci-dessous, le même projet affiche une VAN positive à cinq ans dans le scénario de base et négative dans le scénario prudent.
> - Commencez par le modèle de données et une seule chaîne de valeur, et non par la liste complète des fonctionnalités.

## Table des matières

1. [Qu'est-ce qu'un système d'exécution de fabrication (MES) ?](#quest-ce-quun-système-dexécution-de-fabrication-mes-)
2. [Brève histoire : de l'AMR et du MESA-11 à l'ISA-95 et au-delà](#brève-histoire--de-amr-et-mesa-11-à-isa-95-et-au-delà)
3. [ISA-95 expliquée : la norme, ses parties et ses niveaux](#lisa-95-expliqué--la-norme-ses-parties-et-ses-niveaux)
4. [Les modèles ISA-95 qui comptent pour un projet MES](#les-modèles-isa-95-qui-comptent-pour-un-projet-mes)
5. [MES vs ERP vs MOM vs SCADA et autres systèmes d'atelier](#mes-vs-erp-vs-mom-vs-scada-et-autres-systèmes-dusine)
6. [Fonctions MES en détail](#les-fonctions-mes-en-détail)
7. [Intégration : B2MML, OPC UA, MTConnect et l'espace de noms unifié](#intégration--b2mml-opc-ua-mtconnect-et-lespace-de-noms-unifié)
8. [Le MES dans les industries réglementées](#mes-dans-les-industries-réglementées)
9. [Options de déploiement et d'architecture : suite, plateforme, module ERP, cloud](#options-de-déploiement-et-darchitecture)
10. [Développer en interne ou acheter](#fabriquer-ou-acheter)
11. [Liste de contrôle pour le choix d'un éditeur MES](#liste-de-contrôle-pour-le-choix-dun-éditeur-de-mes)
12. [Feuille de route de mise en œuvre du MES](#feuille-de-route-de-mise-en-œuvre-dun-mes)
13. [Coût et retour sur investissement du MES avec un exemple détaillé](#coût-et-roi-dun-mes-avec-un-exemple-chiffré)
14. [Indicateurs MES : quoi mesurer et comment](#kpi-mes--quoi-mesurer-et-comment)
15. [Les personnes et l'atelier](#les-personnes-et-latelier)
16. [Erreurs courantes de mise en œuvre du MES](#erreurs-courantes-dans-la-mise-en-œuvre-dun-mes)
17. [Limites du MES et de l'ISA-95](#limites-du-mes-et-de-lisa-95)
18. [Glossaire](#glossaire)
19. [FAQ](#faq)
20. [Conclusion et premières étapes](#conclusion-et-premières-étapes)

## Qu'est-ce qu'un système d'exécution de fabrication (MES) ?

Un système d'exécution de fabrication est le logiciel qui transforme un ordre de fabrication en produits finis, documentés. L'ERP indique à l'usine *ce qu'il faut* fabriquer, en quelle quantité et pour quand. Les machines et leurs automates fabriquent les pièces. Le MES se situe entre les deux : il lance et séquence le travail, indique aux opérateurs et aux machines quoi faire ensuite, collecte ce qui s'est réellement passé (quantités, temps, paramètres, matières, défauts, qui a réalisé l'opération) et renvoie le résultat.

La définition du marché proposée par Gartner constitue un bon point de référence, car elle est neutre vis-à-vis des éditeurs et précise. Elle décrit le MES comme « une catégorie spécialisée de logiciels orientés production » qui « gère, surveille et synchronise l'exécution en temps réel des processus physiques de transformation des matières premières en produits intermédiaires et/ou finis ». Elle ajoute que ces systèmes coordonnent les ordres de travail avec la planification de production et avec les systèmes d'entreprise tels que l'ERP, la gestion du cycle de vie des produits et la gestion de la qualité, qu'ils fournissent un retour sur la performance des processus et qu'ils permettent la traçabilité et la généalogie jusqu'au niveau des composants et des matières [8].

### L'idée centrale en une phrase

Un MES referme la boucle entre le plan et la réalité, poste par poste, afin que chacun, de l'opérateur au contrôleur de gestion, travaille à partir du même enregistrement fiable et à jour de ce qui s'est passé sur l'atelier.

### Ce que fait un MES pendant un poste type

Un exemple concret parle davantage qu'une liste de fonctionnalités. Prenons une usine de taille moyenne qui usine et assemble des distributeurs hydrauliques sur quatre lignes :

1. **06h00, prise de poste.** Le MES affiche au responsable la liste d'affectation de la ligne 2 : douze ordres libérés depuis l'ERP, séquencés par l'ordonnanceur afin de minimiser les changements de série. Deux ordres sont signalés parce qu'un instrument de mesure doit être étalonné.
2. **06h10.** L'opérateur scanne le suivi de fabrication du premier ordre (ou le sélectionne sur un terminal). Le MES vérifie que l'opérateur est habilité pour cette opération, que la version du programme sur la CNC correspond à la gamme libérée et que le lot de matière première présent dans le casier appartient à l'ordre. Il affiche la révision en vigueur de l'instruction de travail.
3. **06h12 à 13h30.** La machine transmet ses cycles et ses états (en marche, à l'arrêt, en alarme) via OPC UA ou MTConnect. Le MES comptabilise les pièces bonnes et rejetées, enregistre les temps d'arrêt et demande à l'opérateur un code motif lorsqu'un arrêt dépasse deux minutes. Les mesures effectuées en cours de fabrication alimentent des cartes de maîtrise statistique des procédés (MSP) ; un point hors contrôle bloque l'opération suivante jusqu'à la validation d'un technicien.
4. **11h45.** Un lot de joints s'avère suspect. Comme le MES a enregistré quel lot a été intégré à quel numéro de série de distributeur, le service qualité peut isoler 140 distributeurs au lieu de toute la production d'une semaine.
5. **14h00, relève de poste.** Le MES transmet à l'équipe suivante les quantités, les rebuts, le TRS et les anomalies en cours, et enregistre dans l'ERP les quantités confirmées ainsi que les consommations de matières.

Sans MES, une grande partie de ces opérations se fait sur des suivis papier, des tableaux blancs et des tableurs, saisis dans l'ERP des heures ou des jours plus tard. Cela fonctionne, jusqu'à un certain point. Le coût apparaît sous forme de données tardives ou erronées, de rappels produits lents, de défauts qualité non détectés et de longues investigations. L'étude approfondie sur la [fabrication sans papier](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) détaille le passage des suivis papier aux instructions de travail numériques, qui constitue souvent le premier module MES utilisé par une usine.

### La place du MES parmi les systèmes de l'usine

La norme ISA-95 place le MES au **niveau 3**, gestion des opérations de fabrication, entre la planification d'entreprise et la logistique au niveau 4 (ERP), et les couches de contrôle des niveaux 0 à 2 (capteurs, automates programmables, DCS, SCADA) [1]. Le niveau 3 n'est pas un système unique. La même couche regroupe les systèmes de gestion de laboratoire (LIMS), de gestion d'entrepôt (WMS), de gestion de la maintenance (GMAO) et d'autres ; ensemble, on les désigne souvent sous le nom de systèmes de gestion des opérations de fabrication [14]. La section 5 les compare.

### Les avantages d'un MES et ce que disent les preuves

La plupart des pages consacrées aux MES présentent les avantages sous forme de pourcentages impressionnants, sans source. Voici ce que l'on peut affirmer avec prudence :

| Avantage | Mécanisme | Ce qu'il faut mesurer | Réserve |
|---|---|---|---|
| Données de production plus rapides et plus fiables | Données saisies à la source, non retapées | Latence des données, saisies manuelles par ordre | Seulement si les données de référence (gammes, nomenclatures) sont correctes |
| Délais de cycle plus courts | Moins d'attente pour les formalités, libération et expédition plus rapides | Délai de livraison de la commande, temps d'attente en file | *Control Engineering* indique que MESA International évalue la réduction moyenne des délais de cycle de fabrication à 45 %; à considérer comme une affirmation d'association, non comme un référentiel [9] |
| Moins de défauts clients | Contrôles imposés, MSP, verrouillages avant l'étape suivante | Taux de rendement au premier passage, réclamations clients | Dépend du fait que les contrôles soient réellement configurés comme arrêts bloquants |
| Rappels plus rapides et plus ciblés | Généalogie des lots et des numéros de série | Délai d'identification des unités concernées | Exige un scannage rigoureux des matières |
| Meilleur TRS sur la contrainte | Motifs d'arrêt visibles, réaction plus rapide | TRS, MTTR | N'a de valeur financière que si la production supplémentaire peut être vendue |
| Préparation aux audits | Enregistrements électroniques, pistes d'audit, signatures électroniques | Heures par audit, constats | L'effort de validation dans les industries réglementées est substantiel |

Un article d'*Automation World* de 2006 indique que plus de 40 fabricants mondiaux avaient utilisé ISA-95 pour définir leurs exigences MES, et que le temps de définition de ces exigences était passé de plusieurs mois à quatre ou six semaines [10]. Il s'agit d'un effet modeste et plausible d'un vocabulaire commun, et une bonne raison de lire les sections suivantes avant de rédiger un cahier des charges.

## Brève histoire : de AMR et MESA-11 à ISA-95 et au-delà

L'histoire explique pourquoi les éditeurs, les cabinets d'analyse et les normes emploient des termes légèrement différents pour désigner la même chose.

### Début des années 1990 : le terme MES

Selon *Automation World*, le cabinet d'analyse bostonien AMR Research a établi le concept de MES en 1992 comme couche intermédiaire entre les systèmes d'entreprise et les systèmes de contrôle, offrant visibilité et pilotage [10]. Auparavant, les usines utilisaient des systèmes de pilotage d'atelier, de collecte de données et de qualité, souvent développés en interne pour un seul usage ; leurs fonctions se chevauchaient et communiquaient rarement entre elles [14].

### 1997 : MESA-11

MESA International (Manufacturing Enterprise Solutions Association) a publié son livre blanc sur les MES en 1997 [15], ainsi que le modèle fonctionnel connu sous le nom de **MESA-11** [12]. Les onze fonctions étaient les suivantes [9] :

1. Allocation et état des ressources
2. Ordonnancement des opérations / détaillé
3. Lancement des unités de production
4. Gestion documentaire
5. Acquisition de données
6. Gestion de la main-d'œuvre
7. Management de la qualité
8. Gestion des processus
9. Gestion de la maintenance
10. Suivi des produits et généalogie
11. Analyse des performances

La définition de MESA de 1997 insistait sur le fait qu'un MES doit « fournir une information permettant d'optimiser les activités de production », formulation qu'*Automation World* jugeait encore pragmatique en 2006 [10]. Plusieurs des onze fonctions (maintenance, main-d'œuvre, gestion documentaire) sont aujourd'hui souvent assurées par des systèmes distincts, raison pour laquelle le modèle a été critiqué comme « trop large » dès l'époque [9].

### 2000 à 2013 : ISA-95

Le comité ISA95 s'est appuyé sur le Purdue Reference Model for computer integrated manufacturing [1]. La partie 1 est parue en 2000 et la partie 3, avec les modèles d'activité de niveau 3, en 2005 ; des sources secondaires décrivent ISA-95 comme ayant fusionné la vue fonctionnelle de MESA avec la hiérarchie de Purdue [12][14]. D'autres parties ont suivi jusqu'en 2020, et la partie 1 a été republiée en 2025 [1][2]. La section 3 les répertorie.

### À partir de 2004 : MOM, MES collaboratif et modèles ultérieurs

Comme ISA-95 désigne le niveau 3 comme « gestion des opérations de fabrication », le terme MOM (Manufacturing Operations Management) s'est répandu pour désigner un périmètre plus large (production, mais aussi qualité, maintenance et opérations de stock), le MES en constituant le cœur productif [10]. MESA a lui-même publié plusieurs modèles ultérieurs ; l'article de *Control Engineering* consacré au modèle d'origine indique qu'il était alors l'un des huit modèles MESA [9]. Nous n'avons pas pu vérifier, à partir d'une source primaire, les noms et les dates des modèles ultérieurs de MESA (souvent cités comme c-MES en 2004 et le modèle MESA de 2008) [unverified: noms et dates non confirmés par une source primaire]. La page de MESA sur l'historique de ses modèles redirige désormais vers ISA, et l'annonce de MESA en 2022 de son dernier modèle indique seulement qu'elle avait publié « trois (désormais quatre) modèles MESA » [43].

### 2026 : la MESA se dissout, l'ISA reprend son contenu

MESA International a voté la cessation de ses activités à compter du 30 juin 2026 ; l'ISA indique que « le contenu et les programmes éducatifs de la MESA seront repris par l'ISA » [11]. Cela a des conséquences concrètes, car la MESA maintenait **B2MML**, l'implémentation XML de l'ISA-95 utilisée dans de nombreuses interfaces ERP-MES [5]. Vérifiez auprès de l'ISA où les schémas B2MML et leurs futures versions seront hébergés avant de les intégrer à un contrat. En novembre 2026, les schémas B2MML et BatchML sont toujours publiés dans le dépôt MESAInternational sur GitHub, dont le README ne mentionne pas ce transfert [36] [unverified: l'hébergement futur après le transfert n'est pas documenté].

### Les années 2020 : IIoT, cloud et MES composables

Trois évolutions façonnent les projets MES actuels : la collecte de données machines est devenue moins coûteuse (OPC UA, MTConnect, MQTT), le déploiement cloud et hybride est devenu courant, et les éditeurs proposent de plus en plus le MES comme une plateforme de petites applications plutôt que comme une suite monolithique (MES « composable » ou de « nouvelle génération »). La section 9 explique ce que cela implique pour votre architecture et votre contrat.

## L'ISA-95 expliqué : la norme, ses parties et ses niveaux

L'ISA décrit l'ISA-95, « également connue sous le nom d'ANSI/ISA-95 ou IEC 62264 », comme un ensemble de normes internationales pour l'intégration des systèmes logistiques aux systèmes de contrôle de la production [1]. Elle organise les technologies et les processus métier en couches définies par les activités qui s'y déroulent, et décrit comment une entreprise peut construire des interfaces entre ces couches. L'ISA souligne que l'architecture, fondée sur le modèle de Purdue, peut être appliquée « quelle que soit la technologie utilisée », et que la hiérarchie des équipements convient aux industries discrètes, continues et logistiques [1].

Deux conséquences en découlent. D'abord, l'ISA-95 est **neutre sur le plan technologique** : elle ne dit rien du choix de la base de données, du protocole ou du fournisseur. Ensuite, son centre d'intérêt principal est **l'interface entre le niveau 3 et le niveau 4** [1], précisément le point où la plupart des projets MES se bloquent (qui gère les gammes, quand une quantité est « confirmée », comment les rebuts sont enregistrés).

### ISA-95 et IEC 62264 : même contenu, numérotation différente

L'ISA élabore la série sous le nom ANSI/ISA-95 ; la CEI la publie sous le nom IEC 62264. L'édition 2025 de la partie 1 porte la désignation ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), où « Mod » indique une adoption modifiée [1][2]. Les éditions ne sont pas toujours synchronisées. Les IEC 62264-1 et -2 ont été publiées en 2013, la partie 3 en 2016, la partie 4 en 2015 et la partie 5 en 2016 [7] ; la IEC 62264-6, modèle de service de messagerie, est parue en édition 1.0 le 26 juin 2020 [6]. Lorsqu'un contrat ou un cahier des charges cite « ISA-95 », indiquez la partie et l'édition.

### Les huit parties de l'ISA-95

| Partie | Titre (ANSI/ISA-95) | Édition courante selon l'ISA | Périmètre en termes simples |
|---|---|---|---|
| 1 | Modèles et terminologie | 2025 (IEC 62264-1 Mod) | Périmètre des opérations de fabrication et de contrôle, organisation des actifs physiques, fonctions d'interface, informations partagées |
| 2 | Objets et attributs pour l'intégration entreprise-système de contrôle | 2018 | Les objets et attributs échangés à l'interface niveau 3 / niveau 4 |
| 3 | Modèles d'activités de la gestion des opérations de fabrication | 2013 | Les activités au sein du niveau 3 et une partie des données qu'elles échangent |
| 4 | Objets et attributs pour l'intégration de la gestion des opérations de fabrication | 2018 | Modèles d'objets pour les informations circulant entre les activités du niveau 3, indépendamment du degré d'automatisation |
| 5 | Transactions métier vers fabrication | 2018 | Transactions entre les niveaux 3 et 4 (verbes tels que get, process, sync) |
| 6 | Modèle de service de messagerie | 2014 | Messagerie entre les niveaux 3 et 4 et au sein du niveau 3 |
| 7 | Modèle de service d'alias | 2017 | Mise en correspondance d'identifiants équivalents entre les opérations de fabrication et d'autres domaines |
| 8 | Profils d'échange d'informations | 2020 | Profils pour des interfaces spécifiques entre les niveaux 4 et 3 ou entre activités du niveau 3 |

Source : page ISA-95 de l'ISA [1]. Notez que l'ISA indique 2014 pour la partie 6, alors que l'édition CEI de la partie 6 date de 2020 [6].
Pour la plupart des projets MES, les parties 1 à 3 font l'essentiel du travail : elles fournissent le vocabulaire, le modèle de niveaux et le modèle d'activités nécessaires à un cahier des charges. Les parties 2, 4 et 5 sont importantes lors de la conception des interfaces et des modèles de données. Les parties 6 à 8 concernent surtout les architectes d'intégration et les éditeurs de logiciels.

### Ce qui a changé dans l'édition 2025 de la partie 1

L'ISA a annoncé la nouvelle partie 1 le 10 avril 2025. Elle met à jour la version de 2010, prend en compte des fonctions d'entreprise spécifiques, clarifie la frontière entre le domaine de l'entreprise et les domaines de la fabrication et du contrôle, et améliore la cohérence avec les autres parties [2]. Le président du comité ISA95, Christian Monchinski, l'a liée à des « architectures de plus en plus modulaires dans les opérations commerciales et de fabrication » et à un passage vers des conceptions centrées sur les données, et a déclaré que la mise à jour « réaffirme l'importance des interfaces d'intégration normalisées » [2]. Pour les praticiens, c'est un signal : l'ISA-95 doit rester le vocabulaire commun des architectures modulaires et pilotées par événements, et non être remplacée par elles.

### Les cinq niveaux de l'ISA-95

L'ISA-95 hérite son modèle de niveaux de Purdue. Les niveaux décrivent des *fonctions*, et non des ordinateurs ou des segments de réseau [1][4].

| Niveau | Nom | Ce qui se passe ici (notre synthèse) | Systèmes typiques | Échelle de temps typique |
|---|---|---|---|---|
| 4 | Planification et logistique d'entreprise | Commandes, besoins en matières, stocks, expédition, coûts pour l'usine | ERP, planification de la chaîne d'approvisionnement | Mois, semaines, jours [4] |
| 3 | Gestion des opérations de fabrication | Contrôle des flux de travail et des recettes pour produire les produits finis ; ordonnancement détaillé, distribution, enregistrements, qualité, maintenance et opérations de stock | MES, LIMS, WMS, GMAO, QMS, historien, APS (ordonnancement détaillé) | Jours, équipes, heures, minutes, secondes [4] |
| 2 | Surveillance et contrôle de supervision | Surveillance et contrôle du processus physique | SCADA, IHM, DCS, PLC | Réponses en temps réel mesurées en sous-secondes [4] |
| 1 | Détection et manipulation | Capteurs, actionneurs, dispositifs intelligents, vannes | Équipements de terrain | Non précisé dans les sources utilisées ici |
| 0 | Processus physique | Les machines et la matière transformée | Machines, lignes, équipements de procédé | Non applicable |

Deux remarques. La page de l'ISA elle-même place SCADA dans la ligne du niveau 3 comme exemple de système de niveau 3 à côté du MES [1], tandis que le résumé de l'OPC Foundation attribue l'automatisation et le contrôle aux niveaux 1 et 2, et le MOM au niveau 3 [4]. En pratique, SCADA chevauche la frontière 2/3 : ses écrans et la gestion des alarmes relèvent du contrôle de supervision (niveau 2), tandis que ses fonctions d'historique et de reporting servent souvent le niveau 3. Inutile de débattre de la case ; décidez quel système fait référence pour chaque donnée. Deuxièmement, l'OPC Foundation insiste sur le fait que « chaque niveau a sa propre définition du temps réel » [4]. Un MES qui met à jour un tableau de bord toutes les 30 secondes est en temps réel pour un superviseur, et bien trop lent pour un verrouillage machine.

### Les niveaux ne sont pas des zones réseau

Une erreur fréquente consiste à traiter les niveaux de l'ISA-95 et les niveaux de Purdue utilisés en sécurité OT comme une seule et même chose. L'ISA-95 décrit des fonctions et des informations ; la segmentation réseau suit une logique différente, désormais définie dans l'ISA/IEC 62443 avec les zones et les conduits [23]. L'ISA note que l'ISA-95 s'appuie sur le modèle de référence de Purdue pour décrire la segmentation réseau des systèmes de contrôle industriels [1], mais une *fonction* de niveau 3 peut s'exécuter dans un locataire cloud, tandis qu'un *serveur* de niveau 3 dans votre usine se trouve dans une zone de sécurité précise. Le guide [cybersécurité OT et ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) couvre les zones, les conduits et la DMZ ; le NIST SP 800-82 Rev. 3 est le guide américain de sécurité OT [24].

### L'ISA-95 est-elle toujours pertinente ?

Réponse de l'ISA elle-même : les niveaux aident encore à décrire les frontières des systèmes pour l'Industrie 4.0 et la fabrication intelligente, bien que le modèle soit issu d'une hiérarchie [1]. C'est conforme à la pratique. La hiérarchie comme *chemin des données* (chaque valeur remonte niveau par niveau via des interfaces point à point) a mal vieilli, et la section 7 présente les alternatives. La hiérarchie comme *carte des responsabilités et du vocabulaire* n'a pas vieilli.

## Les modèles ISA-95 qui comptent pour un projet MES

ISA-95 comprend plusieurs modèles. Quatre d'entre eux méritent d'être connus par leur nom avant de rédiger un document d'exigences MES.

### 1. La hiérarchie fonctionnelle (niveaux)

Déjà présentée ci-dessus. Utilisez-la pour dessiner un schéma de contexte système avec chaque système existant placé à son niveau et chaque interface représentée par une flèche étiquetée.

### 2. La hiérarchie des équipements

ISA-95 organise l'usine physique selon une hiérarchie des équipements fondée sur les rôles : **entreprise, site, zone, centre de travail, unité de travail** (les noms utilisés par les explications courantes et par le guide complémentaire sur Azure) [1][27]. Les centres de travail sont ensuite typés, par exemple en cellules de procédé (batch), unités de production (continu), lignes de production (discret) et zones de stockage, avec des unités de travail correspondantes telles que des unités, des cellules de travail et des unités de stockage. Le modèle d'information ISA-95 de l'OPC Foundation reprend exactement ces noms de niveaux [32], et le projet public de 1999 de la partie 1 associe les cellules et unités de procédé au batch, les unités de production au continu, et les lignes de production et cellules de travail au discret [33]. La correspondance établie par l'OPC Foundation indique que les équipements peuvent être imbriqués et que le modèle décrit les *rôles* que jouent les équipements dans la production, distincts des actifs physiques qui les composent [5].

Pourquoi c'est important : la hiérarchie des équipements devient votre convention de nommage dans le MES, l'historien, la GMAO, l'arborescence de rubriques de l'espace de noms unifié et la plateforme de données. Une usine qui désigne la même machine « L2-CNC3 », « Ligne 2 Mazak » et « WC-4711 » dans trois systèmes paie ce choix à chaque rapport et à chaque intégration.

**Exemple de hiérarchie pour l'usine de vannes :**

| Niveau | Exemple |
|---|---|
| Entreprise | Acme Fluid Power |
| Site | Usine de Dayton |
| Zone | Usinage ; Assemblage et essais ; Entrepôt |
| Centre de travail | Ligne 2 (ligne de production) ; Poste d'essais T1 (groupe de cellules de travail) ; Magasin de matières premières (zone de stockage) |
| Unité de travail | CNC 3 ; Poste de lavage ; Testeur d'étanchéité LT-1 ; Zone de racks A |

### 3. Les modèles d'objets (partie 2 et partie 4)

ISA-95 décrit les informations échangées entre l'ERP et le MES, et entre les activités du MES, sous forme de modèles d'objets dotés d'attributs. La spécification complémentaire de l'OPC Foundation désigne quatre modèles de ressources échangés entre les systèmes ERP et MOM : **matière** (y compris les propriétés des matières et les lots), **équipement** (dans la mesure où il concerne les opérations réalisées), **actifs physiques** (les actifs qui composent l'équipement) et **personnel** (rôles et qualifications) [4][5]. Autour de ces modèles, ISA-95 organise l'échange en quatre catégories d'information qui reflètent le cycle de vie d'un ordre : **définition du produit** (comment le fabriquer), **capacité de production** (quelles ressources sont disponibles), **planning de production** (quoi fabriquer et quand) et **performance de production** (ce qui a été fabriqué). Ces catégories correspondent aux noms des activités de la partie 3 [3] ; le projet public de 1999 de la partie 1 regroupe le planning et la performance sous « informations de production » [33].

Une règle pratique issue de ce modèle : l'ERP détient le « quoi et quand », le MES détient le « comment et ce qui s'est réellement passé ». Lorsque l'ERP contient une gamme avec des temps opératoires et que le MES contient une définition de travail plus détaillée, avec paramètres et instructions, décidez explicitement lequel des deux est la référence pour chaque attribut, et comment les modifications circulent.

### 4. Le modèle d'activités (partie 3)

C'est la partie la plus utile et la moins expliquée d'ISA-95. La partie 3 divise la gestion des opérations de fabrication en quatre catégories : **opérations de production, opérations de maintenance, opérations d'essais qualité et opérations de gestion des stocks**. Au sein de chacune, elle utilise les mêmes huit activités génériques [3] :

| Activité générique | Opérations de production | Opérations de maintenance | Opérations d'essais qualité | Opérations de stock |
|---|---|---|---|---|
| Gestion des définitions | Gestion des définitions de produits (gammes, recettes, instructions de travail) | Gestion des définitions de maintenance (listes de tâches, procédures) | Gestion des définitions d'essais qualité (spécifications d'essai, plans d'échantillonnage) | Gestion des définitions de stock (règles de stockage et de transfert) |
| Gestion des ressources | Gestion des ressources de production (personnel, équipements, disponibilité et qualification des matières) | Gestion des ressources de maintenance (techniciens, pièces de rechange, outillage) | Gestion des ressources d'essais qualité (équipements de laboratoire, analystes) | Gestion des ressources de stock (emplacements de stockage, équipements de manutention) |
| Ordonnancement détaillé | Ordonnancement détaillé de la production (séquence sur les ressources) | Ordonnancement détaillé de la maintenance | Ordonnancement détaillé des essais qualité | Ordonnancement détaillé du stock (mouvements, réapprovisionnement) |
| Répartition | Répartition de la production (lancement du travail vers les postes) | Répartition de la maintenance (ordres de travail vers les techniciens) | Répartition des essais qualité (échantillons vers le laboratoire) | Répartition du stock (ordres de transfert) |
| Gestion de l'exécution | Gestion de l'exécution de la production (guider et vérifier l'exécution) | Gestion de l'exécution de la maintenance | Gestion de l'exécution des essais qualité | Gestion de l'exécution du stock |
| Collecte de données | Collecte de données de production (comptages, temps, paramètres) | Collecte de données de maintenance (constats, heures, pièces) | Collecte de données d'essais qualité (résultats) | Collecte de données de stock (mouvements, inventaires) |
| Suivi | Suivi de la production (en-cours, traçabilité, remontée de données vers l'ERP) | Suivi de la maintenance (historique par équipement) | Suivi des essais qualité (résultats par lot ou numéro de série) | Suivi du stock (emplacement et statut des matières) |
| Analyse de performance | Analyse de performance de la production (TRS, rendement, temps de cycle) | Analyse de performance de la maintenance (MTBF, MTTR) | Analyse de performance des essais qualité (capabilité, tendances) | Analyse de performance du stock (rotations, exactitude) |

Les noms des lignes et des colonnes suivent les titres de clauses de l'ANSI/ISA-95.00.03-2013 (clauses 6 à 9) [3] ; les exemples entre parenthèses sont de notre fait. *Automation World* a résumé la même répartition sous la forme « production, maintenance, qualité et stock » [13].

**Comment utiliser la matrice dans un projet :** Imprimez-la sous forme de grille de 4 × 8. Pour chacune des 32 cellules, indiquez quel système assure aujourd'hui cette fonction (papier, Excel, ERP, MES, GMAO, LIMS, WMS, personne) et quel système devrait l'assurer après le projet. Les cellules vides et les cellules où figurent trois systèmes constituent votre discussion de périmètre. Un résultat type pour une usine de production discrète : colonne production principalement assurée par le MES, colonne maintenance dans la GMAO, essais qualité répartis entre le MES (contrôles en cours de fabrication) et le LIMS ou le QMS (essais de laboratoire, actions correctives et préventives), stock réparti entre l'ERP (niveaux de stock) et le WMS ou le MES (mouvements vers la ligne). L'ordonnancement détaillé dans la colonne production est souvent confié à un APS (voir [ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Remarque sur l'ISA-88 et la VDI 5600

Deux cadres apparentés apparaissent dans les projets MES. **L'ISA-88** est la norme de conduite des procédés par lots ; son modèle de contrôle procédural (procédures, procédures unitaires, opérations, phases) a été adopté par la CEI sous la référence CEI 61512-1 [34] et constitue le mode usuel de structuration des recettes dans la pharmacie, l'agroalimentaire et la chimie. BatchML, le compagnon de B2MML, met en œuvre l'ISA-88 [36], et de nombreux produits MES implémentent les dossiers de lots électroniques à partir de cette base [unverified: observation de pratique]. **La VDI 5600**, une directive de l'Association des ingénieurs allemands (partie 1 datée d'octobre 2016), liste les tâches MES d'une manière proche du MESA-11 et est courante dans les usines allemandes et les appels d'offres des maisons mères allemandes [21].

## MES vs. ERP vs. MOM vs. SCADA et autres systèmes d'usine

« Quelle est la différence entre MES et ERP ? » est l'une des questions les plus fréquentes sur les MES, suivie de MES vs. SCADA. La version courte : l'ERP planifie et comptabilise, le MES exécute et enregistre, le SCADA supervise et contrôle les machines. La version détaillée nécessite un tableau, car les frontières dépendent du secteur d'activité et des produits que vous possédez déjà.

### Tableau comparatif

| Dimension | ERP (Niveau 4) | MES (Niveau 3) | MOM (Niveau 3, plus large) | SCADA / IHM (Niveau 2, en partie 3) | Historien |
|---|---|---|---|---|---|
| Question principale | Que devons-nous fabriquer, acheter et expédier, et combien cela a-t-il coûté ? | Comment cet ordre est-il exactement fabriqué, et que s'est-il réellement passé ? | Comment la production, la qualité, la maintenance et les opérations de stock fonctionnent-elles ensemble ? | Que fait la machine ou le procédé en ce moment, et comment le commander ? | Quelles ont été les valeurs de procédé dans le temps ? |
| Horizon temporel | Mois, semaines, jours [4] | Équipes, heures, minutes, secondes [4] | Identique au MES | Sous-secondes à secondes [4] | Secondes à années |
| Unité de travail | Ordre de fabrication, bon de commande, commande client | Opération, étape, lot, numéro de série | Ordre plus essai, ordre de travail de maintenance, ordre de transfert | Variable, alarme, consigne | Variable de série temporelle |
| Données types | Nomenclature, gamme, coût standard, stock, demande | Instructions de travail, temps et quantités réels, paramètres, généalogie, défauts, validations | Données MES plus résultats de laboratoire, historique de maintenance, mouvements de matières | Valeurs en direct, alarmes, commandes opérateur | Séries temporelles compressées |
| Utilisateurs | Planification, achats, finance, ventes | Opérateurs, superviseurs, qualité, ingénieurs procédé | Direction d'usine, toutes les fonctions opérationnelles | Opérateurs de salle de contrôle, techniciens de maintenance | Ingénieurs, analystes |
| Référence de vérité pour | Écritures comptables, valeur des stocks, demande | Enregistrement tel que réalisé, historique d'exécution | Enregistrements opérationnels de toutes catégories | États de commande et alarmes | Historique des procédés |
| Défaillance typique en cas de mauvais usage | Confirmations d'atelier saisies avec plusieurs jours de retard | Utilisé comme outil de planification ou simple dépôt de données sans logique de procédé | Périmètre si large que rien n'est mis en service | Utilisé comme système de gestion des ordres | Traité comme système de référence pour les quantités |

MOM est le nom ISA-95 de l'ensemble du Niveau 3 ; le MES est généralement compris comme son cœur de production [10][14]. De nombreux éditeurs vendent des « suites MOM » incluant des modules qualité et maintenance. Qu'on parle de MES ou de MOM importe moins que de savoir si la matrice d'activités de la section 4 a un seul responsable par cellule.

### Autres systèmes de Niveau 3 et là où se situe généralement la frontière du MES

| Système | Fonction principale | Frontière typique avec le MES |
|---|---|---|
| QMS (système de management de la qualité) | Non-conformités, CAPA, audits, gestion documentaire, qualité fournisseur | Le MES capture les résultats en cours de fabrication et les blocages ; le QMS gère l'investigation et l'action corrective. Intégration : non-conformité créée dans le MES, traitée dans le QMS |
| LIMS (gestion d'information de laboratoire) | Échantillons, essais de laboratoire, spécifications, certificats d'analyse | Le MES demande les échantillons et reçoit les décisions de libération ; le LIMS détient l'enregistrement des essais |
| GMAO / EAM | Ordres de travail de maintenance, pièces de rechange, historique des actifs | Le MES remonte les états et compteurs machines ; la GMAO planifie la maintenance. Des identifiants d'actifs partagés sont indispensables |
| WMS | Stockage, préparation de commandes, mouvements d'entrepôt | Le MES demande la matière à la ligne et confirme la consommation ; le WMS exécute les mouvements |
| APS | Planification et séquencement à capacité finie | L'APS produit la séquence ; le MES la lance et renvoie les réalisés. Certains produits MES incluent un module APS |
| PLM | Conception produit, nomenclature d'ingénierie, gestion des modifications | Le PLM diffuse la définition d'ingénierie ; le MES consomme la définition de fabrication (souvent via l'ERP ou un outil de planification de procédés de fabrication) |
| Plateforme de données / analytique | Analyse multi-sites, IA, stockage à long terme | Le MES est une source ; il ne doit pas devenir le lac de données de l'entreprise. Voir [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### SAP est-il un MES ? L'ERP suffit-il ?

Les éditeurs d'ERP proposent des fonctions d'exécution de fabrication, soit à l'intérieur de l'ERP (confirmations d'atelier, listes de lancement simples), soit sous forme de produits séparés. SAP, par exemple, décrit SAP Digital Manufacturing comme une plateforme cloud de gestion des opérations de fabrication (MOM) et invite les clients de son ancien SAP Manufacturing Execution à migrer vers elle (description de l'éditeur) [35]. Savoir si l'ERP seul suffit dépend de quatre questions :

1. **Granularité :** Faut-il enregistrer par opération et par ordre, ou par étape, numéro de série et paramètre ?
2. **Latence :** La confirmation en fin de poste suffit-elle, ou les décisions dépendent-elles de quelques minutes ?
3. **Application :** Le système doit-il *empêcher* une étape incorrecte (mauvaise matière, opérateur non qualifié, contrôle manquant), ou seulement l'enregistrer ?
4. **Réglementation :** Faut-il des dossiers de lot électroniques ou des dossiers historiques de dispositif avec pistes d'audit et signatures électroniques ?

**Signes que vous avez dépassé l'exécution par ERP seul :** des confirmations saisies avec plus d'un poste de retard ; plus d'un tableur parallèle par zone ; un client ou un régulateur demandant une traçabilité que vous ne pouvez reconstituer qu'en plusieurs jours ; des défauts qualité échappés causés par de mauvaises révisions ou de mauvaises matières ; des superviseurs passant la première heure de chaque poste à collecter des chiffres.

Si les quatre réponses sont « grossière, en fin de poste, enregistrement seul, non », le pilotage d'atelier par ERP associé à une bonne discipline peut suffire, surtout pour les petites usines. Si deux réponses ou plus vont dans l'autre sens, vous avez besoin de fonctions MES, qu'elles viennent de l'éditeur de l'ERP, d'un éditeur MES ou d'une plateforme.

## Les fonctions MES en détail

Les fonctions ci-dessous suivent la colonne production du modèle d'activités ISA-95 [3], complété par les fonctions MESA-11 que la plupart des produits couvrent encore [9]. Pour chacune : ce qu'elle fait, ce dont elle a besoin et comment elle échoue généralement.

### 1. Gestion de la définition des produits (gammes de travail, gammes de fabrication, recettes)

**Ce qu'elle fait :** Conserve la définition de fabrication de chaque produit : opérations, étapes, paramètres, matières requises, outillages, compétences, instructions de travail et contrôles. Dans les industries de procédés par lots, il s'agit de la recette maîtresse.

**Ce dont elle a besoin :** Une répartition claire des données de référence entre ERP et PLM, une gestion des versions et un processus de modification technique qui atteint l'atelier avant le lancement de l'ordre suivant.

**Défaillance typique :** Deux référentiels. La gamme ERP compte 12 opérations, le MES en compte 14, et personne ne sait quels temps servent au calcul des coûts.

### 2. Gestion des ressources (personnes, équipements, matières)

**Ce qu'elle fait :** Connaît les ressources disponibles et qualifiées : état des machines, durée de vie des outils, formation et certification des opérateurs, lots de matières présents au poste.

**Ce dont elle a besoin :** Des dossiers de formation (souvent issus des RH ou d'un système d'apprentissage), l'état des équipements depuis la GMAO et les automatismes, l'état des matières depuis l'ERP ou le WMS.

**Défaillance typique :** Le MES bloque un opérateur parce que son dossier de formation dans les RH est en retard de trois mois. Définissez le processus de mise à jour des qualifications avant d'activer un contrôle strict. L'approfondissement sur les [compétences des opérateurs de production](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) traite des matrices de compétences.

### 3. Ordonnancement détaillé

**Ce qu'il fait :** Transforme les ordres lancés en une séquence par ressource, en respectant les capacités, les changements de série, la disponibilité des matières et les dates de livraison. MESA-11 l'appelle ordonnancement des opérations/détaillé [9].

**Ce dont il a besoin :** Des temps de cycle et de changement de série précis, des calendriers réels des ressources et l'avancement réel remonté depuis l'atelier.

**Défaillance typique :** Un « ordonnancement » qui n'est en réalité que la liste de lancement de l'ERP triée par date de livraison. Si l'ordonnancement représente une vraie contrainte dans votre usine, comparez le module MES avec un APS autonome.

### 4. Lancement (dispatching)

**Ce qu'il fait :** Libère le travail suivant vers un poste ou un opérateur au bon moment, avec tous les documents et matières prêts. MESA-11 : lancement des unités de production [9].

**Défaillance typique :** Des listes de lancement que les opérateurs ignorent parce qu'elles ne reflètent pas la réalité (matière manquante, machine en panne). La solution consiste à boucler la boucle : le lancement doit s'appuyer sur l'état des ressources en temps réel.

### 5. Gestion de l'exécution et instructions de travail

**Ce qu'elle fait :** Guide l'opérateur ou la machine à travers les étapes, impose l'ordre et les contrôles, recueille les validations et arrête le processus lorsqu'une condition requise n'est pas remplie. C'est là que le MES se distingue le plus d'un outil de reporting.

**Ce dont elle a besoin :** Des instructions de travail bien rédigées et visuelles ; des décisions sur les contrôles qui sont des arrêts bloquants et ceux qui ne sont que des avertissements ; des terminaux ou des tablettes au poste.

**Limite de sécurité :** Les fonctions de sécurité (protecteurs, arrêts d'urgence, verrouillages de sécurité) relèvent de commandes certifiées de sécurité aux niveaux 1 et 2, jamais du MES. Le MES peut bloquer *l'étape suivante de l'ordre* ; il ne doit pas être le seul élément qui protège une personne.

**Échec typique :** Numériser une procédure papier de 40 pages à l'identique. Réécrivez les instructions pour l'écran, testez-les avec les opérateurs et gardez-les courtes. Voir [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) et [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Collecte de données (data acquisition)

**Ce que ça fait :** Capture les quantités, les temps, les états, les paramètres et les mesures, automatiquement depuis les machines lorsque c'est possible et manuellement sinon.

**Ce que ça nécessite :** La connectivité des machines (OPC UA, MTConnect, protocoles des constructeurs, ou simples E/S pour les compteurs et les états), un modèle de temps (ce qui compte comme arrêt planifié) et des listes de codes de motif que les opérateurs peuvent réellement utiliser.

**Échec typique :** 120 codes de motif d'arrêt. Les opérateurs choisissent le premier de la liste. Commencez avec huit à quinze codes par zone et affinez-les avec les personnes qui les utilisent.

### 7. Management de la qualité en exécution

**Ce que ça fait :** Contrôles en cours de process, SPC, plans d'échantillonnage, blocages et déblocages, saisie des non-conformités, liens avec le QMS pour l'investigation.

**Ce que ça nécessite :** Plans de contrôle et caractéristiques issus de l'ingénierie qualité (dans l'automobile, le PFMEA et le plan de contrôle), intégration des moyens de mesure, règles sur ce qui se passe en cas de contrôle échoué.

**Échec typique :** Des résultats de contrôle collectés mais jamais utilisés pour arrêter le process. Un contrôle qui ne peut pas arrêter la ligne n'est qu'un enregistrement, pas une maîtrise. Le travail sur les causes racines relève du système qualité ; voir [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Suivi, traçabilité et généalogie

**Ce que ça fait :** Suit les travaux en cours et constitue le dossier tel que fabriqué : quels lots de matière et quels composants, provenant de quels fournisseurs, ont été intégrés dans quels numéros de série ou lots, traités sur quels équipements avec quels paramètres et par qui. MESA-11 : suivi produit et généalogie [9].

**Ce que ça nécessite :** Une identification unique (codes-barres, codes 2D, RFID), un scan rigoureux à chaque point de consommation de matière, et une règle claire pour les matières en vrac (niveau lot ou niveau numéro de série).

**Échec typique :** Une généalogie reconstituée après coup à partir des documents d'expédition. Elle doit être capturée pendant le process. Un test simple : prenez un numéro de série de produit fini au hasard et demandez combien de temps il faut pour lister tous les lots de composants. Puis inversez : prenez un lot de composant et listez toutes les unités finies qui le contiennent.

### 9. Analyse de performance

**Ce que ça fait :** TRS (OEE), rendement, rebut, temps de cycle, respect du planning et analyse des arrêts par équipe, ligne et produit ; c'est l'entrée des réunions quotidiennes de production. La section 14 présente les KPI.

**Échec typique :** Des tableaux de bord dont personne ne discute. Reliez chaque KPI à une réunion et à un responsable, comme décrit dans [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Maîtrise documentaire

**Ce que ça fait :** Fournit au poste l'indice de révision en vigueur des plans, instructions et spécifications, et enregistre la révision utilisée. Souvent partagée avec un système de gestion documentaire ou le QMS, ou déléguée à l'un d'eux.

### 11. Gestion de la main-d'œuvre

**Ce que ça fait :** Enregistre qui a travaillé sur quel ordre et pendant combien de temps, pour le calcul des coûts, les contrôles de qualification et les interfaces de paie. Notez l'aspect humain de la section 15 : le suivi du temps de travail au niveau opération est sensible et, dans les sites syndiqués, peut faire l'objet de négociations.

### 12. Fonctions liées à la maintenance

**Ce que ça fait :** Les états machines, compteurs et alarmes issus du MES alimentent la maintenance conditionnelle ou basée sur l'usage dans le GMAO (CMMS). La gestion complète de la maintenance reste en général dans le GMAO. Voir [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) et [predictive maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Stocks et flux matière à la ligne

**Ce que ça fait :** Demande la matière à la ligne, confirme la consommation, suit les tampons de WIP et le stock bord de ligne. Les signaux kanban peuvent être déclenchés à partir des données de consommation du MES ; voir [kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) et [intralogistics](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Discret, procédé et batch : comment l'accent se déplace

| Type d'industrie | Accent typique du MES | Exemples |
|---|---|---|
| Discret, grand volume (automobile, électronique) | Généalogie sérielle, verrouillages, données machine, TRS, Andon | Carrosserie, assemblage de cartes PCB |
| Discret, forte variété, faible volume (machines, aéronautique) | Instructions de travail, gammes suiveuses, non-conformités, qualification des opérateurs, configuration telle que construite | Assemblage de machines-outils, structures d'avions |
| Batch (pharmacie, agroalimentaire, chimie de spécialités) | Dossiers de lots électroniques, exécution des recettes, pesée et dosage, revue par exception, conformité | Fabrication de comprimés, sauces |
| Continu (papier, acier, raffinage) | Suivi de production par temps et par lot, qualité par échantillonnage, énergie, intégration avec DCS et LIMS | Machine à papier, laminoir à chaud |

Pour les spécificités aéronautiques (AS9100, inspection du premier article, gestion de la configuration), voir [planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Intégration : B2MML, OPC UA, MTConnect et l'espace de noms unifié

Un MES ne vaut que par ses interfaces. Il a besoin des ordres et des données de référence venant du niveau supérieur, des données machine venant du niveau inférieur, et il doit renvoyer les résultats confirmés. Quatre briques reviennent systématiquement.

### Vers le haut : intégration ERP et B2MML

L'interface ERP-MES transporte un petit nombre de types de messages, qui correspondent bien aux catégories d'informations de l'ISA-95 :

| Sens | Message | Contenu | Déclencheur |
|---|---|---|---|
| ERP -> MES | Définition produit / gamme | Opérations, nomenclature, postes de travail, temps standards | Libération d'une modification d'ingénierie |
| ERP -> MES | Ordre de fabrication (planning) | Matière, quantité, date d'échéance, référence de gamme | Lancement de l'ordre |
| ERP -> MES | Référentiel matières, lots | Identifiants matière, caractéristiques de lot | Modification, réception |
| MES -> ERP | Confirmation d'opération (performance) | Quantités bonnes et rebuts, temps, main-d'œuvre | Fin d'opération ou périodique |
| MES -> ERP | Mouvements de stock | Consommation, entrée en stock issue de la production | Scan de consommation, clôture d'ordre |
| MES -> ERP | Notification qualité | Défauts, blocages | Non-conformité |
| MES <-> ERP | Capacité / statut | Disponibilité des ressources, statut de l'ordre | Changement de statut |

**B2MML** (Business To Manufacturing Markup Language) est l'implémentation XML de MESA des modèles d'objets de l'ISA-95 ; la spécification compagnon ISA-95 de l'OPC Foundation suit autant que possible le mappage B2MML pour faciliter la traduction [5]. Utiliser B2MML ou un équivalent JSON ne rend pas une interface « plug-and-play », mais donne aux deux côtés les mêmes noms et structures d'objets, ce qui raccourcit le travail de spécification. Avec la dissolution de MESA, vérifiez où les schémas sont maintenus (voir section 2) [11].

**Règles qui font gagner des mois :**

- Définissez, pour chaque attribut, quel système est le référentiel maître, et ne laissez jamais deux systèmes écrire le même champ.
- Convenez de l'*événement* qui déclenche une confirmation (fin d'opération, toutes les 15 minutes, fin d'ordre), et pas seulement du format.
- Rendez les interfaces idempotentes : un message envoyé deux fois ne doit pas comptabiliser deux fois les quantités.
- Prévoyez l'indisponibilité de l'ERP. Le MES doit continuer à fonctionner et mettre les écritures en file d'attente.

### Vers le bas : intégration machines et automates avec OPC UA et MTConnect

**OPC UA** est l'interface indépendante des constructeurs dominante entre les automates et les logiciels de niveau 3. L'OPC Foundation maintient des spécifications compagnons qui définissent des modèles d'information pour des domaines précis, dont l'OPC 10030, qui transpose le modèle commun d'objets de l'ISA-95 vers OPC UA [4][5]. Dans Azure IoT Operations de Microsoft, par exemple, le connecteur OPC UA lit les points de données configurés et les publie vers un broker MQTT [26] ; le guide frère [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) couvre cette pile.

**MTConnect** est un standard ouvert pour les données des machines-outils et des équipements de fabrication, publié sous la référence ANSI/MTC1.4-2018 [22]. De nombreux constructeurs américains de machines-outils le supportent nativement, ce qui le rend attrayant pour les ateliers à façon disposant d'équipements CNC.

Pour les lignes de conditionnement, le modèle d'états PackML (issu du rapport technique ISA-TR88.00.02, édition actuelle 2022) fournit aux machines un ensemble commun d'états et de modes [37], ce qui simplifie le calcul du TRS entre différents OEM.

**De quoi avez-vous besoin au minimum de la machine :** un état (en marche, arrêtée, en défaut, en réglage), un compteur de pièces bonnes, un compteur de rebuts, le programme ou la recette active, et les codes d'alarme. Tout le reste est un plus pour des cas d'usage ultérieurs.

### Vers l'extérieur et horizontalement : l'espace de noms unifié (UNS)

Un **espace de noms unifié** (*unified namespace*, UNS) est un modèle d'architecture, et non une norme : les systèmes publient leur état actuel sous forme d'événements vers un courtier central, généralement MQTT, organisé dans une arborescence de topics hiérarchique, et les autres systèmes s'abonnent à ce dont ils ont besoin. L'arborescence de topics suit généralement la hiérarchie des équipements de l'ISA-95. Le [pilier Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) présente un exemple complet de topics et les services Azure qui le mettent en œuvre ; la présente section se concentre sur ce qu'un UNS signifie pour le MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** est un protocole léger de publication/abonnement ; les courtiers actuels prennent en charge les versions 3.1.1 et 5, comme Microsoft le documente pour le courtier d'Azure IoT Operations [25]. **Sparkplug**, maintenu par le Eclipse Sparkplug Working Group, ajoute au-dessus de MQTT une convention de charge utile et d'état ; la version 3.0 est la version en vigueur. Ses « certificats de naissance et de décès » indiquent aux abonnés si les données d'un appareil sont toujours valides [28]. La structure de topics propre à Sparkplug (groupe, nœud de périphérie, appareil) n'est pas la hiérarchie ISA-95 ; les usines qui l'utilisent projettent donc généralement la hiérarchie dans l'identifiant de groupe (par exemple `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) ou répartissent les niveaux entre plusieurs courtiers ou dans un second espace de noms structuré selon l'ISA-95 ; un fournisseur de courtiers décrit ces deux schémas et met en garde contre le fait que le nombre limité d'éléments de topic de Sparkplug rend la projection contraignante [44].

**Ce qu'un UNS change pour le MES :**

| Sans UNS | Avec UNS |
|---|---|
| Le MES se connecte point à point à chaque machine, à l'ERP, au QMS, aux tableaux de bord | Le MES s'abonne aux topics des machines et des ordres et publie ses propres événements (ordre démarré, opération terminée, blocage posé) |
| Chaque nouveau consommateur (un tableau de bord, un modèle d'IA) requiert une nouvelle interface avec le MES | Les nouveaux consommateurs s'abonnent aux topics existants |
| L'état actuel est dispersé entre les systèmes | L'état actuel est visible en un seul endroit |

**Ce qu'un UNS ne change pas :**

- **La logique métier reste dans le MES.** Le courtier transporte des messages ; il ne vérifie pas que le bon matériau est utilisé, que l'opérateur est qualifié ou que le dossier de lot est complet.
- **Les enregistrements de référence restent dans les systèmes de référence.** Un courtier contient l'état actuel, et non un historique auditable. La généalogie, les dossiers de lot et les confirmations doivent être stockés de manière transactionnelle dans le MES (et dans l'ERP), avec des pistes d'audit lorsque la réglementation l'exige.
- **La sémantique a toujours besoin d'un modèle.** Un topic nommé `counts` est inutilisable si une machine compte des cycles et une autre compte des pièces bonnes. Les objets ISA-95 et les spécifications compagnons OPC UA fournissent la sémantique des charges utiles.
- **La sécurité devient plus difficile, et non plus simple.** Un courtier dans lequel tous les systèmes peuvent écrire constitue une cible de grande valeur ; le contrôle d'accès par topic, les clients authentifiés et la segmentation selon l'ISA/IEC 62443 sont indispensables [23][24].

**Débat : « l'UNS remplace l'ISA-95 ».** Vous rencontrerez cette affirmation. Elle confond deux choses. La position de l'ISA est que les niveaux restent utiles pour décrire les frontières des systèmes, même lorsque les données ne circulent plus niveau par niveau [1], et l'édition 2025 de la partie 1 vise explicitement des architectures modulaires et centrées sur les données [2]. La synthèse pragmatique : l'ISA-95 pour le vocabulaire, la hiérarchie des équipements et les responsabilités ; l'UNS (ou une autre colonne vertébrale événementielle) pour le transport ; le MES et l'ERP comme systèmes de référence transactionnels.

### Architecture d'intégration : trois modèles comparés

| Modèle | Fonctionnement | Adapté à | Points de vigilance |
|---|---|---|---|
| Point à point | Chaque système dispose d'interfaces directes avec les autres | Petites usines avec 3 à 5 systèmes | Jusqu'à n × (n − 1) ÷ 2 interfaces : 10 pour 5 systèmes, 45 pour 10 ; mises à niveau fragiles |
| Middleware d'intégration / ESB | Une couche d'intégration centrale transforme et route les messages | Entreprises centrées sur l'ERP disposant d'équipes d'intégration informatique | Peut devenir un goulot d'étranglement géré par une équipe éloignée |
| Colonne vertébrale événementielle / UNS | Courtier de publication/abonnement avec une convention commune de topics et de charges utiles | Usines comptant de nombreuses machines et de nombreux consommateurs de données | Nécessite une gouvernance des topics, des charges utiles et des accès ; les flux transactionnels exigent toujours une livraison garantie |

La plupart des usines finissent par combiner les approches : un UNS pour les données des machines et d'état, et une intégration à livraison garantie pour les transactions ERP.

## MES dans les industries réglementées

Dans les industries réglementées, le MES fait partie du système qualité, et ses enregistrements sont des documents juridiques. Cette section présente les règles américaines que vous devez intégrer à la conception ; elle ne remplace pas les conseils de votre équipe des affaires réglementaires.

### FDA 21 CFR Part 11 : dossiers et signatures électroniques

Pour les systèmes fermés, le 21 CFR 11.10 exige, entre autres contrôles, la validation des systèmes en matière d'exactitude, de fiabilité et de performance constante conforme à l'usage prévu ; la capacité de générer des copies exactes et complètes des enregistrements ; la protection des enregistrements pendant toute la durée de conservation ; la limitation de l'accès au système aux personnes autorisées ; et des « pistes d'audit sécurisées, générées par ordinateur et horodatées » qui consignent la date et l'heure des saisies et actions des opérateurs qui créent, modifient ou suppriment des enregistrements, sans masquer les informations précédemment enregistrées [19]. D'autres paragraphes couvrent les contrôles opérationnels et d'autorité, les contrôles des dispositifs, la formation et les politiques écrites.

**Ce que cela implique pour un MES :** des comptes utilisateurs nominatifs (pas d'identifiants partagés au terminal), des pistes d'audit sur chaque enregistrement réglementé, des signatures électroniques liées à l'enregistrement et indiquant le nom du signataire, la date, l'heure et la signification de l'acte, ainsi qu'un dossier de validation. Prévoyez le temps et le budget nécessaires à la validation ; dans le secteur pharmaceutique, elle représente souvent une part importante de l'effort de mise en œuvre [unverified: aucun benchmark public pour cette part].

### Pharmaceutique : dossiers de lots électroniques

Les fabricants de médicaments doivent conserver les dossiers de fabrication et de contrôle des lots pour chaque lot, conformément aux règles de bonnes pratiques de fabrication actuelles du 21 CFR Part 211 ; la section 211.188 indique que « les dossiers de fabrication et de contrôle des lots doivent être établis pour chaque lot de produit pharmaceutique fabriqué » [38]. Un MES avec dossiers de lots électroniques (eBR) impose la séquence de la recette, saisit les poids et paramètres à la source et permet la **revue par exception** : le relecteur assurance qualité contrôle les écarts signalés par le système au lieu de lire chaque page. C'est l'un des arguments économiques les plus forts du MES dans tous les secteurs, car le temps de revue des dossiers de lots limite souvent la libération des produits.

### Dispositifs médicaux : QMSR et dossiers historiques de dispositif

Depuis le 2 février 2026, le règlement sur le système de management de la qualité de la FDA (21 CFR Part 820, QMSR) intègre par référence la norme ISO 13485:2016, y compris ses exigences d'identification et de traçabilité [20]. L'ancien terme « device history record » (DHR), ou dossier historique de dispositif, figure encore dans de nombreuses descriptions de produits MES et procédures d'usine ; la page QMSR de la FDA n'utilise pas ce terme. Nous recommandons donc de faire correspondre vos enregistrements aux exigences de l'ISO 13485:2016 que le QMSR intègre, plutôt qu'aux anciens numéros de section de la Part 820, et de faire valider cette correspondance par les affaires réglementaires. Le MES produit généralement l'enregistrement tel que construit par lot ou numéro de série : composants, opérations, contrôles, équipements et personnel.

### Alimentaire : traçabilité FSMA 204

La règle de traçabilité alimentaire de la FDA (FSMA, section 204) exige des éléments de données clés pour les événements de traçabilité critiques (réception, transformation, expédition), liés à un code de lot de traçabilité, avec transmission des enregistrements à la FDA dans les 24 heures suivant une demande ; la FDA n'en imposera pas l'application avant le 20 juillet 2028 [29]. Les événements de transformation ont lieu en production : le MES ou un module de traçabilité est donc le lieu naturel pour créer les codes de lot et relier les intrants aux extrants.

### Automobile et aéronautique

Les normes IATF 16949 et AS9100 ajoutent des exigences de traçabilité, de plan de contrôle et de premier article ; les exigences propres aux clients vont souvent plus loin. Dans l'IATF 16949, la section 8.5.2.1 complète les exigences d'identification et de traçabilité de l'ISO 9001 par des plans de traçabilité documentés fondés sur « les niveaux de risque ou de gravité de défaillance pour les employés, les clients et les consommateurs », selon un tableau comparatif d'un organisme de certification [39] (source secondaire ; la norme est un texte payant). Les deux normes sont des textes payants ; le guide [planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/) traite en détail de l'AS9100 et de l'AS9102.

### Approche de validation

Le guide final de la FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH et CBER, février 2026) décrit une approche fondée sur les risques pour établir la confiance dans les logiciels de production et des systèmes de gestion de la qualité, et pour déterminer où un niveau de rigueur plus élevé est nécessaire [40]. Il est rédigé pour les fabricants de dispositifs médicaux relevant de la partie 820 du 21 CFR ; les fabricants de médicaments peuvent s'en servir comme orientation, et non comme règle qui leur serait propre. Concrètement : classez chaque fonction du MES selon son risque, testez de manière approfondie les fonctions à haut risque (signatures électroniques, verrouillages, calculs, traçabilité des lots) à l'aide de tests scriptés, et recourez à des tests non scriptés ou fournis par le fournisseur pour la configuration à faible risque. Demandez aux fournisseurs leurs accélérateurs de validation et leur propre certification de système qualité.

## Options de déploiement et d'architecture

Le marché est passé de « une grande suite MES par usine » à un éventail plus large d'options. Elles diffèrent par l'endroit où le logiciel s'exécute et par la manière dont il est structuré.

### Lieu d'exécution : sur site, cloud, hybride

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| Sur site | Serveurs MES dans l'usine ou dans le centre de données de l'entreprise | Fonctionne lorsque le WAN est coupé ; contrôle total ; familier pour les équipes de validation | Matériel, correctifs et mises à niveau à votre charge ; les mises à niveau sont souvent reportées pendant des années |
| Cloud (SaaS) | Le fournisseur exploite le MES dans son cloud ; l'usine se connecte via des passerelles | Démarrage plus rapide, mises à niveau gérées par le fournisseur, coût par abonnement | Dépendance au WAN ; latence pour les verrouillages ; résidence des données ; cadence de mise à niveau imposée à concilier avec la validation |
| Hybride / edge plus cloud | Exécution sensible au temps sur un nœud edge dans l'usine, analyses et pilotage dans le cloud | Continuité de fonctionnement pendant les pannes ; mise à l'échelle des analyses | Deux environnements à exploiter et à sécuriser ; logique de synchronisation |

**Règle empirique :** tout ce qui doit arrêter une étape erronée ou maintenir une ligne en marche doit fonctionner lorsque la connexion internet est coupée. Demandez à chaque fournisseur cloud de démontrer le comportement hors ligne, et non de le décrire.

### Structure : suite, plateforme, module ERP

| Approche | Ce que vous obtenez | Convient à | Risques |
|---|---|---|---|
| Suite MES sectorielle | Fonctionnalités étendues et préconfigurées pour un ou plusieurs secteurs, souvent avec des fonctions réglementaires | Usines réglementées et complexes ; standardisation multisite | Projets longs, personnalisation lourde, dépendance vis-à-vis du fournisseur, coût élevé des licences |
| Composable / plateforme d'applications (« MES de nouvelle génération ») | Une plateforme avec des outils low-code et des connecteurs ; l'usine construit ou configure des applications pour des cas d'usage précis | Usines qui veulent démarrer petit et étendre ensuite ; production à forte variété ; équipes internes solides | De nombreuses petites applications sans modèle de données commun ; gouvernance ; validation des applications développées par les utilisateurs |
| MES intégré à l'ERP | Module MES ou produit complémentaire de l'éditeur ERP | Entreprises centrées sur l'ERP avec une complexité d'atelier modérée | L'ergonomie atelier et l'intégration machine peuvent être en retrait par rapport aux produits spécialisés |
| Développement sur mesure | Logiciel propre sur une plateforme générique | Processus uniques, équipe logicielle solide | Vous assumez la maintenance indéfiniment (section 10) |

Le « MES composable » est un terme marketing de fournisseurs et d'analystes, et non une catégorie standard. L'idée sous-jacente, de petites fonctions partageant un même modèle de données et ajoutables progressivement, est saine et correspond à la vision par activités de l'ISA-95. Le risque est l'inverse du monolithe : vingt applications qui définissent chacune « ordre » et « machine » de façon différente. La hiérarchie des équipements et les modèles d'objets de l'ISA-95 sont le remède.

### Modèles multisites

Pour les entreprises disposant de plusieurs usines, la question est moins « quel MES » que « quel niveau de standardisation ». Une approche courante consiste à définir un **modèle global** (modèle de données, processus centraux, interfaces, indicateurs KPI) complété par des extensions locales. Limitez le modèle global à ce qui doit être comparable d'un site à l'autre (définitions des KPI selon l'ISO 22400, traçabilité, interface ERP) ; laissez les sites différer là où leurs processus diffèrent.

## Fabriquer ou acheter

La plupart des usines devraient acheter (ou souscrire à un abonnement) puis configurer. Développer en interne se justifie dans moins de cas que ne le pensent les équipes d'ingénierie, mais dans davantage de cas que ne l'admettent les éditeurs.

### Facteurs de décision

| Facteur | Oriente vers l'achat | Oriente vers le développement ou le développement sur plateforme |
|---|---|---|
| Singularité des processus | Les processus ressemblent aux pratiques du secteur | Les processus constituent un véritable facteur de différenciation concurrentielle et évoluent souvent |
| Réglementation | Environnement validé et réglementé (Part 11, GMP) | Environnement non réglementé ou faiblement réglementé |
| Capacité interne | Pas d'équipe logicielle, ou une équipe entièrement occupée par l'ERP | Équipe expérimentée capable de maintenir le logiciel pendant plus de 10 ans |
| Périmètre | Large : exécution, qualité, généalogie, ordonnancement | Restreint : collecte de données et TRS, instructions de travail numériques |
| Délais | Besoin de résultats en quelques mois | Possibilité d'investir dans un développement plus long |
| Coût total sur 10 ans | Licence et configuration inférieures au coût d'une équipe | Coût de l'équipe déjà engagé et stable |
| Risque lié aux personnes clés | Inacceptable | Atténué par la documentation et la taille de l'équipe |

### Le coût caché du développement interne

Un MES développé en interne n'a pas de frais de licence, mais il faut payer pour les spécifications, le développement, les tests, la documentation, l'hébergement, les correctifs de sécurité, les mises à niveau de la plateforme sous-jacente, le support à 3 heures du matin et, dans les secteurs réglementés, la validation de chaque modification. L'échec le plus courant ne concerne pas la première version ; il survient à la cinquième année, lorsque le développeur d'origine a quitté l'entreprise et que l'usine fait tourner un logiciel que personne n'ose modifier.

### Une voie intermédiaire

Beaucoup d'usines achètent une plateforme ou un MES pour le cœur du système (exécution, généalogie, interface ERP) et développent des applications ou tableaux de bord spécifiques par-dessus, en utilisant ses API ou ses outils low-code. Cette approche fonctionne lorsque le cœur acheté possède le modèle de données et que les composants développés en interne se contentent de le lire ou utilisent des API documentées.

## Liste de contrôle pour le choix d'un éditeur de MES

Le tableau ci-dessous est une liste de contrôle de sélection comportant 30 critères répartis en huit groupes. Pondérez les groupes selon votre situation (les pondérations suggérées correspondent à une usine d'taille moyenne en fabrication discrète, faiblement réglementée), attribuez à chaque éditeur une note de 0 à 4 par critère et, surtout, utilisez la colonne **méthode de test** : aucun critère ne doit être noté sur la seule base d'une présentation commerciale.

| # | Groupe (pondération suggérée) | Critère | Comment le tester |
|---|---|---|---|
| 1 | Adéquation fonctionnelle (25 %) | Couvre vos principaux cas d'usage issus de la matrice d'activités ISA-95 | Démonstration scénarisée avec vos propres produits, gammes et un ordre réel |
| 2 | Adéquation fonctionnelle | Instructions de travail : visuelles, versionnées, respect des étapes imposé | L'opérateur crée et exécute une instruction pendant la démonstration |
| 3 | Adéquation fonctionnelle | Traçabilité au niveau requis (lot, numéro de série, les deux) | Traçabilité amont et aval sur des données de démonstration en moins de 60 secondes |
| 4 | Adéquation fonctionnelle | Qualité en exécution : contrôles, SPC, blocages, non-conformités | Provoquer un contrôle en échec et montrer ce qui est bloqué |
| 5 | Adéquation fonctionnelle | Arrêts et TRS selon votre modèle temporel | Configurer vos codes motifs et vos règles d'arrêts planifiés |
| 6 | Adéquation fonctionnelle | Profondeur de l'ordonnancement et du lancement (ou intégration avec un APS) | Reséquencer après une panne machine |
| 7 | Intégration (15 %) | Connecteur ERP pour votre ERP et sa version | Client de référence utilisant le même ERP ; examen de la documentation d'interface |
| 8 | Intégration | Connectivité machines : OPC UA, MTConnect, vos marques d'automates | Connecter l'une de vos machines lors d'une preuve de concept |
| 9 | Intégration | API ouvertes (REST, événements), documentées et versionnées | Un développeur lit la documentation de l'API et réalise une petite requête |
| 10 | Intégration | Prise en charge des objets ISA-95 ou de B2MML | Demander la correspondance du modèle de données avec ISA-95 |
| 11 | Intégration | Publication d'événements vers MQTT / UNS | Montrer les événements sur un broker pendant la démonstration |
| 12 | Données et architecture (10 %) | Le modèle de données suit ou correspond à la hiérarchie d'équipements ISA-95 | Examiner la configuration du modèle d'équipements |
| 13 | Données et architecture | Capacité de fonctionnement hors ligne en périphérie | Couper le WAN pendant la preuve de concept |
| 14 | Données et architecture | Export et propriété des données : toutes les données récupérables dans des formats ouverts | Clause contractuelle et test d'export |
| 15 | Données et architecture | Capacité de modèles multisites | Référence avec trois sites ou plus |
| 16 | Ergonomie (10 %) | Écrans opérateurs utilisables avec des gants, sur tablette, dans le bruit | Deux opérateurs testent sans formation pendant 30 minutes |
| 17 | Ergonomie | Configuration par les superviseurs et ingénieurs sans code | L'ingénieur modifie une étape de gamme et un contrôle |
| 18 | Ergonomie | Langues lues par vos équipes | Présenter les écrans dans chaque langue |
| 19 | Conformité et sécurité (10 %) | Fonctionnalités Part 11 si nécessaires (piste d'audit, signature électronique) | Démonstration de la piste d'audit sur un enregistrement modifié |
| 20 | Conformité et sécurité | Développement sécurisé et certification de sécurité produit (p. ex. ISA/IEC 62443-4-1/4-2) | Certificats et politique de divulgation des vulnérabilités de l'éditeur [23] |
| 21 | Conformité et sécurité | Intégration de l'identité (SSO, MFA pour les administrateurs, modèle de rôles) | Configurer les rôles opérateur, superviseur, qualité |
| 22 | Conformité et sécurité | Documents d'appui à la validation | Examiner le dossier de validation |
| 23 | Éditeur et partenaire (10 %) | Stabilité financière et actionnariat | Rapports annuels ou vérification de solvabilité ; changements d'actionnariat sur les cinq dernières années |
| 24 | Éditeur et partenaire | Partenaire d'implémentation avec des références dans votre secteur et votre région | Appeler deux références sans la présence de l'éditeur |
| 25 | Éditeur et partenaire | Feuille de route produit et rythme des versions | Feuille de route sous accord de confidentialité ; à quelle fréquence les clients mettent-ils réellement à jour ? |
| 26 | Éditeur et partenaire | Modèle de support et horaires | Texte du SLA ; qui répond à 2 h du matin un samedi ? |
| 27 | Coût (15 %) | Coût total de possession sur cinq ans | Votre modèle de TCO (section 13) renseigné avec les devis des éditeurs |
| 28 | Coût | Le modèle de licence correspond à la croissance (par site, par utilisateur, par machine, à la consommation) | Chiffrer dès maintenant le scénario d'extension sur 3 ans |
| 29 | Coût | Coût des mises à niveau et des personnalisations | Demander ce qu'a coûté une mise à niveau chez un client de référence |
| 30 | Sortie (5 %) | Plan de sortie : données, configurations, documentation à la résiliation | Clause contractuelle ; demander comment un ancien client a migré hors de la solution |

**Notation :** score pondéré = somme sur les groupes de (poids du groupe × score moyen des critères ÷ 4). Un fournisseur à 78 % ne l'emporte sur un fournisseur à 72 % que si aucun des deux n'est éliminatoire : tout critère noté 0 en adéquation fonctionnelle, en fonctionnement hors ligne (si requis) ou en conformité doit éliminer le fournisseur, quel que soit son total.

**Conseils de processus :**

- Rédigez la demande de proposition autour des cas d'usage et de la matrice d'activités, et non autour d'une liste de fonctionnalités de 600 lignes. Les listes de fonctionnalités reçoivent un « oui » à chaque ligne.
- Exigez une preuve de concept payante sur une ligne de production avec vos propres données avant la décision finale. Une fourchette typique est de deux à six semaines [unverified: estimation de praticien].
- Laissez les opérateurs et les superviseurs évaluer l'ergonomie ; laissez la finance évaluer le coût ; gardez ces notes séparées jusqu'à la fin.
- Pour un point de départ neutre vis-à-vis des éditeurs, les analyses de cabinets (Gartner Peer Insights répertorie le marché des MES [8]) et les références d'usines homologues sont plus utiles que les classements publiés par les éditeurs eux-mêmes.

## Feuille de route de mise en œuvre d'un MES

La feuille de route ci-dessous concerne une seule usine de taille moyenne. Les durées sont des hypothèses de planification pour un produit configuré, et non des références ; les usines réglementées et les développements sur mesure prennent plus de temps [unverified: estimations de praticiens].

| Phase | Durée (hypothèse typique) | Activités principales | Critères de sortie |
|---|---|---|---|
| 0. Cas et périmètre | 4 à 8 semaines | Énoncé du problème, parcours du flux de valeur, matrice d'activités ISA-95 en l'état actuel, KPI de référence, ébauche du business case | Sponsor, fourchette budgétaire et un flux de valeur pilote approuvés |
| 1. Exigences et sélection | 8 à 16 semaines | Cas d'usage, modèle de données (hiérarchie des équipements, responsabilité des données de référence), appel d'offres, démonstrations scénarisées, preuve de concept | Éditeur et partenaire sélectionnés, contrat avec clauses de sortie et de données |
| 2. Conception | 6 à 10 semaines | Conception de la solution, spécifications d'interfaces, modèle de temps et codes motif, normes des instructions de travail, plan de validation (si réglementé), conception de la sécurité | Conception signée, plan de tests |
| 3. Construction et test du pilote | 10 à 20 semaines | Paramétrage, connectivité machine, interface ERP, reprise de données, cycles de test, formation des opérateurs | Recette utilisateur sur la ligne pilote |
| 4. Mise en service du pilote et stabilisation | 6 à 12 semaines | Mise en service avec hypercare, revue quotidienne des incidents, comparaison des KPI avec la référence | KPI stables pendant 4 semaines consécutives ; anomalies ouvertes sous le seuil convenu |
| 5. Déploiement | 3 à 6 mois par vague | Autres lignes et secteurs ; modèle affiné | Tous les secteurs inclus en service |
| 6. Amélioration continue | Permanent | Nouveaux cas d'usage, mises à niveau, amélioration pilotée par les KPI | Pris en charge par l'usine, et non par le projet |

### Phase 0 en détail : commencer par le flux de valeur

Parcourez d'abord le flux de valeur. Repérez où l'information est retardée, retapée ou manquante, et où naissent les défauts qualité échappés et les délais longs. Le guide sur la [cartographie du flux de valeur](https://www.m365.fm/en/learn/value-stream-mapping/) explique la méthode ; une cartographie de l'état actuel avec les flux d'information représentés est le meilleur document d'exigences MES que vous puissiez produire en une semaine. Choisissez un pilote suffisamment important pour compter et suffisamment circonscrit pour aboutir : une ligne ou une famille de produits avec un point de douleur clairement identifié.

### Phase 1 en détail : le modèle de données avant le logiciel

Définissez la hiérarchie des équipements (section 4), le responsable des données de référence pour chaque objet (matière, gamme, équipement, personnel), le modèle de temps pour le TRS (ce qui constitue le temps de production planifié) et le modèle de statuts des ordres et des opérations. Si vous ne parvenez pas à vous accorder sur ces points avec l'ERP, la qualité et la maintenance avant la sélection, aucun éditeur ne résoudra le problème à votre place.

### Liste de contrôle de mise en service

| Contrôle | Fait |
|---|---|
| Données de référence des produits pilotes vérifiées sur le terrain (étapes de gamme, nomenclature, instructions) | ☐ |
| Chaque opérateur formé sur son propre poste avec des ordres réels, et pas seulement en salle de formation | ☐ |
| Procédure de repli (gamme papier) imprimée et testée en cas de panne du MES | ☐ |
| Interface ERP testée avec des cas d'erreur (ERP indisponible, message en double, quantité erronée) | ☐ |
| Codes motif et contrôles revus avec les opérateurs | ☐ |
| Planning d'hypercare pour les deux premières semaines, tous les équipes | ☐ |
| Indicateurs de référence figés pour comparaison | ☐ |
| Sécurité : comptes, rôles, MFA pour les administrateurs, sauvegardes testées | ☐ |
| Réglementé : rapport de synthèse de validation approuvé avant utilisation en production | ☐ |

### Rôles

| Rôle | Responsabilité |
|---|---|
| Sponsor exécutif (directeur d'usine ou VP opérations) | Tranche les conflits de périmètre, protège les ressources |
| Product owner côté production | Pilote les cas d'usage et les priorités, signe la recette |
| Responsable MES / architecte de solution | Conception, modèle de données, intégration |
| Ingénieur IT/OT | Infrastructure, réseaux, connectivité machine, sécurité |
| Qualité et réglementaire | Contrôles, enregistrements, validation |
| Utilisateurs clés par secteur et par équipe | Testent, forment leurs pairs, remontent les retours |
| Partenaire finance | Business case, suivi des bénéfices |
| Éditeur / intégrateur | Paramétrage, connaissance du produit |

## Coût et ROI d'un MES, avec un exemple chiffré

« Combien coûte un MES ? » n'a pas de réponse unique et honnête. Les prix dépendent du périmètre, du nombre de lignes et d'utilisateurs, du modèle de déploiement, de la réglementation et de l'effort d'intégration, et les éditeurs publient rarement leurs tarifs. Certaines pages web donnent des fourchettes sans source ; nous ne les reprenons pas. Nous proposons plutôt une structure pour votre propre coût total de possession, ainsi qu'un exemple chiffré avec des **hypothèses illustratives** que vous remplacerez par vos devis et vos données de référence.

### Structure des coûts

| Bloc de coûts | Ponctuel | Récurrent | Remarques |
|---|---|---|---|
| Logiciel | Licence perpétuelle (le cas échéant) | Abonnement ou maintenance (souvent un pourcentage de la licence par an) | Vérifiez la métrique : site, utilisateur, machine, consommation |
| Services d'implémentation | Paramétrage, interfaces, reprise de données, gestion de projet | Demandes de changement | Généralement le poste ponctuel le plus important |
| Matériel et réseau | Terminaux, tablettes, scanners, imprimantes d'étiquettes, serveurs en périphérie, Wi-Fi, câblage | Cycle de remplacement | Souvent sous-estimé dans les usines anciennes |
| Connectivité machine | Passerelles, programmation d'automates, rétrofits des machines anciennes | Maintenance | Prix par type de machine, et non par machine |
| Équipe interne | Équipe projet, utilisateurs clés, remplacement pendant leurs tâches habituelles | Support MES, administration, amélioration continue | Comptez le coût chargé |
| Formation | Conception et sessions de formation | Nouveaux arrivants, recyclages | |
| Validation (secteurs réglementés) | Plan de validation, protocoles, exécution | Revalidation après modifications et mises à niveau | |
| Hébergement et exploitation | Mise en place | Frais cloud ou exploitation des serveurs, sauvegardes, surveillance de la sécurité | |

**Capex contre opex :** un MES en abonnement relève en général de l'opex ; les licences perpétuelles, le matériel et certains coûts d'implémentation peuvent être immobilisés selon votre politique comptable. Selon les US GAAP, l'ASC 350-40 régit les logiciels à usage interne. Depuis l'ASU 2018-15 (août 2018), les coûts d'implémentation d'un accord cloud qui constitue un contrat de services suivent les mêmes étapes d'immobilisation, mais les coûts immobilisés sont présentés comme des frais d'hébergement payés d'avance, amortis sur la durée de l'hébergement et inscrits dans la même ligne du compte de résultat que les redevances [41]. L'ASU 2025-06 (septembre 2025) modifie à nouveau l'ASC 350-40, avec effet pour les exercices annuels commençant après le 15 décembre 2027, l'adoption anticipée étant permise [42]. Convenez du traitement avec votre commissaire aux comptes. Ce choix comptable modifie l'EBITDA et le calendrier des coûts, pas l'économie du projet.

### Structure des bénéfices

| Poste de bénéfice | Formule | Source de données |
|---|---|---|
| Débit supplémentaire sur la contrainte | Heures productives ajoutées × marge sur coûts variables par heure | Journal des arrêts du MES ou manuel, finance (seulement si la demande existe) |
| Réduction des rebuts et des reprises | Coût annuel des rebuts et reprises × réduction attendue | Rapports de coûts qualité |
| Temps de main-d'œuvre pour la paperasse et la saisie | Heures économisées × taux chargé × part effectivement réaffectée | Étude de temps, entretiens |
| Réduction des encours et des stocks | Libération de trésorerie ponctuelle ; coût de portage × réduction par an | Valorisation des stocks |
| Lancement plus rapide des lots ou des commandes | Réduction du délai × valeur (stocks, livraison à l'heure) | Délais de revue qualité, données de commandes |
| Coût évité de conformité et de rappel | Probabilité × impact, généralement hors cas de base | Registre des risques |

### Exemple chiffré : une usine de vannes de 220 salariés

**Situation (tous les chiffres sont illustratifs) :** quatre lignes, deux équipes, chiffre d'affaires de 85 millions de dollars. La ligne 2 est la contrainte. Gammes papier, confirmations de fin de poste dans l'ERP, aucune capture automatique des arrêts.

**Coûts ponctuels (année 0) :**

| Poste | Montant |
|---|---|
| Services d'implémentation | 450 000 $ |
| Matériel, réseau, connectivité machine | 160 000 $ |
| Équipe projet interne (2,5 ETP pendant 12 mois à 120 000 $ chargés) | 300 000 $ |
| Formation et remplacement | 60 000 $ |
| **Total ponctuel** | **970 000 $** |

**Coûts récurrents (à partir de l'année 1) :** abonnement 180 000 $ + support MES interne 1 ETP 120 000 $ = **300 000 $ par an**.

**Bénéfices à plein régime (cas de base) :**

| Bénéfice | Calcul | Par an |
|---|---|---|
| TRS de la ligne 2 de 62 % à 67 % | 4 000 heures planifiées × 5 points = 200 heures productives supplémentaires × 2 000 $ de marge sur coûts variables par heure | 400 000 $ |
| Réduction des rebuts | 1,2 million de dollars de coût des rebuts × 15 % | 180 000 $ |
| Temps de paperasse | 4 000 heures × 45 $ chargés × 50 % réaffectées | 90 000 $ |
| Coût de portage des encours | 3,0 millions de dollars d'encours × 10 % de réduction × taux de portage de 20 % | 60 000 $ |
| **Bénéfice annuel total** | | **730 000 $** |

À cela s'ajoute une libération de trésorerie ponctuelle liée aux encours : 3,0 millions de dollars × 10 % = 300 000 $ (hypothèse pour l'année 2).

**Montée en charge :** la première année génère 40 % du bénéfice annuel (pilote et déploiement), les années 2 à 5 génèrent 100 % du bénéfice.

**Flux de trésorerie (en milliers de dollars), taux d'actualisation 10 % :**

| Année | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Cas de base | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Cumulé | −970 | −978 | −248 | 182 | 612 | 1 042 |

VAN à 10 % = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+510 000 $**. Délai de récupération simple : la trésorerie cumulée devient positive pendant la troisième année, soit environ 2,6 ans après le début du projet (248 ÷ 430 = 0,58 de la troisième année).

**Cas prudent :** le gain de TRS n'est que de moitié (ou la production supplémentaire ne peut pas être entièrement vendue) : 200 000 $ au lieu de 400 000 $ ; réduction des rebuts de 10 % (120 000 $) au lieu de 15 %. Bénéfice annuel de 470 000 $, soit un flux net de 170 000 $ par an.

| Année | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Cas prudent | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Cumulé | −970 | −1 082 | −612 | −442 | −272 | −102 |

VAN à 10 % ≈ **−334 000 $** ; pas de récupération dans les cinq ans.

**Analyse de sensibilité :** en maintenant les bénéfices liés aux rebuts, à la paperasserie et aux encours au niveau du cas de base, le projet atteint le seuil de rentabilité (VAN = 0 à 10 %) avec un bénéfice de débit d'environ 243 000 $ par an, soit environ 121 heures productives supplémentaires ou à peu près 3 points de TRS sur la ligne 2 au lieu de 5. Si seule la moitié du gain de TRS se matérialise et que tout le reste est inchangé, la VAN est d'environ −139 000 $. La sensibilité à cette seule hypothèse constitue le véritable enseignement.

**Ce que l'exemple enseigne :**

1. **Une seule ligne domine.** Le bénéfice de débit représente plus de la moitié du cas de base. Avant de le comptabiliser, vérifiez avec les ventes que l'usine est contrainte par la capacité sur cette ligne, ou utilisez le guide sur la [théorie des contraintes](https://www.m365.fm/en/learn/theory-of-constraints/) pour identifier d'abord la contrainte réelle.
2. **Le coût récurrent compte davantage que ne le laisse supposer la ligne de licence.** Le support interne représente ici 40 % du coût récurrent et est souvent omis.
3. **La montée en charge fait chuter la VAN.** Un pilote qui s'étire sur 18 mois au lieu de 12 fait plonger davantage le cas prudent dans le rouge. La rapidité d'obtention de la première ligne stabilisée est une variable financière.
4. **Les bénéfices non quantifiés sont réels mais distincts.** La réduction de l'étendue des rappels, la préparation aux audits et les exigences clients peuvent à eux seuls justifier un MES dans des chaînes d'approvisionnement réglementées ou pilotées par les OEM. Présentez-les à côté des chiffres, et non à l'intérieur.
5. **Suivez les bénéfices après la mise en service** par rapport à la référence figée, avec le service financier, pendant au moins deux ans.

Pour les définitions des KPI et des coûts sous-jacents à ces lignes, consultez les [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPI MES : quoi mesurer et comment

Un MES produit les données de la plupart des KPI d'atelier. Deux groupes comptent : les KPI opérationnels que le MES calcule, et les KPI qui indiquent si le MES fonctionne lui-même.

### Définitions standard : ISO 22400

ISO 22400-2:2014 définit les indicateurs clés de performance pour la gestion des opérations de fabrication, avec pour chacun la formule, l'unité, le calendrier et le groupe d'utilisateurs [16] ; des sources secondaires comptent 34 KPI dans la norme [18], et un amendement de 2017 a ajouté des KPI de management de l'énergie [16]. Utiliser ses définitions rend les KPI comparables d'une ligne et d'un site à l'autre. Des chercheurs du NIST ont publié une structure hiérarchique de ces KPI avec leurs formules, librement accessible [17].

### KPI opérationnels issus du MES

| KPI | Formule (simplifiée) | Usage typique |
|---|---|---|
| TRS (OEE) | Disponibilité × performance × qualité | Goulot et équipements clés |
| Disponibilité | Temps de marche ÷ temps de production planifié | Focus sur les arrêts |
| Performance | (Temps de cycle idéal × quantité totale) ÷ temps de marche | Pertes de vitesse, micro-arrêts |
| Taux de qualité | Quantité bonne ÷ quantité totale | Rebuts et retouches |
| Rendement premier passage | Unités conformes sans retouche ÷ unités lancées | Capabilité du procédé |
| Taux de rebut | Quantité rebutée ÷ quantité produite | Perte de matière |
| Respect du planning | Ordres (ou quantités) terminés comme planifiés ÷ planifiés | Stabilité du plan |
| Débit | Unités bonnes par heure | Capacité |
| En-cours (WIP) | Unités ou valeur entre la première et la dernière opération | Flux |
| Délai de fabrication | Heure de fin − heure de lancement | Réactivité client |
| MTBF / MTTR | Temps de fonctionnement ÷ pannes ; temps de réparation ÷ pannes | Maintenance |

**Exemple détaillé de TRS (un poste sur la Ligne 2) :** temps de production planifié 450 minutes, arrêts non planifiés 60 minutes, donc temps de marche 390 minutes. Temps de cycle idéal 1,0 minute, quantité totale 340, quantité bonne 323.

- Disponibilité = 390 ÷ 450 = 86,7 %
- Performance = (1,0 × 340) ÷ 390 = 87,2 %
- Qualité = 323 ÷ 340 = 95,0 %
- TRS = 0,867 × 0,872 × 0,950 = **71,8 %**

Contrôle croisé : quantité bonne × temps de cycle idéal ÷ temps de production planifié = 323 ÷ 450 = 71,8 %. Si votre MES ne passe pas ce contrôle, son modèle de temps est incohérent. Muchiri et Pintelon passent en revue les définitions du TRS utilisées et leurs pièges [30] ; le guide [TPM et TRS](https://www.m365.fm/en/learn/tpm-oee/) va plus loin.

### KPI sur le MES lui-même

| KPI | Définition | Sens de la cible |
|---|---|---|
| Latence des données | Délai entre l'événement sur l'atelier et sa disponibilité dans le MES / l'ERP | À la baisse (minutes, pas jours) |
| Taux de saisie automatique | Part des quantités et états captés depuis les machines par rapport aux saisies manuelles | À la hausse |
| Taux de correction manuelle | Corrections pour 100 ordres | À la baisse |
| Couverture des codes motif | Part des minutes d'arrêt avec un motif valide | À la hausse (plus de 90 % est un objectif courant) |
| Temps de traçabilité | Minutes pour produire une traçabilité ascendante complète d'un numéro de série ou d'un lot | À la baisse |
| Adoption | Part des ordres exécutés entièrement dans le MES (pas de contournement papier, sauf repli documenté en cas de panne) | À la hausse (l'état final est 100 % ; des contournements persistants signalent un problème de conception, pas un problème opérateur) |
| Taux d'erreur d'interface | Enregistrements échoués ou rejetés par jour | À la baisse |
| Disponibilité du MES | Temps de disponibilité pendant les heures de production | À la hausse |

## Les personnes et l'atelier

Un MES modifie la façon dont les opérateurs travaillent à chaque minute de leur poste. Les sites qui le traitent comme un projet informatique obtiennent en général des contournements ; ceux qui le traitent comme un changement de travail obtiennent une adoption.

**Ce que les opérateurs y gagnent :** des instructions à jour directement au poste au lieu d'un classeur, moins de formulaires, une aide plus rapide en cas de problème (appels andon depuis le terminal ; voir l'analyse détaillée sur l'[andon](https://www.m365.fm/en/learn/shop-floor-management/andon/)), et moins de reproches lorsque le système montre qu'un arrêt a été causé en amont.

**Ce que les opérateurs redoutent, souvent à juste titre :** être surveillés minute par minute, être bloqués par un système erroné et voir leur jugement remplacé par un écran. Il faut répondre directement à chacune de ces craintes :

- **Surveillance :** Décidez et publiez quelles données de main-d'œuvre le MES enregistre, qui y accède et à quoi elles servent. Utilisez les données de performance pour améliorer le processus, et non pour classer des individus. Dans les sites syndiqués, l'introduction d'une surveillance électronique et les modifications des règles de travail peuvent faire l'objet d'une négociation obligatoire ; impliquez le syndicat tôt et demandez l'avis d'un conseil juridique spécialisé en droit du travail [unverified: l'évaluation juridique dépend du contrat collectif et de la doctrine actuelle du NLRB].
- **Être bloqué par un système erroné :** Donnez aux opérateurs un moyen rapide et visible de signaler une instruction erronée ou un blocage injustifié, et traitez ces signalements en quelques jours. Chaque signalement non résolu apprend à l'atelier à trouver un contournement.
- **Jugement :** Réservez les arrêts forcés aux étapes critiques pour la sécurité et la qualité. Pour le reste, avertissez et enregistrez.

**Impliquez les opérateurs dans la conception.** Deux ou trois opérateurs par zone dans les ateliers de conception, des opérateurs qui testent les écrans avant la mise en service et des opérateurs formateurs entre pairs sont peu coûteux et efficaces. Le respect des personnes est une donnée d'entrée de la conception, pas une diapositive de conduite du changement ; voir la [production allégée](https://www.m365.fm/en/learn/lean-manufacturing/) pour le principe.

**Ergonomie et sécurité aux terminaux :** placez les terminaux là où se fait le travail, à hauteur debout, lisibles sous l'éclairage de l'usine et utilisables avec des gants. Les scanners ne doivent pas ajouter de déplacements. Un MES qui ajoute 30 secondes par opération à un takt de 60 secondes a échoué avant même la mise en service.

## Erreurs courantes dans la mise en œuvre d'un MES

| # | Erreur | Conséquence | Meilleure approche |
|---|---|---|---|
| 1 | Acheter des fonctionnalités avant de définir le modèle de données | Les interfaces cassent à cause d'identifiants incohérents, les KPI diffèrent d'un système à l'autre | Hiérarchie des équipements, responsables des données de référence et modèle temporel d'abord |
| 2 | Numériser à l'identique le processus papier actuel | Les mêmes gaspillages, désormais à l'écran | Simplifier d'abord le processus lors de la cartographie de la chaîne de valeur |
| 3 | Viser « tout ce qui figure dans la liste MESA-11 » | Projet pluriannuel, rien n'est en production | Une chaîne de valeur, trois à cinq cas d'usage, en service en quelques mois |
| 4 | Personnaliser au lieu de paramétrer | Les mises à jour deviennent des projets ; le support éditeur refuse | Accepter les processus standard là où ils ne sont pas un facteur de différenciation |
| 5 | Absence d'implication des opérateurs | Contournements, systèmes parallèles sur papier | Opérateurs impliqués dans la conception, les tests et la formation |
| 6 | L'ERP et le MES gèrent les mêmes données | Quantités et temps contradictoires | Un seul référentiel par attribut, documenté |
| 7 | Arrêts forcés partout | Les lignes s'arrêtent pour des raisons mineures ; la confiance s'effondre | Arrêts forcés uniquement là où la sécurité ou la qualité l'exigent |
| 8 | Négliger le réseau et les terminaux | Écrans lents, scans perdus | Étude de site et mise à niveau du réseau en phase 2 |
| 9 | Aucune solution de repli en cas de panne | La production s'arrête lorsque le MES ou le WAN tombe en panne | Procédure papier de secours testée et capacité hors ligne en périphérie |
| 10 | Conception de sécurité insuffisante | Réseau à plat entre bureaux et machines | Zones et conduits selon ISA/IEC 62443 ; moindre privilège [23][24] |
| 11 | Aucun responsable après la mise en service | Le MES se dégrade ; la qualité des données baisse | Équipe MES interne au site et un KPI d'adoption |
| 12 | Bénéfices jamais mesurés | Le business case du site suivant ne dispose d'aucune preuve | Référence de base figée, la finance suit les bénéfices pendant deux ans |
| 13 | Validation sous-estimée (secteurs réglementés) | Retards de plusieurs mois | Validation fondée sur les risques, planifiée dès la phase 1 |
| 14 | Considérer l'UNS ou la plateforme de données comme le MES | Données partout, aucune application des règles, aucun enregistrement | MES pour l'exécution et les enregistrements ; UNS pour la diffusion |

## Limites du MES et de l'ISA-95

Être honnête sur les limites vous aide à décider ce que vous ne devez pas acheter.

### Limites du MES

1. **Un MES ne répare pas un processus défaillant.** Si les gammes sont erronées, si les matières manquent ou si l'atelier fonctionne sans travail standard, le MES rend ces problèmes visibles, plus rapidement. C'est utile, mais ce n'est pas la solution. Commencez par les fondamentaux du Lean ; voir [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) et [5S et gestion visuelle](https://www.m365.fm/en/learn/5s-visual-management/).
2. **La qualité des données dépend des personnes.** Les saisies manuelles, les scans et les codes de motif ne valent que par la rigueur et la conception des écrans.
3. **Les systèmes rigides résistent au changement.** Un MES fortement personnalisé peut ralentir l'introduction de produits et les modifications de processus, ce qui est exactement le contraire de ce dont les ateliers à forte variété ont besoin.
4. **Le coût et l'effort sont élevés pour les petites usines.** Pour un atelier de sous-traitance de 30 personnes, le pilotage d'atelier par l'ERP, un outil simple de collecte de données et une bonne gestion visuelle peuvent apporter l'essentiel de la valeur.
5. **La planification n'est pas l'exécution.** Un MES doté d'un module d'ordonnancement ne remplace pas le S&OP ni la MRP ; voir [S&OP, MRP et planification de production](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **L'analytique relève à grande échelle d'ailleurs.** L'analyse multi-sites, l'IA et l'historique à long terme relèvent généralement d'une plateforme de données alimentée par le MES, et non du MES lui-même. Le guide sur le [jumeau numérique](https://www.m365.fm/en/learn/digital-twin-manufacturing/) et l'étude approfondie sur le [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) montrent ce que les données MES peuvent alimenter.

### Limites de l'ISA-95

1. **Elle est abstraite.** L'ISA-95 est indépendante de toute technologie par conception [1]. Elle indique ce qu'il faut nommer et échanger, pas comment le construire, si bien que deux produits « conformes à l'ISA-95 » peuvent rester difficiles à intégrer.
2. **Le modèle par niveaux n'est pas un chemin de données.** Lu littéralement, la hiérarchie suggère que les données circulent niveau par niveau via des interfaces point à point. Les architectures modernes (UNS, streaming d'événements, cloud) ne fonctionnent pas ainsi ; l'ISA elle-même insiste désormais sur les niveaux en tant que frontières, et non comme des canalisations [1][2].
3. **Les textes de la norme sont payants et longs.** De nombreuses équipes travaillent à partir de synthèses secondaires, ce qui conduit à des interprétations incohérentes. Achetez au minimum les parties 1 et 3 pour la bibliothèque du projet.
4. **La conformité n'est pas certifiée.** Il n'existe pas de certification formelle ISA-95 pour les produits, contrairement aux programmes de certification de sécurité produit de l'ISA/CEI 62443 [unverified: aucun programme de certification de produits ISA-95 trouvé]. « Conforme à l'ISA-95 » dans une brochure relève d'une affirmation du fournisseur.
5. **Les frontières sont tracées différemment en pratique.** L'ordonnancement, la qualité et la maintenance se situent dans des systèmes différents selon chaque usine ; le modèle d'activités s'en accommode, mais il ne tranche pas à votre place.

## Glossaire

| Terme | Signification |
|---|---|
| Modèle d'activités | Modèle de l'ISA-95 Partie 3 pour les activités de niveau 3 : quatre catégories d'opérations, huit activités génériques chacune [3] |
| APS | Planification et ordonnancement avancés ; logiciel d'ordonnancement à capacité finie |
| Enregistrement tel que construit | Enregistrement de la manière dont une unité ou un lot spécifique a été réellement fabriqué |
| B2MML | Business To Manufacturing Markup Language ; implémentation XML des objets de l'ISA-95, créée par la MESA [5] |
| Dossier de lot (eBR) | Enregistrement de la production et du contrôle d'un lot ; dossier de lot électronique lorsqu'il est tenu dans un MES |
| GMAO / EAM | Gestion de la maintenance assistée par ordinateur / gestion électronique des actifs de l'entreprise |
| MES composable | Terme commercial désignant un MES constitué de petites applications sur une plateforme commune |
| Ordonnancement détaillé | Activité de l'ISA-95 qui séquence les travaux sur les ressources au sein du niveau 3 [3] |
| Dossier historique de dispositif (DHR) | Terme du secteur des dispositifs médicaux désignant le dossier de production d'un dispositif ou d'un lot ; voir QMSR [20] |
| Lancement (dispatching) | Libération du prochain travail vers une ressource [3] |
| Hiérarchie des équipements | Structure de l'ISA-95 fondée sur les rôles : entreprise, site, zone, centre de travail, unité de travail |
| ERP | Progiciel de gestion intégré ; système métier de niveau 4 de l'ISA-95 |
| Généalogie | Liens entre les matières entrantes et les unités produites (traçabilité amont et aval) |
| Historien | Base de données de séries temporelles pour les valeurs de process |
| CEI 62264 | Publication internationale de l'ISA-95 [1][7] |
| ISA-88 | Norme de contrôle des procédés discontinus (batch), utilisée pour les structures de recettes |
| ISA-95 | ANSI/ISA-95, Intégration des systèmes entreprise-contrôle, huit parties [1] |
| ISA/CEI 62443 | Série de normes relatives à la sécurité des systèmes d'automatisation et de contrôle industriels [23] |
| ISO 22400 | Norme relative aux KPI du pilotage des opérations de fabrication [16] |
| LIMS | Système d'information de gestion de laboratoire |
| MES | Système d'exécution de la fabrication ; logiciel de niveau 3 orienté production, destiné à exécuter et enregistrer la production [8] |
| MESA-11 | Modèle de la MESA International datant de 1997, décrivant 11 fonctions MES [9][12] |
| MOM | Pilotage des opérations de fabrication ; ensemble du niveau 3 de l'ISA-95 |
| MQTT | Protocole de messagerie léger de type publication/abonnement, courant dans l'IIoT |
| MTConnect | Standard ouvert pour les données des équipements de fabrication (ANSI/MTC1.4-2018) [22] |
| TRS / OEE | Taux de rendement synthétique = disponibilité × performance × qualité |
| OPC UA | Norme de communication industrielle et de modélisation de l'information indépendante des fournisseurs, de l'OPC Foundation |
| Partie 11 | 21 CFR Part 11, règles de la FDA relatives aux enregistrements et signatures électroniques [19] |
| Modèle de Purdue | Modèle de référence de Purdue pour la fabrication intégrée par ordinateur, base des niveaux de l'ISA-95 [1] |
| QMS | Système de management de la qualité (logiciel de non-conformités, CAPA, documents, audits) |
| Revue par exception | Revue du dossier de lot centrée sur les écarts signalés par le système |
| SCADA | Supervision et acquisition de données ; logiciel de supervision de niveau 2 |
| Sparkplug | Spécification Eclipse s'appuyant sur MQTT pour les charges utiles et les états (certificats de naissance et de décès) [28] |
| Espace de noms unifié (UNS) | Schéma d'architecture : courtier central avec une arborescence hiérarchique de sujets contenant l'état courant de l'activité |
| WMS | Système de gestion d'entrepôt |
| Centre de travail / unité de travail | Niveaux de la hiérarchie des équipements de l'ISA-95 situés sous la zone |

## FAQ

### Qu'est-ce qu'un système d'exécution de fabrication, en termes simples ?

C'est le logiciel qui indique à l'atelier quoi faire ensuite et qui enregistre ce qui a réellement été fait, commande par commande et étape par étape. Gartner le définit comme un logiciel orienté production qui gère, surveille et synchronise l'exécution de processus physiques en temps réel, transformant les matières premières en produits [8].

### Quelles sont les principales fonctions d'un MES ?

Le modèle d'activités de l'ISA-95 recense huit activités génériques pour les opérations de production : gestion de la définition des produits, gestion des ressources, ordonnancement détaillé, répartition, gestion de l'exécution, collecte de données, suivi et analyse des performances [3]. Le modèle MESA de 1997 comptait 11 fonctions, ajoutant la gestion documentaire, la gestion de la main-d'œuvre, la gestion de la qualité, la gestion des processus et la gestion de la maintenance [9].

### Quels sont les avantages d'un MES ?

Des données de production saisies à la source plutôt que retapées, des délais de commande plus courts grâce à une lancement et une répartition plus rapides, moins de défauts de qualité échappant au contrôle grâce à des vérifications imposées, des rappels plus rapides et plus ciblés grâce à la généalogie par lot et par numéro de série, des arrêts plus visibles sur la contrainte, et des enregistrements électroniques prêts pour l'audit. Chaque avantage dépend d'une condition : des données de référence correctes, des contrôles configurés comme des arrêts stricts, un scan rigoureux des matières et une production qui peut effectivement être vendue. La section 1 indique quoi mesurer pour chacun d'eux.

### Qu'est-ce que l'ISA-95, en termes simples ?

L'ISA-95 (CEI 62264) est la norme internationale d'intégration des systèmes d'entreprise, comme l'ERP, avec les systèmes de contrôle de fabrication. Elle définit des niveaux, une hiérarchie des équipements, des modèles d'objets et des modèles d'activités afin que l'IT, l'OT et les métiers utilisent le même vocabulaire [1].

### Quels sont les cinq niveaux de l'ISA-95 ?

Le niveau 0 est le processus physique, le niveau 1 la détection et l'action, le niveau 2 la surveillance et le contrôle de supervision, le niveau 3 la gestion des opérations de fabrication (MES et systèmes associés) et le niveau 4 la planification d'entreprise et la logistique (ERP) [1].

### L'ISA-95 est-elle identique à la CEI 62264 ?

Le contenu est aligné : l'ISA publie l'ANSI/ISA-95, la CEI publie la CEI 62264. Les éditions et la numérotation diffèrent ; la partie 1 de l'ANSI/ISA-95 de 2025 est une adoption modifiée de la CEI 62264-1 [1][2], et la CEI 62264-6 est parue en 2020 [6]. Citez toujours la partie et l'édition.

### Combien de parties comporte l'ISA-95 ?

Huit : modèles et terminologie ; objets et attributs pour l'intégration entreprise-contrôle ; modèles d'activités de la MOM ; objets et attributs pour l'intégration de la MOM ; transactions entre l'entreprise et la fabrication ; modèle de service de messagerie ; modèle de service d'alias ; profils d'échange d'informations [1].

### Qu'est-ce que le niveau 3 de l'ISA-95 ?

Le niveau 3 est la gestion des opérations de fabrication : les activités qui transforment les plans en produits, sur des horizons de temps de jours, de postes, d'heures, de minutes et de secondes [4]. Il couvre les opérations de production, de maintenance, de contrôle qualité et de gestion des stocks [3]. Le MES est le système de niveau 3 le plus courant.

### Quelle est la différence entre MES et ERP ?

L'ERP (niveau 4) planifie ce qu'il faut fabriquer et le comptabilise sur un horizon de quelques mois à quelques jours. Le MES (niveau 3) exécute et enregistre la manière dont chaque commande est réellement fabriquée, par postes jusqu'à la seconde [4]. L'ERP détient la référence financière ; le MES détient la trace de ce qui a été réellement fabriqué. Ils échangent des ordres, des confirmations et des mouvements de matières.

### Ai-je besoin d'un MES si j'ai déjà un ERP ?

Pas nécessairement. Posez-vous quatre questions : devez-vous enregistrer par étape, numéro de série et paramètre plutôt que par opération ; des décisions dépendent-elles de minutes plutôt que de confirmations en fin de poste ; le système doit-il empêcher une mauvaise étape plutôt que simplement l'enregistrer ; et avez-vous besoin d'historiques électroniques de lots et d'équipements ? Si les quatre réponses sont non, la gestion d'atelier de l'ERP peut suffire. Si deux réponses ou plus sont oui, vous avez besoin de fonctions MES, qu'elles viennent de l'éditeur de l'ERP, d'un éditeur MES ou d'une plateforme (section 5).

### Quelle est la différence entre MES et SCADA ?

Le SCADA supervise et contrôle les machines et les processus en temps réel (variables, alarmes, consignes). Le MES gère les commandes, les matières, les personnes, la qualité et les enregistrements. Le SCADA sait qu'une machine tourne ; le MES sait pour quelle commande, quel lot de matière et quel opérateur elle tourne.

### Quelle est la différence entre MES et MOM ?

La MOM (gestion des opérations de fabrication) est le terme de l'ISA-95 désignant l'ensemble du niveau 3, y compris les opérations de production, de qualité, de maintenance et de gestion des stocks. Le MES désigne généralement le cœur production ; de nombreuses « suites MOM » sont des produits MES complétés de modules supplémentaires [10].

### Qu'est-ce que B2MML ?

B2MML est une implémentation XML des modèles d'objets ISA-95, créée par MESA International et utilisée dans de nombreuses interfaces ERP-MES ; le mapping OPC UA de l'ISA-95 le suit lorsque c'est possible [5]. Après la dissolution de MESA le 30 juin 2026, l'ISA a repris le contenu de MESA [11].

### Comment l'ISA-95 s'intègre-t-il aux systèmes ERP ?

L'ISA-95 définit l'interface entre le niveau 4 (ERP) et le niveau 3 (MES et autres systèmes d'exploitation). Les parties 2 et 4 définissent les objets échangés, et la partie 5 les transactions. En pratique, l'ERP transmet vers le bas les définitions de produits, les ordres de fabrication et les données matières ; le MES remonte vers le haut les confirmations d'opérations, les mouvements de marchandises, les notifications qualité et les statuts. B2MML implémente les modèles d'objets ISA-95 en XML [5]. Un modèle commun réduit le travail de spécification, mais chaque projet doit encore décider quel système est maître pour chaque champ et quel événement déclenche une écriture comptable (section 7).

### Un espace de nommage unifié remplace-t-il l'ISA-95 ou le MES ?

Non. Un UNS est un moyen de faire circuler et de partager des données d'état courant via un broker. Il a besoin de l'ISA-95 (ou d'un modèle similaire) pour le nommage et la sémantique, et il a besoin d'un MES et d'un ERP pour la logique métier et les enregistrements auditables.

### Combien coûte un MES ?

Cela dépend du périmètre, du nombre de lignes, du modèle de déploiement, de l'intégration et de la réglementation, et les éditeurs publient rarement leurs prix. Établissez votre propre coût total de possession sur cinq ans à partir des blocs de coûts de la section 13 ; dans notre usine illustrative de 220 employés, les coûts ponctuels ont été de 970 000 $ et les coûts récurrents de 300 000 $ par an.

### Combien de temps dure une mise en œuvre de MES ?

Pour une usine avec un produit paramétré, prévoyez environ six à douze mois jusqu'à un pilote stable, puis des vagues supplémentaires de trois à six mois [unverified: hypothèse de planification issue de la pratique]. Les usines réglementées et les développements sur mesure prennent plus de temps.

### SAP est-il un MES ?

Le noyau ERP de SAP dispose de fonctions de pilotage d'atelier ; SAP commercialise par ailleurs des produits MES distincts. Savoir si les fonctions ERP suffisent dépend de la granularité, de la latence, du niveau de contrainte et des besoins réglementaires décrits dans la section 5.

### Les petits fabricants ont-ils besoin d'un MES ?

Pas toujours. Un petit atelier à la commande peut souvent tirer l'essentiel de la valeur des confirmations d'atelier de l'ERP, d'une supervision machine simple et d'un bon management visuel. Un MES devient nécessaire lorsque vous avez besoin d'un contrôle imposé des étapes, de la généalogie des numéros de série, de dossiers de lots électroniques ou de décisions quasi temps réel. Le Manufacturing Extension Partnership (MEP) du NIST, qui se concentre sur les petits et moyens fabricants, est un endroit neutre vis-à-vis des éditeurs pour demander une évaluation [31].

### Qu'est-ce qu'un MES cloud ou un MES composable ?

Un MES cloud fonctionne comme un service dans le cloud de l'éditeur ; un MES composable est construit à partir de petites applications sur une plateforme commune. Les deux peuvent fonctionner ; vérifiez le comportement hors ligne en périphérie, le modèle de données partagé et, en cas de réglementation, la compatibilité du rythme de publication de l'éditeur avec votre validation.

### L'ISA-95 est-il toujours pertinent avec l'IIoT et les plateformes cloud ?

Oui. L'ISA indique que les niveaux servent toujours à décrire les frontières des systèmes pour l'Industrie 4.0 [1], et l'édition 2025 de la partie 1 a été rédigée pour des architectures modulaires et centrées sur les données [2]. Ce qui a vieilli, c'est l'idée que les données doivent remonter les niveaux un par un.

### Quels sont les inconvénients de l'ISA-95 ?

Il est abstrait et indique ce qu'il faut nommer et échanger, pas comment le construire. Lu au pied de la lettre, son modèle à niveaux suggère que les données doivent remonter niveau par niveau, ce que n'font pas les architectures modernes pilotées par événements. Les textes de la norme sont payants et longs, si bien que les équipes travaillent souvent à partir de synthèses incohérentes. « Conforme à l'ISA-95 » est une déclaration de l'éditeur, non une certification. Et il ne décide pas où votre usine trace la frontière entre les systèmes MES, qualité et maintenance (section 17).

### Quels KPI un MES doit-il suivre ?

Le TRS et ses composantes, le taux de rendement synthétique au premier passage, le taux de rebut, le respect du planning, le débit, les en-cours, le délai de traversée et le MTBF/MTTR, définis selon l'ISO 22400-2 [16][17]. Suivez aussi le MES lui-même : latence des données, taux de saisie automatique, adoption et temps de traçabilité.

### Que demande la 21 CFR Part 11 à un MES ?

Pour les systèmes fermés : validation, copies fidèles des enregistrements, protection des enregistrements, accès limité aux personnes autorisées et pistes d'audit sécurisées, générées par ordinateur et horodatées, qui n'occultent pas les entrées antérieures, entre autres contrôles [19]. Les signatures électroniques doivent être liées à leurs enregistrements.

## Conclusion et premières étapes

Un système d'exécution de fabrication vaut son coût lorsqu'il referme la boucle entre le plan et la réalité plus vite et plus fiablement que des personnes utilisant du papier et des tableurs. ISA-95 fournit la carte de ce domaine : les niveaux indiquent où se situe le MES, la hiérarchie des équipements donne à chaque système les mêmes noms, les modèles d'objets définissent ce que l'ERP et le MES échangent, et la matrice 4 × 8 du modèle d'activités montre quel système doit assurer quelle tâche. Un espace de noms unifié et les plateformes cloud modifient la plomberie, pas ces responsabilités.

Les projets qui réussissent suivent un même schéma : ils commencent par un flux de valeur et un modèle de données, pilotent une seule ligne avec une base de référence figée, impliquent les opérateurs dès le premier atelier, conservent des arrêts stricts pour ce qui compte vraiment, et mesurent les bénéfices avec la finance pendant des années. L'exemple détaillé le montre : le même MES est un bon ou un mauvais investissement selon que le gain sur la contrainte peut être vendu et selon la vitesse à laquelle le pilote se stabilise.

**Vos 30 premiers jours :**

- [ ] Parcourir un flux de valeur et repérer chaque endroit où l'information est ressaisie, retardée ou manquante
- [ ] Remplir la matrice d'activités ISA-95 (4 × 8) pour ce flux de valeur : qui réalise chaque activité aujourd'hui ?
- [ ] Ébaucher la hiérarchie des équipements pour la zone pilote et convenir des noms avec la maintenance et l'IT
- [ ] Figer une base de référence : TRS sur la contrainte, coût des rebuts, délai de traversée des commandes, temps de traçabilité
- [ ] Demander aux ventes et à la finance si la production supplémentaire sur la contrainte peut être vendue, et à quelle marge sur coûts variables
- [ ] Lister vos exigences réglementaires en matière d'enregistrements (Part 11, QMSR, FSMA 204, exigences clients)
- [ ] Échanger avec deux usines comparables qui exploitent un MES, sans la présence de fournisseurs
- [ ] Acheter les parties 1 et 3 de la norme ISA-95 pour la bibliothèque du projet

---

## Pour aller plus loin sur m365.fm

**Guides connexes**
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) : architecture cloud, espace de noms unifié sur Azure IoT Operations, plateforme de données
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

**Approfondissements**
- [Paperless Manufacturing and Digital Work Instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Andon System](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Manufacturing Workforce Skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Termes du glossaire (entités)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la production allégée, l'excellence opérationnelle et la transformation numérique de la production, notamment sur les systèmes et modèles de données qui relient l'atelier à la planification.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

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
