# SEO metadata

| Field | Value |
|---|---|
| Meta title | Planification de la production aéronautique : guide fournisseur |
| Meta description | Planification de la production aéronautique expliquée : AS9100, FAA Part 21/145, traçabilité, courbes d'apprentissage, montée en cadence, APS et MRO, avec exemples. |
| Slug | `aerospace-production-planning` |

# Planification de la production aéronautique : le guide complet pour les fournisseurs et les ateliers MRO

*Au 20 novembre 2026 · Sur la base de données sectorielles et d'entreprise, des normes IAQG/SAE, des réglementations FAA et EASA et de la littérature technique (voir Sources)*

> **Réponse courte :** La planification de la production aéronautique consiste à faire correspondre les cadences client à une capacité finie, à des délais d'approvisionnement longs, à des procédés spéciaux certifiés et à une traçabilité complète. Contrairement aux industries de grande série, il ne suffit pas de tenir la date. Il faut aussi prouver comment la pièce a été fabriquée : chaque pièce doit disposer d'une origine documentée, d'une configuration libérée et d'un processus maîtrisé, et ces preuves doivent être planifiées au même titre que les heures machine.

Mardi matin chez un sous-traitant de rang 2 spécialisé dans les pièces de structure. Le client a relevé de un cinquième les livraisons du trimestre suivant, car l'avionneur augmente sa cadence. Les cellules d'usinage cinq axes tournent déjà en trois-huit. Le traitement thermique est confié à un sous-traitant externe accrédité Nadcap, avec un délai de trois semaines. Une modification d'ingénierie vient d'arriver pour deux références, ce qui déclenche une inspection partielle du premier article. Et depuis hier, le service qualité cherche le certificat matière d'un lot de titane, car un client pose une question sur un lot déjà expédié.

Chacune de ces tâches peut être résolue isolément. La difficulté tient au fait qu'elles arrivent toutes dans le même plan au même moment. C'est ce qui distingue la planification de la production aéronautique de la planification dans de nombreux autres secteurs : elle ne planifie pas seulement des quantités et des dates, mais aussi des preuves, des approbations et des configurations. Et elle le fait sur un marché où les carnets de commandes des avionneurs sont pleins pour plusieurs années, alors que la chaîne d'approvisionnement est bloquée à plusieurs endroits à la fois.

Ce guide s'adresse aux directeurs d'usine, aux responsables de la planification et de l'ordonnancement, ainsi qu'aux responsables qualité chez les fournisseurs aéronautiques, et aux planificateurs des ateliers de maintenance, réparation et révision (MRO) et des stations de réparation. Les lecteurs qui recherchent l'ordonnancement de la production aéronautique trouveront le volet ordonnancement (capacité finie, APS, maîtrise des goulots) dans les sections 5, 10 et 11. Le guide présente la situation du marché en 2026 avec des chiffres sourcés, ce qui distingue le secteur, les normes et réglementations de part et d'autre de l'Atlantique (FAA et EASA), la traçabilité et la généalogie, les courbes d'apprentissage de Wright avec un exemple détaillé, la planification d'une montée en cadence, la planification de capacité avec APS et simulation, la planification MRO avec les constats imprévus, les KPI, une démarche pas à pas et les erreurs typiques. Une courte introduction au lien entre délai d'approvisionnement et traçabilité est également disponible dans l'article [Planification de la production aéronautique : délai et traçabilité](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) sur m365.fm.

Une remarque sur le contexte européen : la version originale de ce guide a été rédigée pour des fournisseurs allemands, et une grande partie de la chaîne d'approvisionnement mondiale d'Airbus passe par l'Europe. Lorsque les règles européennes (EASA, normes EN) comptent pour des entreprises américaines, par exemple lorsqu'elles fournissent des clients européens ou détiennent des agréments doubles FAA/EASA, ce guide les explique à côté de leurs équivalents américains.

### Points clés

- **La demande est là, mais pas la capacité.** Airbus affichait un carnet de commandes de 9 310 avions commerciaux à la fin septembre 2026 [3] ; Boeing signalait un carnet commercial de plus de 6 300 avions à la même date [47]. Les cadences augmentent plus lentement que prévu, car les moteurs, les pièces de fonderie et de forge, les matières premières et la main-d'œuvre qualifiée font défaut [4][10].
- **Planifier ici signifie planifier sous une charge de preuve.** La norme AS9100D exige, entre autres, la gestion de configuration, la traçabilité et la prévention des pièces contrefaites [14][44]. Les titulaires d'une approbation de production de la FAA doivent faire fonctionner un système qualité couvrant la maîtrise des fournisseurs, les enregistrements qualité et les échappements qualité [41]. Chaque modification de conception peut déclencher une inspection complète ou partielle du premier article selon AS9102 [18][46].
- **Le délai de livraison est surtout du temps d'attente.** La loi de Little énonce : délai = en-cours ÷ débit [27]. Hors procédés spéciaux, les boucles d'inspection et les validations sont des sources typiques d'attente.
- **Les courbes d'apprentissage sont des données d'entrée de la planification.** Wright a montré en 1936 que le nombre d'heures de main-d'œuvre par avion diminuait d'environ 20 % chaque fois que la production cumulée doublait [24][25]. Si vous planifiez un lancement avec les heures standard du régime mature, vous planifiez une capacité insuffisante.
- **Une montée en cadence échoue au goulot d'étranglement, et non en moyenne.** Une hausse de cadence de 20 % frappe beaucoup plus durement une ressource fonctionnant à 85 % de taux d'utilisation que ne le laisse supposer la capacité totale.
- **La planification MRO doit tenir compte de l'inconnu.** Le périmètre d'une visite en atelier n'est connu qu'après inspection. Une bonne planification MRO travaille avec des probabilités de découverte, des marges de sécurité et la disponibilité des pièces.
- **Aucun algorithme ne corrige des données de référence erronées.** Les APS, la simulation et les jumeaux numériques exigent des gammes, des temps standard, des capacités et des données de certification exactes.

### Parcours de lecture rapides

| Vous êtes … | Lisez d'abord |
|---|---|
| Directeur d'usine chez un fournisseur confronté à une hausse de cadence | Sections 1, 9 et 10 (marché, courbe d'apprentissage, montée en cadence avec liste de contrôle) |
| Planificateur de production ou ordonnanceur confronté à des plans ERP irréalistes | Sections 5, 6 et 11 (niveaux de planification, délai de livraison, APS et simulation) |
| Responsable qualité | Sections 3, 4 et 8 (normes et réglementations, traçabilité, modifications d'ingénierie) |
| Planificateur MRO dans une station de réparation | Sections 3, 4 et 13 (Part 145, pièces à durée de vie limitée, planification MRO) |
| Responsable IT, numérique ou cybersécurité | Sections 3.6, 4, 11, 14 et 16 (ITAR/CMMC, modèle de données, APS, jumeau numérique, approche) |

## Table des matières

1. [Le marché 2026 : pourquoi la planification est devenue le goulot d'étranglement](#1-le-marché-2026--pourquoi-la-planification-est-devenue-le-goulot-détranglement)
2. [Ce qui distingue la planification de la production aéronautique des autres industries](#2-ce-qui-distingue-la-planification-de-production-aéronautique-des-autres-industries)
3. [Normes et réglementations qui comptent pour la planification](#3-normes-et-réglementations-importantes-pour-la-planification)
4. [Traçabilité et généalogie](#4-traçabilité-et-généalogie)
5. [Niveaux de planification : de la cadence client à l'opération](#5-niveaux-de-planification--du-taux-client-à-lopération)
6. [Comprendre et réduire le délai de fabrication](#6-comprendre-et-réduire-le-délai-de-traversée)
7. [Planification des procédés spéciaux et des opérations externalisées](#7-planification-des-processus-spéciaux-et-des-opérations-externalisées)
8. [Modifications d'ingénierie et gestion de la configuration](#8-modifications-techniques-et-gestion-de-configuration)
9. [Courbes d'apprentissage de Wright : théorie et exemple chiffré](#9-courbes-dapprentissage-de-wright--théorie-et-exemple-chiffré)
10. [Planifier une montée en cadence : calcul et liste de contrôle](#10-planification-dune-montée-en-cadence--calcul-et-liste-de-contrôle)
11. [Planification de capacité avec APS, gestion des goulots et simulation](#11-planification-de-la-capacité-avec-aps-gestion-des-goulots-détranglement-et-simulation)
12. [Risques de la chaîne d'approvisionnement de 2022 à 2026 et leurs conséquences pour la planification](#12-risques-de-la-chaîne-dapprovisionnement-de-2022-à-2026-et-leurs-conséquences-pour-la-planification)
13. [Planification MRO : maintenance avec constats imprévus](#13-planification-mro--maintenance-avec-constats-non-planifiés)
14. [Jumeau numérique et fil numérique](#14-jumeau-numérique-et-fil-numérique)
15. [Indicateurs de performance (KPI) pour la planification et le pilotage](#15-indicateurs-clés-kpi-pour-la-planification-et-le-pilotage)
16. [Approche : six étapes pour un plan fiable](#16-approche--six-étapes-pour-un-plan-fiable)
17. [Erreurs courantes et comment les éviter](#17-erreurs-courantes-et-comment-les-éviter)
18. [iFAKT et l'aéronautique](#18-ifakt-et-laéronautique)
19. [Glossaire](#19-glossaire)
20. [FAQ : questions fréquentes sur la planification de la production aéronautique](#20-faq--questions-fréquentes-sur-la-planification-de-production-aéronautique)
21. [Conclusion](#21-conclusion)

## 1. Le marché 2026 : pourquoi la planification est devenue le goulot d'étranglement

### 1.1 Une demande record, une capacité de livraison limitée

L'aviation commerciale se trouve dans une situation inhabituelle : la demande d'avions neufs n'a jamais été aussi forte, mais l'industrie ne peut pas livrer au rythme souhaité par les clients. Selon une étude que l'association des compagnies aériennes IATA a présentée avec Oliver Wyman en octobre 2025, le carnet de commandes mondial d'avions commerciaux a atteint un niveau record de plus de 17 000 appareils en 2024. Entre 2010 et 2019, il s'élevait en moyenne à environ 13 000 [9]. L'étude estime que les retards de livraison ont coûté plus de 11 milliards de dollars aux compagnies aériennes en 2025. Les postes les plus importants sont la surconsommation de carburant des avions plus anciens (environ 4,2 milliards de dollars), la maintenance supplémentaire (3,1 milliards de dollars), la location de moteurs (2,6 milliards de dollars) et l'augmentation des stocks de pièces de rechange (1,4 milliard de dollars) [9].

Les chiffres des deux grands constructeurs illustrent la situation en détail :

| Indicateur | Airbus | Boeing |
|---|---|---|
| Livraisons 2025 | 793 avions commerciaux, dont 607 de la famille A320 [2] | 600 avions commerciaux, dont 447 Boeing 737 [6] |
| Carnet de commandes | 8 754 à la fin de 2025 [2] ; 9 310 à la fin de septembre 2026 [3] | plus de 6 100 à la fin de 2025, d'une valeur d'environ 567 milliards de dollars [6] ; plus de 6 300 à la fin de septembre 2026, d'une valeur de 611,8 milliards de dollars [47] |
| Objectif 2026 | environ 870 livraisons [3] | aucune prévision en unités dans les sources citées |
| Situation 2026 | 547 livraisons jusqu'au 30 septembre [3] ; 621 jusqu'à la fin octobre [5] | 161 livraisons au T3 2026, dont 124 Boeing 737 [47] ; programme 737 toujours en progression vers une production stabilisée de 47 par mois ; 787 stable à 8 par mois [47] |

### 1.2 Objectifs de cadence et pourquoi ils ne cessent de bouger

Pour les fournisseurs, la cadence mensuelle du constructeur d'avions est l'entrée de planification la plus importante, car elle commande les lancements dans tous les niveaux de la chaîne d'approvisionnement. Dans son rapport sur les neuf premiers mois de 2026, Airbus annonce les objectifs suivants : 70 à 75 avions de la famille A320 par mois d'ici la fin de 2027, puis une stabilisation à la cadence 75 ; cadence 12 pour l'A350 en 2028 ; cadence 13 pour l'A220 en 2028 ; et cadence 5 pour l'A330 en 2029 [3].

L'historique de la cible « cadence 75 » montre à quel point ce type d'hypothèse est volatil. Airbus voulait initialement atteindre cette cadence en 2025 à 2026. Fin 2024, la cible a été repoussée à 2027 [4]. En avril 2026, le PDG d'Airbus, Guillaume Faury, a publiquement reproché à Pratt & Whitney de ne pas livrer le nombre de moteurs commandés et a évoqué des retards qui ne correspondaient ni à la demande ni aux commandes [4]. Les médias spécialisés considèrent possible un glissement de la cadence 75 jusqu'en 2028 [4]. La fourchette cible de 70 à 75 d'ici fin 2027 reflète la situation au 28 octobre 2026 [3].

Chez Boeing, la FAA a plafonné la production du 737 MAX à 38 avions par mois après l'arrachement d'une porte sur un vol d'Alaska Airlines en janvier 2024. En octobre 2025, la FAA a approuvé une hausse à 42 [7]. En mai 2026, le PDG de Boeing, Kelly Ortberg, a indiqué que la chaîne tournait désormais à la cadence 47 ; il a décrit une nouvelle étape vers 52 comme une contrainte plus lourde en raison des niveaux de stocks dans la chaîne d'approvisionnement [8]. Le communiqué du troisième trimestre de Boeing, publié le 27 octobre 2026, indique que le programme 737 progresse toujours vers une production stabilisée de 47 appareils par mois [47].

**Ce que cela signifie pour votre planification :** les cibles de cadence ne sont pas des engagements. Ce sont des hypothèses de planification assorties d'une incertitude importante. Un fournisseur qui dimensionne ses capacités strictement sur la cible officielle s'expose à des coûts d'immobilisation. Un fournisseur qui investit trop tard devient lui-même le goulot d'étranglement, dans une industrie où une seule pièce manquante bloque un avion entier. Une planification robuste travaille donc avec des scénarios (par exemple cadence 60, 67 et 75) et avec des seuils de déclenchement d'investissement définis à l'avance.

### 1.3 L'industrie en chiffres : États-Unis et Allemagne

L'industrie américaine de l'aérospatiale et de la défense est la plus importante au monde. Selon l'Aerospace Industries Association (AIA) et S&P Global Market Intelligence, le secteur a réalisé un chiffre d'affaires total de 988,6 milliards de dollars en 2025 (l'AIA chiffre l'activité économique totale à 1 000 milliards de dollars) et soutenu environ 2,1 millions d'emplois. Environ 1,1 million de ces emplois et près de 483 milliards de dollars d'activité se situent dans la chaîne d'approvisionnement nationale. Les exportations ont atteint 172,7 milliards de dollars, en hausse de 25 % sur un an [48]. Autrement dit, près de la moitié des emplois se trouvent chez les fournisseurs, soit précisément le groupe auquel ce guide s'adresse.

L'Allemagne représente une part plus modeste mais importante de la chaîne d'approvisionnement d'Airbus, et elle est le marché d'origine de la version initiale de ce guide. La fédération allemande de l'industrie aérospatiale (BDLI) a publié des chiffres record en mai 2026 : 62 milliards d'euros de chiffre d'affaires en 2025 (2024 : 52 milliards d'euros, soit +19 %) et 130 000 salariés (année précédente : 120 000). L'aviation civile est le premier segment avec 45 milliards d'euros de chiffre d'affaires (+15 %), suivie de l'aviation militaire avec 13,5 milliards d'euros (+35 %) et du spatial avec 3,5 milliards d'euros. La part des exportations s'élevait à 66 %, et les dépenses de recherche et développement atteignaient environ 4 milliards d'euros [1].

Derrière ces chiffres, de part et d'autre de l'Atlantique, se trouvent de nombreux petits et moyens fournisseurs aux côtés des OEM et des grands maîtres d'œuvre. Ils fabriquent des pièces de structure, des composants de cabine, des pièces moteur, des systèmes et des procédés spéciaux, ou fournissent des services de maintenance. Pour ces entreprises en particulier, le passage d'une sous-activité (2020 à 2022) à une surcharge durable représente un défi de planification.

### 1.4 Le point de vue des fournisseurs : ce que révèlent les enquêtes

Le cabinet de conseil Roland Berger a interrogé 95 entreprises de la chaîne d'approvisionnement aérospatiale au début de 2026 [10]. Les résultats sont révélateurs pour quiconque est responsable de la planification :

- 55 % des entreprises signalent des perturbations de la chaîne d'approvisionnement (2025 : 64 %).
- Environ 80 % constatent un risque moyen à élevé de pénurie de matières premières critiques ; le titane, l'acier, le cuivre, les terres rares et les aimants sont les plus souvent cités.
- 56 % font état d'une pénurie de personnel qualifié (année précédente : 65 %). Il reste le frein le plus courant à la montée en cadence.
- Près de 40 % manquent de capacité de production.
- Environ un tiers opère avec une marge EBIT inférieure à 5 %, et 40 % ont constitué des stocks plus élevés pour le démarrage de la production, ce qui accentue la pression sur les marges.
- Les délais de livraison longs touchent non seulement les matières, mais aussi des prestations comme les essais, les traitements de surface et les finitions.

Une enquête antérieure va dans le même sens d'un point de vue planification. Dans une évaluation de la capacité à suivre les cadences portant sur plus de 100 fournisseurs en Asie, en Europe et aux États-Unis, le cabinet de conseil Vendigital a constaté que 38 % d'entre eux disposaient de processus de planification de capacité inadéquats. Il a désigné comme causes la pénurie de compétences, la méconnaissance de l'état des installations et des machines, des programmes de maintenance non respectés et une mauvaise communication entre les planificateurs seniors et l'atelier [55]. L'article n'indique pas de date de publication ; il fait référence au plan d'Airbus de 2021 visant la cadence 75 d'ici 2025, les données sont donc vieilles de plusieurs années.

Le dernier point de la liste de Roland Berger est central pour la planification : les procédés spéciaux et les contrôles sont devenus eux-mêmes des goulots d'étranglement dans de nombreuses chaînes d'approvisionnement. La section 7 traite de la manière de les gérer.

## 2. Ce qui distingue la planification de production aéronautique des autres industries

De nombreux principes de planification s'appliquent à toute fabrication discrète. L'aéronautique combine cependant plusieurs caractéristiques, familières isolément, qui exigent ensemble une logique de planification propre.

### 2.1 Forte variété, faibles volumes et nombreuses variantes

Un fournisseur aéronautique fabrique typiquement de nombreuses références en petites quantités. Même à une cadence de 75 avions par mois, cela représente environ 3,5 avions par jour ouvré (sur environ 21 jours ouvrés par mois). Une pièce installée une fois par avion a donc une quantité journalière à un chiffre. Ajoutez à cela les variantes spécifiques au client (configuration de cabine), la demande en pièces de rechange et les pièces destinées aux anciens modèles. Il en résulte un environnement à forte variété et faibles volumes (HMLV), dans lequel les préparations de machines, les changements de programme et l'effort de contrôle mobilisent une part importante de la capacité.

### 2.2 Délais longs et nomenclatures profondes

Une pièce de structure en titane peut passer plusieurs semaines entre la matière première et l'expédition : forgeage ou moulage, ébauche, traitement thermique, usinage de finition, contrôle non destructif (CND), traitement de surface, contrôle final. Plusieurs de ces étapes sont souvent confiées à des sous-traitants spécialisés. Les nomenclatures des grands ensembles sont profondément imbriquées ; un avion se compose de millions de pièces qui se rejoignent à travers de nombreux niveaux d'approvisionnement. La conséquence : un retard à un niveau inférieur se manifeste souvent des semaines plus tard sur la ligne d'assemblage final. Si vous ne comprenez pas et ne gérez pas activement les [délais d'obtention](https://www.m365.fm/entity/lead-time/), vous planifiez avec des marges que vous ne connaissez pas.

### 2.3 Certification, qualification et preuves

Dans l'aéronautique, il ne suffit pas de fabriquer une pièce aux cotes. Elle doit être réalisée selon un procédé validé, sur des équipements qualifiés, par du personnel qualifié, à partir de matière certifiée et dans la configuration approuvée, et tout cela doit être documenté. Cela a des conséquences directes sur la planification : une commande ne peut pas simplement être transférée vers une machine libre mais non qualifiée. Un salarié sans qualification valide pour un procédé spécial ne constitue pas de la capacité du point de vue de la planification. Un changement de fournisseur peut exiger une nouvelle inspection de première pièce.

### 2.4 Logique de cadence plutôt que logique de taille de lot

Les constructeurs d'avions planifient en cadences mensuelles annoncées plusieurs années à l'avance et relevées par paliers. Un fournisseur doit traduire cette cadence en lots de production propres sans perdre le rythme de son client. Parallèlement, les paliers de cadence sont rarement réguliers : le client constitue des stocks, repousse ses appels de livraison ou les avance. Une bonne planification sépare donc la cadence client (ce dont le client a besoin à long terme) des appels de livraison (ce que le client commande à court terme) et suit l'écart entre les deux.

### 2.5 Cycles de vie produit longs

Un type d'avion est souvent construit pendant des décennies, puis exploité plus longtemps encore. Cela signifie que les révisions de plans, les spécifications de matériaux et les approbations de procédés restent valables longtemps, tout en évoluant sans cesse. Les pièces de rechange pour les configurations anciennes doivent rester disponibles. Et les enregistrements doivent être conservés pendant de très longues périodes. Selon les règles de la FAA, le titulaire d'une approbation de production doit conserver les dossiers qualité pendant au moins 5 ans pour les produits et articles fabriqués dans le cadre de cette approbation, et pendant au moins 10 ans pour les composants critiques [41] ; les exigences des clients vont souvent plus loin. En pratique, les durées de conservation découlent des exigences contractuelles transmises par les clients et de la réglementation applicable.

### 2.6 Le coût élevé d'une erreur

Une pièce défectueuse qui parvient au client (une fuite qualité, ou « escape ») peut déclencher des retouches sur la ligne d'assemblage final, des inspections des avions livrés ou, dans les cas extrêmes, des immobilisations au sol. La FAA traite ce sujet comme une question de système qualité à part entière : le 14 CFR 21.137 énumère les « quality escapes » parmi les éléments obligatoires du système qualité d'un titulaire d'agrément de production [41]. Le moteur Pratt & Whitney GTF montre ce à quoi peut mener un défaut matériau (Section 12). Pour la planification, cela signifie que les contrôles qualité ne sont pas une marge que l'on peut réduire lorsque le planning se tend. Ils font partie intégrante de la gamme.

## 3. Normes et réglementations importantes pour la planification

### 3.1 Vue d'ensemble de la famille de normes IAQG

L'International Aerospace Quality Group (IAQG) élabore les normes qualité du secteur. Elles sont publiées en Amérique sous la forme de normes AS (par SAE International), en Europe sous la forme de normes EN et en Asie sous la forme de normes JISQ ; le contenu est identique. La norme de référence est la 9100, complétée par des normes pour les organismes de maintenance (9110), les distributeurs (9120), l'inspection du premier article (9102), la gestion de la variabilité des caractéristiques clés (9103) et d'autres encore [13]. Aux États-Unis, on rencontre surtout les désignations AS (AS9100D, AS9102C, AS9145) ; les clients et documents européens utilisent EN 9100 et ainsi de suite. Elles renvoient aux mêmes exigences.

Côté réglementation, deux systèmes concernent la plupart des fournisseurs : la Federal Aviation Administration (FAA) américaine, dont les règles figurent au titre 14 du Code of Federal Regulations (14 CFR), et l'Agence européenne de la sécurité aérienne (EASA). Source de confusion, les deux systèmes disposent d'une « Part 21 » et d'une « Part 145 », et dans les deux, le sous-chapitre G de la Part 21 couvre les agréments de production. Leur finalité est similaire, sans être identique.

Le tableau suivant résume ce que vous devez savoir en tant que responsable de la planification :

| Norme / réglementation | Contenu | Incidence sur la planification |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Système de management de la qualité pour l'aéronautique, le spatial et la défense ; comprend l'ISO 9001:2015 plus environ 105 exigences additionnelles propres au secteur, notamment la gestion de configuration, la gestion des risques, la sécurité des produits, la prévention des pièces contrefaites, la traçabilité et le respect des délais de livraison [14][44] | Le respect des délais de livraison devient un indicateur audité ; la traçabilité des matières, des processus, des outillages et des personnes doit accompagner le flux de commandes [14] |
| **AS9102C** (2023 ; EN 9102:2024) | Inspection du premier article (FAI) : vérification complète de la première pièce issue du processus de fabrication par rapport à toutes les caractéristiques de conception [17][18][46] | Prévoir l'effort de FAI comme une opération à part entière ; toute modification de la conception, de la matière, de la source, du processus, de l'outillage ou du site, ainsi qu'une interruption de production de plus de deux ans, déclenche une FAI complète ou partielle [18][34] |
| **AS9103 / EN 9103:2023** | Maîtrise de la variation des caractéristiques clés [19] | Les caractéristiques clés exigent des études de capabilité des processus et des cartes de contrôle ; cela mobilise la capacité d'inspection et influe sur les tailles de lots et la fréquence des contrôles |
| **AS9145** (2016 ; EN 9145:2018) | Planification avancée de la qualité produit (APQP) et processus d'approbation des pièces de production (PPAP) pour l'aéronautique, en cinq phases, de la planification à la production courante [16][35][45] | La disponibilité à la production doit être démontrée à la cadence client (revue de disponibilité à la production, essais à cadence) ; la planification du lancement et la preuve de capacité font partie de l'approbation [35] |
| **AS9110 / EN 9110:2018** | Système de management de la qualité pour les organismes de maintenance aéronautique [20] | Ajoute des exigences de système qualité pour la Partie 145 ; pertinent pour les processus de planification, la maîtrise des fournisseurs et les indicateurs en MRO |
| **AS9120 / EN 9120** | Système de management de la qualité pour les distributeurs et les stockistes [13][14] | Traçabilité et chaîne des certificats pour les pièces standard et les matières premières achetées |
| **Nadcap** | Programme d'accréditation géré par l'industrie pour les procédés spéciaux, créé en 1990 sous l'égide de la SAE et administré par le Performance Review Institute (PRI) ; domaines incluant le traitement thermique, le traitement chimique, le CND, le soudage, les revêtements et les composites [21][54] | De nombreux clients n'autorisent que des ateliers accrédités à réaliser les procédés spéciaux ; cela limite le choix des sources et fait souvent des procédés spéciaux le goulot d'étranglement |
| **FAA 14 CFR Partie 21, sous-partie G** (certificat de production) ; également sous-partie K (approbation de fabricant de pièces, PMA) et sous-partie O (autorisation TSO) | Approbations de production ; 14 CFR 21.137 exige un système qualité écrit comportant 14 éléments, dont la maîtrise des données de conception, la maîtrise des fournisseurs, la maîtrise des processus de fabrication, la maîtrise des produits non conformes, les enregistrements qualité et les échappements qualité [41] | Le titulaire de l'approbation maîtrise ses fournisseurs ; les enregistrements doivent être conservés au minimum 5 ans (10 ans pour les composants critiques) [41]. La plupart des fournisseurs de rang 2 et de rang 3 ne détiennent pas eux-mêmes d'approbation de production, mais travaillent sous la maîtrise fournisseur de leur client |
| **FAA 14 CFR Partie 145** | Certificat de station de réparation ; travaux uniquement dans le cadre des qualifications et des spécifications d'exploitation, avec des données de maintenance à jour, un programme de formation approuvé par la FAA et des enregistrements conservés au minimum 2 ans [42] | La planification ne peut affecter que des travaux pour lesquels la station est qualifiée, à du personnel formé, avec des manuels et des données à jour à disposition |
| **EASA Partie 21, sous-partie G** | Agrément d'organisme de production (POA) dans l'UE [22] | Le titulaire de l'agrément libère les pièces au moyen d'un formulaire EASA Form 1 et supervise ses fournisseurs ; les processus et le personnel doivent correspondre à l'agrément. Pertinent pour les fournisseurs américains de clients européens |
| **EASA Partie 145** | Agrément d'organisme de maintenance (annexe II du règlement (UE) n° 1321/2014) [23] | Travaux uniquement dans le périmètre approuvé (qualification), avec du personnel certificateur et des données de maintenance valides. Une installation détenant à la fois des agréments FAA et EASA peut émettre une libération double sur le formulaire FAA 8130-3 [43] |
| **EASA Part-CAMO** | Organisme de gestion du maintien de la navigabilité, instauré par le règlement (UE) 2019/1383 [23] | Planifie le programme de maintenance, les consignes de navigabilité et les pièces à durée de vie limitée en Europe, et transmet les lots de travaux au MRO |
| **ITAR / EAR** (États-Unis) | Contrôles d'exportation pour les articles de défense (ITAR, 22 CFR 120–130) et les biens à double usage (EAR, 15 CFR 730–774) [36] | L'accès aux données techniques et aux pièces peut être restreint selon la personne et le lieu ; cela s'applique aussi à la planification et aux systèmes informatiques |
| **DFARS / CMMC 2.0** (programmes de défense américains) | Cybersecurity Maturity Model Certification ; clause DFARS 252.204-7021 en vigueur depuis le 10 novembre 2025, déployée progressivement sur trois ans ; règle du programme 32 CFR Partie 170 [49][50] | Les fournisseurs qui traitent des informations fédérales contractuelles (FCI) ou des informations non classifiées contrôlées (CUI) dans leurs systèmes de planification, ERP ou MES doivent disposer du niveau CMMC requis ; les contractants principaux doivent vérifier le statut CMMC d'un sous-traitant avant l'attribution [49] |
| **DFARS 252.225-7009** (métaux spéciaux) | Les métaux spéciaux, dont le titane et les alliages de titane, contenus dans les articles livrés au titre de contrats du DoD doivent être fondus ou produits aux États-Unis ou dans un pays qualifié ; cette exigence se répercute sur les sous-traitants pour les articles contenant des métaux spéciaux [51] | La planification des matières doit suivre l'origine de la coulée par lot de fusion, et non seulement l'alliage et la quantité ; un lot moins cher ou plus rapide provenant d'une source non qualifiée peut être inutilisable |

### 3.2 AS9100 en détail : ce que la norme implique pour la planification

L'AS9100D reprend la structure de l'ISO 9001 et ajoute des exigences qui touchent directement la planification [44]. Trois d'entre elles sont particulièrement importantes.

**Gestion de la configuration.** Vous devez savoir à tout moment quelle révision de conception s'applique à quel ordre et quelle révision a effectivement été fabriquée. Cela concerne le lancement des ordres (ne lancer que des révisions valides), la gestion des ordres ouverts lorsque des modifications arrivent et la documentation des écarts.

**Traçabilité.** La norme exige la traçabilité de toutes les matières premières, de tous les matériaux et procédés utilisés, ainsi que des outils et des personnes [14]. Pour la planification, cela signifie que chaque confirmation d'opération doit au minimum enregistrer qui a travaillé, quand, sur quelle machine, avec quel matériau et selon quelle révision de procédé. La section 4 approfondit ce point.

**Livraison à la date prévue.** L'AS9100 cite explicitement la livraison à la date prévue comme exigence [14]. Les clients évaluent leurs fournisseurs sur la livraison à la date prévue (OTD) et sur la qualité. Une mauvaise OTD n'est donc pas seulement un problème commercial, c'est aussi un problème d'audit.

### 3.3 Approbation de production FAA : ce que la 14 CFR 21.137 signifie pour les planificateurs

Si vous détenez un certificat de production FAA ou une approbation de fabricant de pièces (PMA ; les titulaires de PMA doivent satisfaire aux mêmes exigences de système qualité au titre de la 14 CFR 21.307), ou si vous fournissez un tel titulaire, les exigences de système qualité de la 14 CFR 21.137 façonnent votre planification [41]. La règle impose à chaque demandeur ou titulaire d'un certificat de production d'établir un système qualité écrit « qui garantit que chaque produit et article est conforme à sa conception approuvée et se trouve dans un état permettant une exploitation sûre » [41]. Ses 14 éléments se lisent comme une liste de contrôle pour un processus de planification fonctionnel :

- **Maîtrise des données de conception et des documents :** seule la révision actuelle et approuvée peut être transmise à l'atelier.
- **Maîtrise des fournisseurs :** procédures garantissant que chaque produit, article ou service fourni par un fournisseur est conforme aux exigences du titulaire de l'approbation, ainsi qu'un processus de signalement des non-conformités découvertes après la mise à disposition [41].
- **Maîtrise du processus de fabrication, contrôle et essais, état des contrôles et essais :** la gamme doit indiquer quels contrôles ont lieu à quelle étape, et l'état de chaque pièce doit être visible.
- **Maîtrise des produits non conformes et actions correctives :** les rebuts, les retouches et les écarts doivent être planifiés et documentés, et non traités de manière informelle.
- **Maîtrise des enregistrements qualité :** au moins 5 ans pour les produits et articles, au moins 10 ans pour les composants critiques [41].
- **Retour d'expérience en service et fuites qualité :** les constats issus du terrain et les fuites qualité remontent dans le système.

Pour un fournisseur de rang 2 ou 3 sans approbation propre, ces exigences arrivent sous forme de transmission contractuelle dans le bon de commande du client et dans son manuel qualité fournisseur. La conséquence pour la planification reste la même : les preuves doivent être produites dans le flux de commande, et non reconstituées après coup.

### 3.4 Perspectives : l'AS9100D devient l'IA9100

L'IAQG travaille à une révision de la série 9100 qui doit être publiée sous le nom d'IA9100. Le nouveau nom vise à unifier les désignations régionales (AS, EN, JISQ). À la mi-octobre 2026, selon une revue des informations disponibles, il n'existait ni publication officielle ni date confirmée ; les estimations vont de la fin 2026 au début 2027. La période de transition pour les certificats n'a pas non plus été fixée [15]. Jusque-là, l'AS9100D (EN 9100:2018) reste l'édition en vigueur, et les certificats existants restent valables [15]. Planifiez la transition comme un projet distinct dès que l'IAQG aura publié la norme, et convenez du calendrier avec votre organisme de certification.

### 3.5 AS9145 : démontrer la capacité de production au rythme client

L'AS9145 introduit en aéronautique l'APQP et le PPAP, des méthodes familières de l'industrie automobile [45]. Elle structure le chemin vers la production en cinq phases : planification ; conception et développement du produit ; conception et développement du processus ; validation du produit et du processus ; production en série, utilisation et service après livraison [35]. Le dossier PPAP comprend, entre autres, les enregistrements de conception, un diagramme de flux du processus, une AMDEC processus, un plan de contrôle, une analyse du système de mesure, des études initiales de capabilité du processus et le rapport d'inspection du premier article (FAIR) [35].

Les phases 3 et 4 sont déterminantes pour la planification. Lors de la phase 3, la préparation à la production est évaluée dans une revue de préparation à la production, et les processus doivent répondre aux exigences au rythme de la demande du client. Lors de la phase 4, les séries de production doivent démontrer que le processus livre des pièces conformes au rythme client [35]. En d'autres termes : la preuve de capacité fait partie de l'approbation. Si votre capacité n'existe que sur le papier, c'est à ce moment-là que cela se voit.

### 3.6 Programmes de défense : CMMC 2.0, contrôles à l'exportation et métaux spéciaux

De nombreux fournisseurs aéronautiques servent à la fois des clients commerciaux et de défense, souvent sur les mêmes machines et dans le même système ERP. Trois exigences américaines touchent alors la planification :

- **CMMC 2.0.** La règle DFARS « Assessing Contractor Implementation of Cybersecurity Requirements » est entrée en vigueur le 10 novembre 2025. Elle ajoute la clause 252.204-7021 et échelonne les exigences CMMC sur plus de trois ans ; la règle du programme sous-jacente, 32 CFR Part 170, est entrée en vigueur le 16 décembre 2024 [49]. Le modèle comporte trois niveaux et est aligné sur le NIST SP 800-171 [50]. La transmission aux sous-traitants s'applique lorsque le contrat de sous-traitance implique des FCI ou des CUI, et les contractants principaux doivent confirmer le statut CMMC actuel d'un sous-traitant avant l'attribution [49]. Si des plans, des gammes ou des instructions de travail contenant des CUI se trouvent dans votre système de planification, ce système est concerné.
- **ITAR et EAR.** Les données techniques relatives aux articles de défense ne doivent être accessibles qu'aux personnes autorisées [36]. Les planificateurs, le support informatique offshore et les locataires cloud doivent tous être vérifiés. Cela influence l'endroit où sont stockées les données de planification et qui peut voir quelles commandes.
- **Métaux spéciaux.** Selon la clause DFARS 252.225-7009, le titane et les alliages de titane (parmi d'autres métaux spéciaux) contenus dans les articles livrés au titre de contrats du DoD doivent être fondus ou produits aux États-Unis ou dans un pays qualifié, et la clause est transmise aux sous-traitants pour les articles contenant des métaux spéciaux [51]. L'allocation des matières doit donc connaître l'origine de fusion de chaque lot de coulée.

## 4. Traçabilité et généalogie

### 4.1 Pourquoi la traçabilité est une tâche de planification

La traçabilité est souvent traitée comme un sujet purement qualité. En réalité, elle se crée dans le flux de commandes, là où le travail est planifié, réalisé et confirmé. Lorsqu'un planificateur déplace une commande vers une autre machine, fractionne un lot ou réachemine une opération sous-traitée, la généalogie de la pièce change. Si cette information manque par la suite, la pièce peut, dans le pire des cas, ne plus être expédiable car son dossier est incomplet.

Un article récent du journal professionnel allemand *Produktion* décrit les preuves et la qualité des données comme le véritable goulot d'étranglement pour les fournisseurs de taille moyenne de l'industrie de défense. Il cite une enquête de BearingPoint selon laquelle seulement 10 % des entreprises interrogées en Allemagne disposent d'une architecture de données entièrement intégrée, tandis que 38 % travaillent avec des systèmes fragmentés [37]. L'épisode du podcast m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) examine comment la traçabilité et la généalogie peuvent être mises en œuvre techniquement et organisationnellement dans la fabrication.

### 4.2 Termes : traçabilité, généalogie, as-designed et as-built

- **La traçabilité** est la capacité de suivre l'origine d'une pièce (en amont et en aval) : de quel matériau, de quel fournisseur, avec quel processus, quand et par qui ?
- **La généalogie** décrit les relations parent-enfant entre pièces, lots et assemblages. Elle répond à des questions telles que : quels assemblages contiennent du matériau du lot de coulée X ? Quels numéros de série sont concernés par un traitement thermique défectueux ?
- **As-designed** désigne la configuration spécifiée par l'ingénierie ; **as-built** désigne la configuration effectivement réalisée, y compris les écarts approuvés. **As-maintained** décrit l'état après maintenance en MRO.

### 4.3 Le modèle de données : ce qu'il faut saisir au minimum

| Objet | Attributs typiques | Pourquoi la planification en a besoin |
|---|---|---|
| Pièce / numéro de série | référence de pièce, révision, numéro de série, configuration | lien avec la commande client et la révision de conception |
| Lot / lot de fabrication | numéro de lot, quantité, divisions et regroupements | dimensionnement des lots, délimitation d'un rappel |
| Matière première | matériau, spécification, coulée, fournisseur, certificat matière, origine de la fusion (pour les métaux spéciaux DFARS [51]) | libération de la matière avant le début de la commande |
| Opération | machine, révision du programme CN, outil, paramètres de process, début/fin | confirmation, délai de fabrication, rapprochement des capacités |
| Personnel | employé, qualification, validité | affectation des seules personnes qualifiées |
| Procédé spécial | sous-traitant, accréditation, numéro de charge du four ou du bain, certificat | planification des étapes sous-traitées, confinement des écarts |
| Contrôle | plan de contrôle, moyen de mesure, résultat, contrôleur | libération, FAI, preuve pour les caractéristiques clés |
| Écart | dérogation, retouche, approbation d'écart | documentation as-built, aptitude à l'expédition |
| Document de libération | certificat de conformité (C of C) ; chez les organismes agréés, FAA Form 8130-3 ou EASA Form 1 [22][23][43] | libération à l'expédition ; les fournisseurs sans leur propre agrément de production expédient en général à titulaire de l'agrément avec un certificat de conformité |

Une note sur les documents de libération pour les lecteurs américains : le FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) atteste les approbations de navigabilité nationales, les approbations de remise en service et les approbations d'exportation. Il ne peut être délivré que par des personnes et des organismes autorisés par la FAA, et l'ordre FAA 8130.21H précise que les fournisseurs sans agrément de production ne peuvent en général pas le délivrer pour des pièces expédiées à leur titulaire d'agrément de production ; l'ordre indique aussi qu'il ne s'agit « pas d'un document de livraison ou d'expédition » [43]. Les installations agréées à la fois par la FAA et l'EASA peuvent émettre une double libération sur le 8130-3, qui rend une pièce éligible à l'installation sur des aéronefs américains et européens [43]. L'équivalent européen pour les libérations EASA simples est l'EASA Form 1 [22][23].

### 4.4 Pièces à durée de vie limitée

Certaines pièces, notamment les pièces tournantes de moteur comme les disques et les arbres, ont une durée de vie approuvée exprimée en cycles ou en heures (pièces à durée de vie limitée, LLP). Leur consommation doit être documentée sans lacune sur toute la vie de la pièce. Aux États-Unis, les propriétaires et exploitants doivent conserver les enregistrements de « l'état actuel des pièces à durée de vie limitée » pour chaque cellule, moteur, hélice, rotor et équipement, et ces enregistrements sont conservés et transférés avec l'aéronef lors de sa vente [53]. En Europe, la même tâche relève du maintien de la navigabilité selon les règles de l'EASA [23]. Si une partie de l'historique manque (traçabilité dite « back-to-birth »), une pièce techniquement parfaite peut devenir inutilisable. Pour les fabricants, cela signifie que le dossier de naissance de la pièce, c'est-à-dire la matière, la coulée, le lot de forgeage et les données de fabrication, doit être complet. Pour les ateliers de MRO, cela signifie que sans historique complet une pièce ne peut pas être réinstallée, et la planification doit alors trouver un remplacement.

### 4.5 Pièces contrefaites et non approuvées

L'AS9100 exige explicitement des mesures pour prévenir les pièces contrefaites [14]. La circulaire consultative AC 21-29D (2016) de la FAA décrit comment détecter et signaler les pièces non approuvées suspectées (SUP) ; elle définit une pièce non approuvée comme une pièce qui ne satisfait pas aux critères du 14 CFR 21.8 ou 21.9, ce qui inclut les pièces intentionnellement dénaturées et contrefaites [52]. Ses recommandations d'achat sont directement pertinentes pour les planificateurs : acheter auprès de sources dont la documentation remonte à une source approuvée par la FAA, et se méfier des signaux d'alerte tels qu'un prix nettement inférieur à celui des autres vendeurs, un délai de livraison anormalement court ou une documentation manquante [52]. Les pièces non approuvées suspectées sont signalées sur le FAA Form 8120-11 [52].

Pour la planification, cela signifie que les achats ne peuvent provenir que de sources approuvées, que les certificats doivent être vérifiés à la réception, et qu'un remplacement obtenu rapidement auprès d'une source inconnue n'est pas une option, même sous la pression des délais. Les pénuries d'approvisionnement augmentent le risque, car la pression de recourir à des sources grises s'accroît.

### 4.6 En pratique : intégrer la traçabilité dans le processus de planification

1. **Réserver et libérer la matière avant le démarrage de l'ordre.** Un ordre ne démarre que lorsque la matière spécifique (lot de coulée, certificat) est affectée et vérifiée.
2. **Modéliser les qualifications dans le modèle de capacité.** La planification n'affecte des opérations qu'aux personnes et aux machines disposant de qualifications valides.
3. **Saisir les divisions et les regroupements dans le système.** Chaque division de lot crée un nouveau numéro de lot lié à son origine.
4. **Planifier les opérations externes, y compris le retour des certificats.** Une pièce n'est considérée comme de retour que lorsque son certificat est revenu.
5. **Enregistrer les confirmations au poste de travail, et non en fin de poste.** Plus l'enregistrement est tardif, plus il manque d'informations.
6. **Tester régulièrement vos requêtes.** Réalisez un rappel simulé : combien de temps faut-il pour retrouver tous les numéros de série d'un lot de coulée ?

## 5. Niveaux de planification : du taux client à l'opération

### 5.1 Quatre niveaux, quatre horizons temporels

La planification de la production aéronautique peut être divisée en quatre niveaux. Chacun répond à une question différente et nécessite des données différentes.

| Niveau | Horizon | Question clé | Outils typiques |
|---|---|---|---|
| Planification stratégique des cadences et des capacités | 2 à 5 ans | Quelle cadence pouvons-nous livrer, avec quel investissement ? | calcul de scénarios, simulation d'usine, planification des investissements |
| Planification commerciale et opérationnelle (S&OP) et programme directeur de production | 6 à 24 mois | Comment traduire les cadences clients en un programme réalisable ? | ERP, planification grossière des capacités, APS |
| Planification des matières et des capacités | 1 à 6 mois | Quelles matières et quelles capacités nous faut-il, et quand ? | ERP/MRP, portails fournisseurs, APS |
| Ordonnancement détaillé et pilotage d'atelier | quelques heures à 4 semaines | Quel ordre passe quand, sur quelle machine, avec qui ? | APS, MES, tableau d'atelier |

Une cause fréquente de mauvais respect des délais n'est pas la faiblesse d'un seul niveau, mais une rupture entre les niveaux : le planning directeur s'engage sur la cadence 75, l'ordonnancement détaillé connaît les goulots qui rendent cela impossible, et personne ne concilie systématiquement les deux.

### 5.2 ERP, APS et MES : qui fait quoi

Dans la plupart des entreprises, le [progiciel de gestion intégré (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) est le système de référence pour les commandes, les nomenclatures, les gammes, les stocks et les achats. Sa planification des besoins en composants (MRP), dans sa forme de base, calcule avec des délais de fabrication planifiés fixes et sans limite de capacité. Cela suffit pour déterminer les besoins en matières, mais pas pour établir un planning de production réalisable.

Un système de [planification et d'ordonnancement avancés (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), à l'inverse, ordonnance en capacité finie : machines, personnes disposant des qualifications requises, outillages, équipes et disponibilité des matières sont pris en compte simultanément. La méthode sous-jacente s'appelle [ordonnancement sous contraintes](https://www.m365.fm/entity/constraint-based-scheduling/). Enfin, un système d'exécution de fabrication (MES) pilote et documente l'exécution en atelier et fournit les confirmations sans lesquelles ni la planification ni la traçabilité ne fonctionnent.

Le guide frère [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/) détaille les différences entre ERP, APS et MES, les limites de la logique MRP et la manière de sélectionner un logiciel de planification.

### 5.3 Ce qu'un modèle de planification aéronautique doit en plus prendre en compte

Par rapport à la fabrication générique, un modèle de planification dans l'aéronautique nécessite quelques contraintes supplémentaires :

- **Matrice de qualification** du personnel (procédés spéciaux, habilitations de contrôle, habilitations de libération)
- **Qualification des machines** par référence de pièce (toutes les machines ne sont pas approuvées pour toutes les pièces)
- **Opérations externes** avec des délais réalistes et des engagements de capacité de la part des sous-traitants
- **Étapes de contrôle et de libération** comme opérations ordonnançables disposant de leur propre capacité (laboratoire de contrôle, inspecteurs, FAI)
- **Données de configuration et d'effectivité** (quelle révision s'applique à partir de quel numéro de série ou de quel avion)
- **Affectation de la matière au niveau du lot de coulée** plutôt que la seule disponibilité en quantité (y compris l'origine de fusion lorsque les règles DFARS relatives aux métaux spéciaux s'appliquent [51])
- **Contraintes de lots** pour les fours, autoclaves et bacs de traitement (charge minimale, compatibilité des pièces et des matières)
- **Restrictions d'accès aux données** pour les commandes soumises à l'ITAR ou au CUI (qui peut voir et ordonnancer quels travaux) [36][49]

## 6. Comprendre et réduire le délai de traversée

### 6.1 La loi de Little : le lien entre stock et temps

En 1961, John D. C. Little a démontré une relation valable pour tout système de production stable : le stock moyen dans le système est égal au débit multiplié par le temps moyen passé dans le système [27]. Réarrangée :

**Délai de traversée = en-cours (WIP) ÷ débit**

**Exemple chiffré :** Un atelier de composants moteur expédie en moyenne 40 pièces par semaine. Il y a 320 pièces dans le système (en cours de traitement, en attente, chez le sous-traitant spécialisé, en contrôle). Le délai de traversée moyen est donc de 320 ÷ 40 = 8 semaines. Si le WIP peut être ramené à 200 pièces au même débit, le délai tombe à 5 semaines. Le débit ne change pas tant que le goulot reste alimenté en permanence.

La loi explique pourquoi lancer davantage d'ordres sur l'atelier ne raccourcit pas le délai de livraison mais l'allonge : le WIP augmente, le débit reste le même, le délai de traversée s'allonge.

### 6.2 Où passe le temps

Dans de nombreuses usines, le temps d'usinage réel ne représente qu'une faible part du délai de traversée ; la plus grande part correspond au temps d'attente. Il s'agit d'une règle empirique largement partagée, et non d'un ratio généralement documenté [unverified: règle empirique non sourcée, à mesurer]. La part varie fortement d'une entreprise à l'autre et doit être mesurée dans votre propre usine, par exemple avec la [cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/). Dans l'aéronautique, les causes typiques sont :

- **Attente des procédés spéciaux externalisés** (transport aller et retour, file d'attente chez le sous-traitant, retour des certificats)
- **Attente du contrôle et de la libération** (laboratoire de contrôle, FAI, inspection client sur site, dérogations)
- **Attente de matière ou de documents** (certificats manquants, modifications d'ingénierie ouvertes)
- **Constitution de lots** (des pièces attendent qu'un four ou un lot soit complet)
- **Goulots surchargés** (un taux d'utilisation élevé crée des files d'attente disproportionnellement longues)
- **Perturbation par les commandes urgentes** (l'expédition accélérée repousse les commandes régulières)

### 6.3 Leviers pour des délais plus courts

1. **Limiter le WIP.** Ne lancer que le nombre d'ordres que le goulot peut traiter. La théorie des contraintes appelle cela la « corde » (section 11).
2. **Regrouper et planifier les étapes externes.** Des jours fixes d'enlèvement et de livraison avec le sous-traitant réduisent la variabilité.
3. **Planifier la capacité de contrôle.** Le laboratoire de contrôle et les contrôleurs constituent une capacité au même titre que les machines et doivent figurer dans le plan de capacité.
4. **Compléter les documents avant le lancement.** Pas d'ordre sans documents complets : matière accompagnée de son certificat et indice de plan valide.
5. **Ne pas charger les goulots au-delà de 85 à 90 % pendant de longues périodes** lorsque la variabilité est élevée. Cette règle empirique découle de la théorie des files d'attente (section 11.1) ; la valeur exacte dépend de la variabilité de votre usine. Une petite réserve de capacité coûte souvent moins cher que de longues files d'attente.

## 7. Planification des processus spéciaux et des opérations externalisées

### 7.1 Pourquoi les processus spéciaux deviennent souvent le goulot d'étranglement

Les processus spéciaux sont des procédés dont le résultat ne peut pas être entièrement vérifié sur la pièce finie sans la détruire, par exemple le traitement thermique, le traitement de surface, le soudage ou certains revêtements. Leur qualité doit donc être garantie par des procédés, des équipements et du personnel qualifiés. Dans l'aéronautique, de nombreux clients exigent pour ces procédés une accréditation Nadcap [21][54].

Cela a trois conséquences pour la planification. Premièrement, le nombre de sources approuvées est limité ; tout changement nécessite une qualification et souvent une nouvelle inspection du premier article. Deuxièmement, nombre de ces procédés fonctionnent par lots (fours, cuves, autoclaves), ce qui crée des effets de regroupement et des temps d'attente. Troisièmement, les fournisseurs signalent que les délais de contrôle et de traitement de surface, en particulier, sont longs [10].

### 7.2 Règles de planification pour les processus spéciaux

- **Modéliser le processus spécial comme une ressource,** et non comme un délai global fixe. Un traiteur thermique externe disposant de deux cycles de four par semaine représente une capacité avec une cadence, et non « délai de 10 jours ».
- **Convenir par contrat des engagements de capacité** (créneaux par semaine) et les enregistrer dans la planification comme contrainte ferme.
- **Planifier le regroupement en lots de façon délibérée.** Quelles pièces peuvent être traitées ensemble ? Quelle charge minimale a du sens ? Combien de temps une pièce peut-elle attendre un lot au maximum ?
- **Faire de la confirmation, certificat compris,** une condition préalable à l'opération suivante.
- **Qualifier des seconds fournisseurs** avant que le goulot d'étranglement ne devienne critique. La qualification prend souvent des mois.

### 7.3 Processus spéciaux en interne : fabriquer ou acheter, du point de vue de la capacité

De nombreux fournisseurs envisagent d'internaliser les processus spéciaux afin de réduire leur dépendance. Cela peut être pertinent, mais c'est un projet dont le délai est lui-même long : équipements, qualification, accréditation, personnel et approbations client. Une simulation du taux d'utilisation futur (section 11.4) permet de déterminer si l'investissement est rentable, ou si les équipements internes ne créeront qu'un nouveau goulot d'étranglement à faible taux d'utilisation.

## 8. Modifications techniques et gestion de configuration

### 8.1 Les modifications sont courantes dans l'aéronautique

Au cours de la longue durée de vie d'un programme aéronautique, les plans, matériaux, procédés et fournisseurs changent sans cesse. Chaque modification doit être évaluée, approuvée et dotée d'une effectivité : à partir de quel numéro de série, de quel avion ou de quelle date la nouvelle révision s'applique-t-elle ? Pour la planification, c'est une source permanente de perturbations.

### 8.2 Ce qu'une modification implique pour la planification

| Impact | Conséquence pour la planification |
|---|---|
| Nouvelle révision de conception | examiner les commandes ouvertes : les écouler, les reprendre, les mettre au rebut ou les livrer avec une dérogation |
| Opérations nouvelles ou modifiées | mettre à jour la gamme, les temps standards, les programmes CN et les plans de contrôle |
| Inspection du premier article (complète ou partielle) | planifier la FAI comme opération à part entière avec la capacité de contrôle ; approbation avant les livraisons de production [18][34] |
| Changement de matériau ou de fournisseur | qualification, éventuellement une nouvelle FAI, nouveaux certificats et délais d'approvisionnement |
| Nouvel outillage ou nouveaux gabarits | délai d'approvisionnement, réception, éventuellement FAI pour l'outillage modifié |

Selon AS9102, une modification de conception affectant la forme, l'ajustement ou la fonction, un changement de source, de procédé, de site ou d'outillage de fabrication, ainsi qu'une interruption de production de plus de deux ans, entre autres, déclenchent une inspection complète ou partielle du premier article [34]. La révision C de l'AS9102, publiée en 2023, insiste davantage sur la planification, l'évaluation et la répétition des inspections du premier article [18][46]. En Europe, l'édition correspondante a été publiée sous la forme EN 9102:2024 (en Allemagne DIN EN 9102:2025-01) [17].

### 8.3 Règles pratiques pour gérer les modifications

1. **Regrouper les modifications lorsque le client l'autorise.** De nombreuses petites modifications isolées coûtent plus cher que quelques modifications regroupées.
2. **Définir l'effectivité tôt et la transmettre à la planification.** Une commande doit savoir dès son lancement quelle révision elle fabrique.
3. **Gérer activement le stock des anciennes révisions.** Lancer de gros lots de l'ancienne révision lorsqu'un changement est prévisible produit des rebuts.
4. **Réserver une capacité FAI.** Les ressources de contrôle pour les premiers articles sont vite saturées lors des montées en cadence et des vagues de modifications.
5. **Rendre le statut des modifications visible sur le tableau de planification.** Les commandes présentant des modifications ouvertes sont des commandes à risque.

## 9. Courbes d'apprentissage de Wright : théorie et exemple chiffré

### 9.1 La découverte de 1936

En 1936, Theodore Paul Wright publie l'article « Factors Affecting the Cost of Airplanes » dans le *Journal of the Aeronautical Sciences* (vol. 3, n° 4, p. 122–128) [24]. Il constate que les heures de main-d'œuvre nécessaires par avion diminuent d'environ 20 % à chaque doublement de la production cumulée [25]. Ce schéma est aujourd'hui connu sous le nom de loi de Wright ou courbe d'apprentissage. Une réduction de 20 % par doublement est appelée courbe d'apprentissage à 80 % ; le nom indique la part restante [25].

Les courbes d'apprentissage restent un outil standard pour l'estimation des coûts et la planification des capacités dans l'aérospatiale. Le Government Accountability Office (GAO) américain les décrit dans son Cost Estimating and Assessment Guide [26].

### 9.2 Deux variantes : moyenne cumulée et modèle unitaire

Il existe deux formulations courantes [26] :

- **Modèle de la moyenne cumulée (Wright) :** la *moyenne* des heures sur l'ensemble des unités produites diminue d'un pourcentage fixe à chaque doublement.
- **Modèle unitaire (modèle de Crawford) :** les heures pour l'unité *individuelle* diminuent d'un pourcentage fixe à chaque doublement.

Les deux utilisent la même formule mais des grandeurs de référence différentes [26][40]. Décidez quelle variante vous utilisez et tenez-vous-y. Si vous transférez un taux d'apprentissage du modèle de la moyenne cumulée vers le modèle unitaire, vous comparez des valeurs réelles et cibles qui ne correspondent pas.

La formule est : **Y = A · X^b**, où A = heures pour la première unité, X = unités cumulées et b = log(taux d'apprentissage) ÷ log(2) [26].

### 9.3 Exemple chiffré : lancement d'un nouvel assemblage

Un fournisseur reprend l'assemblage d'un nouveau sous-ensemble. La première unité nécessite 1 000 heures d'assemblage. Sur la base de programmes comparables, une courbe d'apprentissage à 85 % est supposée (modèle de la moyenne cumulée).

**Étape 1 : calcul de l'exposant.** b = log(0,85) ÷ log(2) = −0,2345.

**Étape 2 : heures moyennes et heures unitaires.** Les heures de l'unité N découlent de la différence des totaux cumulés : T(N) = N · moy(N) − (N−1) · moy(N−1).

| Unités cumulées N | Heures moyennes par unité | Heures cumulées | Heures pour l'unité N |
|---|---|---|---|
| 1 | 1 000,0 | 1 000 | 1 000,0 |
| 2 | 850,0 | 1 700 | 700,0 |
| 4 | 722,5 | 2 890 | 571,3 |
| 8 | 614,1 | 4 913 | 477,4 |
| 16 | 522,0 | 8 352 | 402,6 |
| 32 | 443,7 | 14 199 | 340,9 |
| 50 | 399,6 | 19 981 | 306,6 |
| 100 | 339,7 | 33 968 | 260,3 |

**Étape 3 : conséquences pour la planification des capacités.** Si le fournisseur planifiait les dix premières unités avec les heures de la centième unité (260 heures), il arriverait à 2 603 heures. Selon la courbe d'apprentissage, les dix premières unités nécessitent en réalité 5 828 heures, soit plus du double. Un lancement planifié avec les heures standard de régime établi est donc systématiquement sous-planifié.

**Étape 4 : contrôle de la sensibilité.** Dans quelle mesure le résultat dépend-il du taux d'apprentissage retenu ? Avec une courbe à 90 % au lieu de 85 %, le besoin pour les 100 premières unités passe de 33 968 à 49 659 heures, soit une hausse de 46 %. Le choix du taux d'apprentissage est donc l'une des hypothèses les plus déterminantes de l'ensemble du plan de lancement.

### 9.4 Règles pratiques pour les courbes d'apprentissage

- **Déduisez les taux d'apprentissage de vos propres données,** ne les copiez pas de la littérature. Enregistrez les heures réelles par unité dès le départ.
- **Distinguez les courbes d'apprentissage selon le contenu du travail.** L'assemblage manuel apprend davantage que l'usinage, où le temps machine baisse à peine.
- **Tenez compte des interruptions.** Après des pauses prolongées, des changements de personnel ou des déménagements, une partie de l'effet d'apprentissage est perdue.
- **Suivez le réel par rapport à la cible.** Si les heures réelles restent au-dessus de la courbe, c'est soit l'hypothèse, soit le processus qui est erroné. La planification doit savoir lequel.
- **Les modifications techniques réinitialisent en partie la courbe.** Une modification majeure peut déclencher un nouveau processus d'apprentissage.

## 10. Planification d'une montée en cadence : calcul et liste de contrôle

### 10.1 Pourquoi les montées en cadence échouent au goulot

Une hausse de cadence est souvent évaluée sur la base de la capacité totale : « Nous sommes à 75 % d'utilisation en moyenne, nous pouvons donc absorber 20 % de plus. » Ce raisonnement est rarement vrai, car le débit est déterminé par le goulot d'étranglement, et non par la moyenne. La [théorie des contraintes](https://www.m365.fm/entity/theory-of-constraints/) d'Eliyahu M. Goldratt a popularisé ce principe dans les années 1980 [28].

### 10.2 Exemple détaillé : passage de 60 à 72 cadences

Un fournisseur livre un jeu de pièces de raccordement par avion. La cadence client doit passer de 60 à 72 avions par mois (soit +20 %). Les trois ressources les plus importantes se présentent ainsi :

| Ressource | Heures disponibles/mois | Charge à la cadence 60 | Taux d'utilisation cadence 60 | Charge à la cadence 72 | Taux d'utilisation cadence 72 |
|---|---|---|---|---|---|
| Usinage 5 axes | 1 400 | 1 190 | 85 % | 1 428 | 102 % |
| Ébavurage et assemblage | 2 000 | 1 300 | 65 % | 1 560 | 78 % |
| Laboratoire de contrôle (MMT) | 600 | 420 | 70 % | 504 | 84 % |
| Total (pondéré par les heures) | 4 000 | 2 910 | 73 % | 3 492 | 87 % |

Une utilisation globale de 87 % semble réalisable. Mais l'usinage 5 axes, à 102 %, dépasse sa capacité, et ce sans tenir compte des perturbations, des préparations pour les variantes supplémentaires ni des premiers contrôles d'article après modification. À cela s'ajoute l'effet décrit à la section 6 : plus le taux d'utilisation s'approche de 100 %, plus les files d'attente s'allongent. Sans action, les délais de fabrication et les retards de livraison augmentent, alors même que la capacité totale est mathématiquement suffisante.

**Actions possibles, classées par délai de mise en œuvre :**

1. **Immédiatement :** protéger le goulot (pas de temps d'arrêt pendant les pauses, préparer les changements de série hors temps machine, séparer le contrôle de la machine).
2. **Quelques semaines :** équipes supplémentaires le week-end, transfert des pièces de moindre complexité vers d'autres machines qualifiées.
3. **Quelques mois :** optimisation des programmes (temps de cycle), montages permettant plusieurs prises de pièce, sous-traitance de certaines pièces à des partenaires qualifiés (avec FAI).
4. **Trimestres à années :** une machine supplémentaire, délai de livraison, installation, qualification et approbation client compris.

Le dernier point montre pourquoi les montées en cadence dans l'aéronautique exigent des délais si longs : entre la décision d'acquérir une nouvelle machine et sa première livraison de production approuvée, il s'écoule souvent plusieurs mois.

### 10.3 Liste de contrôle : votre site est-il prêt pour la cadence suivante ?

**Demande et scénarios**

- [ ] La cadence client, les lancements et la demande en pièces de rechange par référence sont disponibles pour au moins 18 mois.
- [ ] Au moins trois scénarios de cadence ont été calculés (prudent, plan, ambitieux).
- [ ] Les déclencheurs d'investissement et d'embauche sont définis à l'avance.

**Capacité**

- [ ] Le goulot est identifié pour chaque scénario, et non seulement le taux d'utilisation moyen.
- [ ] Le taux d'utilisation du goulot dans le scénario plan reste inférieur à 85 à 90 %.
- [ ] Les courbes d'apprentissage des nouvelles pièces sont planifiées (section 9).
- [ ] La capacité de contrôle et de mesure est planifiée pour la production, les FAI et les modifications.

**Personnel**

- [ ] La matrice de qualification indique combien de personnes sont disponibles pour chaque procédé spécial et chaque contrôle.
- [ ] Les délais d'intégration et de qualification des nouveaux collaborateurs sont inclus dans le plan.
- [ ] Les points uniques de défaillance (qualifications détenues par une seule personne) sont identifiés.

**Matières et fournisseurs**

- [ ] Les contrats de matières premières couvrent la cadence plus élevée, délais d'approvisionnement compris.
- [ ] Les procédés spéciaux sous-traités ont confirmé leur capacité pour la nouvelle cadence.
- [ ] Des seconds fournisseurs pour les matières et procédés critiques sont qualifiés ou en cours de qualification.
- [ ] Pour les travaux de défense : les sources de matières respectent les règles DFARS relatives aux métaux de spécialité [51].

**Qualité et approbations**

- [ ] Les nouvelles machines, les montages et les sources sont planifiés avec les délais de FAI et d'approbation client.
- [ ] La preuve de disponibilité de la production à la cadence client (AS9145) est préparée [35].
- [ ] La traçabilité fonctionne à des volumes plus élevés sans retouches manuelles.

**Pilotage**

- [ ] Les KPI (OTD, délai de fabrication, en-cours, taux d'utilisation du goulot) sont suivis chaque semaine.
- [ ] Un circuit d'escalade pour les perturbations du goulot est défini.
- [ ] Le plan est régulièrement rapproché des confirmations réelles.

## 11. Planification de la capacité avec APS, gestion des goulots d'étranglement et simulation

### 11.1 Pourquoi un taux d'utilisation élevé coûte du temps

La théorie des files d'attente fournit une règle empirique simple : le temps d'attente moyen sur une ressource croît selon le facteur u ÷ (1 − u), où u est le taux d'utilisation. Cette approximation remonte à J. F. C. Kingman (1961) ; sous sa forme complète, elle intègre également la variabilité des arrivées et des temps de traitement [38]. À 80 % d'utilisation, le facteur vaut 4, à 90 % il atteint déjà 9 et à 95 % il vaut 19. Toutes choses égales par ailleurs, le temps d'attente sur une ressource utilisée à 95 % est donc presque cinq fois plus long que sur une ressource utilisée à 80 %.

Cela est particulièrement pertinent pour l'aéronautique, en raison de sa forte variabilité (modifications, reprises, opérations externalisées, commandes urgentes). Si vous planifiez un goulot d'étranglement à 98 % d'utilisation, vous planifiez aussi des délais de fabrication longs.

### 11.2 Gestion des goulots d'étranglement avec la théorie des contraintes

La théorie des contraintes (Theory of Constraints, TOC) décrit cinq étapes de concentration : identifier la contrainte, l'exploiter, subordonner tout le reste à celle-ci, l'élever, puis recommencer, car la contrainte se déplace [28]. Pour le pilotage de l'atelier, le principe tambour-tampon-corde (drum-buffer-rope, DBR) s'est imposé :

- **Tambour :** le goulot d'étranglement donne le rythme. Son planning est le planning directeur de l'atelier.
- **Tampon :** un tampon temporel est placé en amont du goulot afin que les perturbations en amont ne le privent pas de travail.
- **Corde :** la mise en production de la matière au début du processus est liée au goulot d'étranglement. Seule la quantité que le goulot peut traiter dans un horizon prévisible est lancée. Cela limite les en-cours.

Dans l'aéronautique, le goulot d'étranglement se trouve souvent non pas dans votre propre bâtiment, mais au niveau du procédé spécial externalisé ou du laboratoire de contrôle. Le DBR fonctionne tout de même : traitez l'étape externalisée comme le tambour et liez votre propre lancement à ses créneaux.

### 11.3 APS dans l'aéronautique : ce qu'il doit faire

Un système APS destiné à un fournisseur aéronautique doit au minimum être capable de ce qui suit :

| Capacité | Pourquoi c'est important dans l'aéronautique |
|---|---|
| Ordonnancement à capacité finie | Les goulots d'étranglement sont la règle, non l'exception |
| Qualifications des personnes et des machines | Seules les ressources qualifiées peuvent être planifiées |
| Opérations externes avec créneaux | Les procédés spéciaux sont souvent le vrai goulot d'étranglement |
| Constitution de lots | Fours, cuves et autoclaves travaillent par lots |
| Étapes de contrôle et de libération | Les FAI et les contrôles mobilisent de la capacité |
| Replanification rapide | Modifications, reprises et commandes urgentes sont fréquentes |
| Scénarios (hypothèses) | Évaluer des scénarios de cadence, des investissements, des défaillances fournisseurs |
| Retour d'information de l'atelier | Sans données réelles, chaque plan devient obsolète |
| Intégration avec ERP et MES | Les données de référence et les commandes proviennent de l'ERP, les données réelles du MES |
| Contrôle d'accès aux données contrôlées | Les commandes ITAR et CUI ne doivent être visibles que par les utilisateurs autorisés [36][49] |

Le guide frère [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/) contient une liste de contrôle de sélection et une feuille de route de mise en œuvre pour les systèmes APS.

### 11.4 Simulation : tester les décisions de capacité avant de les prendre

Une [simulation d'usine](https://www.m365.fm/entity/factory-simulation/) représente dans un modèle les ressources, les commandes, la variabilité et les règles, et déroule des semaines ou des mois en quelques minutes. Elle répond à des questions qu'un calcul de capacité statique ne peut pas traiter :

- Comment évolueront le délai de fabrication et le respect des délais à la cadence 67 et à la cadence 75 ?
- Que apporte une machine supplémentaire, et où apparaît le goulot d'étranglement suivant ?
- Que se passe-t-il si le traitement thermique externe est indisponible pendant deux semaines ?
- Quelle règle de lancement maintient les en-cours au plus bas pour le même respect des délais ?
- Un procédé spécial interne est-il rentable, ou l'équipement restera-t-il sous-utilisé ?

La simulation ne remplace pas l'ordonnancement détaillé ; elle prépare les décisions stratégiques et tactiques. Elle est particulièrement précieuse avant des investissements à long délai d'approvisionnement, situation que vivent actuellement de nombreux fournisseurs avec les plans de cadence en cours. Sur m365.fm, vous trouverez également la page d'entité [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) consacrée à la planification et à la simulation.

## 12. Risques de la chaîne d'approvisionnement de 2022 à 2026 et leurs conséquences pour la planification

### 12.1 Ce qui s'est passé ces dernières années

**Moteurs.** En 2023, Pratt & Whitney a signalé un défaut dans la poudre métallurgique de certaines pièces du moteur à turbosoufflante à réducteur (GTF), pouvant entraîner des fissures. En septembre 2023, la société mère RTX a annoncé que 600 à 700 moteurs supplémentaires devraient être retirés pour des visites en atelier jusqu'en 2026, et prévoyait qu'en moyenne 350 avions de la famille A320 seraient immobilisés par an. RTX a enregistré une charge avant impôts de 3 milliards de dollars ; le coût total était estimé à 7 milliards de dollars au maximum, dont une partie revient à des partenaires tels que MTU [11]. En 2026, Airbus a reproché à Pratt & Whitney de donner la priorité à la maintenance sur le terrain au détriment de la livraison de nouveaux moteurs et de ne pas livrer les quantités commandées [4]. À la mi-2026, Airbus a déclaré qu'il n'avait plus d'avions finis en attente uniquement de moteurs, mais qu'il n'avait pas non plus de réserve [39].

**Titane.** Après l'attaque de la Russie contre l'Ukraine, Boeing a suspendu en mars 2022 ses achats auprès du producteur russe de titane VSMPO-Avisma. Airbus, qui indiquait alors s'approvisionner à hauteur d'environ la moitié de son titane en Russie, a d'abord poursuivi ses achats [12]. Le titane reste l'un des risques de matières premières les plus souvent cités en 2026 [10]. Pour les fournisseurs des programmes de défense américains, la clause DFARS relative aux métaux spéciaux ajoute une restriction d'origine à la contrainte de disponibilité [51].

**Pièces moulées et forgées.** Roland Berger signale des écarts persistants en 2026 pour les pièces moulées et forgées destinées aux composants de moteur et de systèmes (comme le train d'atterrissage) ainsi que pour les éléments de fixation des structures. Pour les aubes de turbine, l'aéronautique est en concurrence avec les turbines à gaz industrielles, dont la demande progresse elle aussi en raison des besoins électriques des centres de données [10].

**Main-d'œuvre qualifiée.** La pénurie de personnel qualifié reste le frein le plus courant à la montée en cadence (56 % des répondants) [10]. La situation est similaire dans la maintenance (section 13).

**Évolution structurelle chez les fournisseurs.** Airbus reprend d'anciens lots de travaux de Spirit AeroSystems. Cette intégration a réduit les résultats d'Airbus pour les neuf premiers mois de 2026 de 235 millions d'euros [3]. Des évolutions de ce type modifient les relations d'approvisionnement à tous les niveaux en aval.

### 12.2 Réponses de planification

| Risque | Réponse de planification |
|---|---|
| Délais d'approvisionnement des matières longs et variables | accords à long terme avec engagements de capacité, stock de sécurité ciblé sur les matières critiques, mise à jour régulière des délais de réapprovisionnement |
| Sources uniques pour les procédés spéciaux | qualifier des sources secondaires, sécuriser contractuellement les créneaux, modéliser le goulot d'étranglement dans le plan |
| Appels de livraison client fluctuants | suivre séparément la cadence et les appels client, signaler les écarts au plus tôt |
| Pénurie de main-d'œuvre | matrice de qualification, polyvalence, intégration des nouveaux arrivants dans le plan de capacité |
| Défaillance d'un fournisseur | simuler des scénarios, surveiller les indicateurs d'alerte précoce (retards de livraison, qualité, santé financière) |
| Accumulation de stocks contre les perturbations | détenir des stocks de façon délibérée et en quantités limitées là où ils protègent le goulot d'étranglement ; chaque unité de stock allonge le délai selon la loi de Little |

Une remarque importante sur ce dernier point : le stock n'est pas une protection gratuite. Selon Roland Berger, 40 % des fournisseurs ont constitué des stocks plus élevés en prévision du démarrage de la production, ce qui pèse sur des marges déjà faibles [10]. Des tampons ciblés en amont du goulot d'étranglement sont plus efficaces qu'un stock de sécurité généralisé sur l'ensemble des pièces.

## 13. Planification MRO : maintenance avec constats non planifiés

### 13.1 Le marché MRO en 2026

La maintenance, la réparation et la révision (MRO) constituent un marché important et en croissance. Dans ses prévisions publiées avec l'US Aeronautical Repair Station Association (ARSA), Oliver Wyman évalue le marché mondial MRO de l'aviation commerciale à 139,6 milliards de dollars pour 2026 et prévoit qu'il atteindra 193,1 milliards de dollars en 2036. La maintenance des moteurs est le segment le plus important, avec 70,1 milliards de dollars. La flotte devrait passer d'environ 30 000 avions commerciaux au début de 2026 à environ 41 100 en 2036 [30]. Dans une analyse distincte de septembre 2026, Oliver Wyman souligne les pénuries de matières, les longs délais de livraison des pièces moulées et forgées, et le nombre réduit de fournisseurs pour les pièces critiques des moteurs ; près de 30 % des personnes interrogées pensent que la chaîne d'approvisionnement ne se rétablira complètement que dans plus de trois ans [29].

Les retards de livraison des avions neufs accentuent la pression : les compagnies aériennes exploitent plus longtemps des appareils plus anciens, qui nécessitent davantage de maintenance. L'étude de l'IATA estime le surcoût de maintenance en 2025 à elle seule à 3,1 milliards de dollars [9]. Parallèlement, la production neuve et la maintenance se disputent les mêmes pièces et les mêmes capacités, comme le montre le différend entre Airbus et Pratt & Whitney [4].

### 13.2 Cadre réglementaire

Aux États-Unis, un atelier de maintenance travaille généralement sous un certificat de station de réparation délivré en vertu de la partie 145 du 14 CFR. Une station de réparation ne peut intervenir que sur les articles pour lesquels elle est qualifiée et dans le cadre de ses spécifications d'exploitation, et elle « ne peut ni entretenir ni modifier tout article pour lequel elle n'est pas qualifiée » [42]. Elle doit tenir à jour les données de maintenance en vigueur, telles que les directives de navigabilité, les manuels de maintenance, les manuels de révision et les bulletins de service, « à jour et accessibles lorsque le travail concerné est effectué », exploiter un programme de formation approuvé par la FAA, et conserver les enregistrements des travaux pendant au moins deux ans à compter de l'approbation pour la remise en service [42]. Les dossiers de travail proviennent généralement de l'exploitant de l'aéronef, qui est également responsable des enregistrements tels que l'état actuel des pièces à durée de vie limitée en vertu du 14 CFR 91.417 [53]. De nombreuses stations de réparation sont également certifiées AS9110 [20].

En Europe, une organisation de maintenance travaille avec un agrément au titre de la partie 145 de l'EASA. Les dossiers de travail proviennent souvent d'une organisation de gestion du maintien de navigabilité (Part-CAMO), qui gère le programme de maintenance, les directives de navigabilité et les pièces à durée de vie limitée [23]. Les stations de réparation américaines détenant également un agrément EASA peuvent délivrer des certificats de remise en service doubles sur le formulaire FAA 8130-3 [43].

Pour la planification, les deux systèmes signifient la même chose : les travaux ne sont autorisés que dans le périmètre approuvé, par du personnel habilité et selon des données de maintenance valides, telles que le manuel de maintenance de l'aéronef (AMM) ou le manuel de maintenance des composants (CMM) dans leur révision en vigueur. Un technicien sans l'habilitation ou la formation requise ne constitue pas non plus une capacité disponible.

### 13.3 Ce qui rend la planification MRO fondamentalement différente

Dans la production neuve, le contenu du travail est connu avant le début de la commande. En maintenance, il n'est connu qu'après l'ouverture et l'inspection de l'aéronef, du moteur ou du composant. La planification doit donc gérer trois types de travaux :

- **Travaux de routine :** tâches programmées issues du programme de maintenance ou du manuel d'atelier, faciles à planifier
- **Travaux non routiniers (constats) :** corrosion, fissures, usure ou dommages découverts lors de l'inspection ; le périmètre et le calendrier sont incertains
- **Travaux additionnels :** modifications, directives de navigabilité ou demandes du client ajoutées au dossier de travail

Le KPI central est le délai de rotation (TAT), soit le temps écoulé entre l'entrée en atelier et le retour au client. Chaque jour passé en atelier par un aéronef ou un moteur coûte de l'argent à l'exploitant. Le TAT est souvent déterminé moins par les heures de main-d'œuvre que par l'attente des pièces, les décisions sur les constats, les approbations et les spécialistes.

### 13.4 Exemple détaillé : planifier les constats au lieu d'espérer

Un atelier MRO de composants planifie la révision d'un type de composant. Le travail de routine représente 80 heures. D'après l'historique propre de l'atelier sur les 50 dernières commandes, on relève trois constats typiques (toutes les valeurs sont des hypothèses pour l'exemple) :

| Constat | Fréquence | Heures supplémentaires | Pièces requises |
|---|---|---|---|
| Corrosion, réparable | 40 % | 12 h | non |
| Fissure, remplacement de pièce | 10 % | 20 h | oui, délai 15 jours ouvrés, pas en stock |
| Usure, pièce de remplacement | 30 % | 6 h | oui, en stock |

**Heures supplémentaires attendues :** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 heures. En moyenne, environ 89 heures par commande peuvent être planifiées. Pour la planification de capacité sur un grand nombre de commandes, cette valeur attendue est utile.

**Pour l'engagement de TAT, cela ne suffit pas.** Pour 10 % des commandes, 15 jours ouvrés d'attente de la pièce de rechange s'ajoutent. Si vous vous engagez sur un TAT moyen (mathématiquement une marge de 1,5 jour), vous le manquerez largement sur chaque dixième commande. Les options suivantes sont préférables :

1. **Stocker la pièce :** une ou deux pièces en stock réduisent fortement le risque sur le TAT. Comparez le coût du stock avec le coût du retard.
2. **Inspecter plus tôt :** plus la constatation est connue tôt, plus la commande peut être passée tôt. Planifiez l'inspection en première étape, avec priorité.
3. **Engager le TAT par percentile :** par exemple un TAT tenu dans 80 ou 90 % des cas, avec une règle transparente pour les constatations impliquant des délais d'approvisionnement de pièces longs.
4. **Pool d'échange :** pour les constatations fréquentes, un pool d'échange de pièces réparables (rotables) peut découpler le TAT du cycle de réparation.

### 13.5 Règles pratiques pour la planification MRO

- **Enregistrer systématiquement l'historique des constatations.** Sans données sur la fréquence et l'effort des constatations, chaque plan reste une estimation.
- **Réserver de la capacité pour les travaux non routiniers.** Si vous chargez le hangar ou l'atelier à 100 % de travaux de routine, il n'y a pas de place pour les constatations.
- **Vérifier la disponibilité des pièces avant d'accepter la commande.** Les pièces critiques à long délai d'approvisionnement constituent le principal risque sur le TAT.
- **Vérifier la durée de vie et l'historique des pièces.** Les pièces sans traçabilité complète ne peuvent pas être réinstallées (section 4.4).
- **Planifier de façon visible les spécialistes goulots d'étranglement.** Les inspecteurs CND, le personnel habilité à approuver le retour en service et les ateliers spécialisés sont souvent le goulot d'étranglement.
- **Informer les clients tôt des constatations.** Les décisions d'approbation client sont souvent l'attente la plus longue du processus.

## 14. Jumeau numérique et fil numérique

### 14.1 Définitions

Un [jumeau numérique](https://www.m365.fm/entity/digital-twin/) de la production est un modèle de l'usine réelle, alimenté par des données actuelles et utilisé pour l'analyse, la planification et la simulation. Il couvre les ressources, les commandes, les gammes, les stocks et les règles. Le fil numérique (digital thread) est le lien continu des données d'un produit sur l'ensemble de son cycle de vie : de la conception à la fabrication et au contrôle, puis à l'exploitation et à la maintenance. Dans l'aéronautique, le fil numérique est étroitement lié à la traçabilité et à la gestion de configuration, car il relie l'as-designed, l'as-built et l'as-maintained.

### 14.2 Avantages pour la planification et la qualité

- **Planification :** le jumeau de l'usine permet des scénarios et une optimisation fondés sur l'état actuel (voir section 11.4).
- **Traçabilité :** le fil numérique répond aux questions sur les lots, les procédés et les configurations en quelques minutes au lieu de plusieurs jours.
- **Modifications :** l'impact d'une modification de conception sur les commandes ouvertes, les stocks et les gammes devient visible.
- **MRO :** relier l'historique de fabrication et les constatations de maintenance permet de tirer des conclusions sur les faiblesses des procédés et de la conception.

### 14.3 Prérequis

Un jumeau numérique ne vaut que par ses données. Avant d'investir dans des modèles, vérifiez les gammes, les temps standards, les calendriers de capacité, les qualifications et la qualité des confirmations. Le cabinet de conseil 4flow cite comme obstacles typiques dans l'aéronautique des nomenclatures incorrectes, des délais d'approvisionnement obsolètes et des données dispersées entre des plateformes ERP, PLM et MES non connectées, ce qui ramène souvent les planificateurs vers des tableurs isolés [33]. Le guide frère [Jumeau numérique dans l'industrie](https://www.m365.fm/en/learn/digital-twin-manufacturing/) traite ce sujet plus en profondeur ; les questions d'architecture informatique, comme la connexion des données machines et de planification aux plateformes cloud, sont abordées dans le guide [Informatique industrielle avec Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Pour les données soumises à des contrôles à l'exportation ou aux règles CUI, le lieu de stockage et les droits d'accès doivent être clarifiés dès le départ [36][37][49]. Dans les programmes de défense américains, cela inclut le niveau CMMC requis pour les systèmes qui hébergent les données [49][50].

## 15. Indicateurs clés (KPI) pour la planification et le pilotage

| KPI | Définition | Pourquoi c'est important dans l'aéronautique |
|---|---|---|
| Livraison à la date prévue (OTD) | part des livraisons effectuées à la date convenue (définir la définition et la fenêtre de tolérance avec le client) | critère central des évaluations fournisseurs ; cité comme exigence dans AS9100 [14] |
| Délai de fabrication | durée entre le lancement et l'achèvement de la commande, en moyenne et en dispersion | détermine la capacité de livraison et le stock (loi de Little) [27] |
| Encours (WIP) | nombre ou valeur des commandes en atelier | indicateur avancé de l'allongement des délais |
| Taux d'utilisation du goulot | temps occupé ÷ temps disponible au goulot | détermine le débit ; au-delà de 90 %, les temps d'attente augmentent fortement [38] |
| Respect du plan | part des opérations terminées dans la fenêtre de temps planifiée | montre si le plan est réaliste |
| Défauts échappés | nombre de pièces défectueuses parvenant au client | impact de coût le plus élevé, souvent un indicateur client ; élément obligatoire du système qualité pour les titulaires d'un agrément de production FAA [41] |
| Rendement au premier passage (FPY) | part des pièces sans reprise ni rebut | les reprises consomment la capacité du goulot |
| Délai de l'inspection du premier article (FAI) | durée entre la fin du premier article et son approbation | facteur souvent sous-estimé lors des montées en cadence et des modifications |
| Écart à la courbe d'apprentissage | heures réelles par unité par rapport à la courbe cible | montre si les hypothèses de lancement se vérifient |
| Délai de rotation (TAT) | durée entre l'entrée et le retour en MRO, en moyenne et en percentile | critère principal pour les clients MRO |
| Taux de constats | part des ordres de travail comportant des travaux non routiniers et leur charge | base de la planification de capacité MRO |

**Remarque sur la mesure :** Définir chaque KPI sans ambiguïté et l'appliquer de manière cohérente. Les définitions de l'OTD en particulier diffèrent d'un client à l'autre (référence à la première date demandée ou à la date confirmée, livraison anticipée autorisée, livraison partielle ou complète). Un indicateur que chacun calcule différemment ne permet aucun pilotage. Le guide complémentaire [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) détaille les définitions des KPI.

## 16. Approche : six étapes pour un plan fiable

**Étape 1 : Mesurer la situation actuelle.** Relever les délais de fabrication, l'encours, l'OTD et le taux d'utilisation par ressource sur au moins trois mois. Une cartographie de la chaîne de valeur pour les familles de pièces les plus importantes montre où le temps est perdu.

**Étape 2 : Identifier les goulots.** Où les commandes s'accumulent-elles ? Quelle ressource détermine le débit ? Inclure les procédés spéciaux sous-traités, l'inspection et les qualifications du personnel.

**Étape 3 : Assainir les données de référence.** Gammes, temps standards, temps de changement de série, calendriers de capacité, qualifications, délais d'approvisionnement. Sans cette base, tout outil de planification produit des résultats erronés.

**Étape 4 : Introduire des règles de pilotage.** Limiter l'encours, lier le lancement au goulot, protéger le goulot par un stock tampon et définir des règles de priorité.

**Étape 5 : Introduire un ordonnancement basé sur les contraintes.** Ajouter à l'ERP un ordonnancement détaillé qui tient compte de la capacité finie, des qualifications et des créneaux de sous-traitance. Commencer par une zone pilote, idéalement au goulot.

**Étape 6 : Établir des scénarios et une boucle de retour.** Utiliser la simulation pour les décisions de cadence et d'investissement, et rapprocher chaque semaine le plan et le réalisé. Continuer à améliorer les paramètres de planification à partir des confirmations.

> **Contrôle rapide pour les responsables d'usine et de planification : cinq questions auxquelles vous pouvez répondre cette semaine**
>
> 1. Quelle est aujourd'hui votre ressource goulot, et quel était son taux d'utilisation au cours des quatre dernières semaines ?
> 2. Combien de commandes sont actuellement en atelier, et combien d'entre elles attendent un procédé spécial sous-traité ou une inspection ?
> 3. Combien de temps faut-il pour retrouver tous les numéros de série issus d'un lot de matière première donné ?
> 4. Quels temps standards utilisez-vous pour les pièces en cours de lancement : les temps de cadence stabilisée ou une courbe d'apprentissage ?
> 5. Que devient votre livraison à la date prévue si votre sous-traitant spécial le plus important est indisponible pendant deux semaines ?
>
> Si vous ne pouvez pas répondre à l'une de ces questions avec des données dans la journée, commencez par l'étape 1.

**Calendrier :** Les étapes 1 à 4 ne nécessitent pas de nouveau logiciel et, selon l'expérience de l'auteur, peuvent être mises en œuvre dans de nombreuses entreprises en quelques mois [unverified: estimation de l'auteur, sans source vérifiée]. Les étapes 5 et 6 exigent une mise en œuvre logicielle ; leur durée dépend principalement de la qualité des données de référence. Des chiffres fiables du secteur sur la durée ne sont pas disponibles.

## 17. Erreurs courantes et comment les éviter

1. **Planifier avec une capacité infinie.** La logique MRP de l'ERP ignore les goulots d'étranglement. Résultat : des plans irréalisables dès le départ. *Correctif :* ordonnancement détaillé en capacité finie.
2. **Lancer davantage d'ordres pour livrer plus vite.** Selon la loi de Little, un en-cours plus élevé allonge le délai de traversée. *Correctif :* lier le lancement au goulot d'étranglement.
3. **Modéliser les opérations externes (sous-traitance spéciale) comme un délai fixe.** Les procédés externes ont des capacités, des cadences et une variabilité. *Correctif :* convenir de créneaux et les planifier comme une ressource.
4. **Oublier le contrôle et la FAI.** Le laboratoire de contrôle et les inspecteurs ne sont pas planifiés et deviennent un goulot caché. *Correctif :* traiter les étapes de contrôle comme des opérations à capacité définie.
5. **Utiliser les temps standard de régime établi pendant la montée en cadence.** Les courbes d'apprentissage sont ignorées, le lancement est sous-planifié. *Correctif :* courbe d'apprentissage établie à partir de vos propres données.
6. **Évaluer la moyenne au lieu du goulot d'étranglement.** Un taux d'utilisation moyen de 75 % ne dit rien de la ressource goulot. *Correctif :* évaluer ressource par ressource, en se concentrant sur le goulot.
7. **Reconstituer la traçabilité après coup.** Les confirmations manquantes sont rassemblées à la fin. *Correctif :* saisir les données dans le processus, affecter la matière avant le démarrage.
8. **Ignorer les qualifications.** Le plan affecte des tâches à des personnes sans qualification valide. *Correctif :* matrice des qualifications comme contrainte.
9. **Traiter les objectifs de cadence comme des engagements.** La capacité est construite sur un objectif officiel qui glisse ensuite. *Correctif :* scénarios assortis de déclencheurs.
10. **S'engager sur la moyenne en MRO.** Les engagements de délai de rotation (TAT) fondés sur la moyenne sont régulièrement manqués lorsque des constats surviennent. *Correctif :* percentiles et une stratégie de pièces de rechange.
11. **Laisser les commandes urgentes devenir la règle.** Une accélération permanente détruit la stabilité du planning. *Correctif :* règles de priorité claires et droits d'intervention définis.
12. **Logiciel avant données.** Un APS est introduit avant que les données de référence soient justes. *Correctif :* la qualité des données comme premier lot de travail.
13. **Traiter les données contrôlées comme une question informatique secondaire.** Des commandes ITAR ou CUI finissent dans un système de planification ou un locataire cloud non configuré pour les accueillir. *Correctif :* clarifier le périmètre du contrôle des exportations et de la CMMC avant de sélectionner ou de déployer un logiciel de planification [36][49].

## 18. iFAKT et l'aéronautique

> **Remarque : l'auteur travaille chez iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), dont le siège se trouve à Stuttgart, en Allemagne, développe le logiciel [Polaris](https://www.m365.fm/entity/polaris/). Selon le site web de l'entreprise, Polaris relie les données de l'ERP à un jumeau numérique de la production afin d'optimiser les plans. La plateforme comprend des modules de modélisation de la chaîne de valeur et des processus métier, de simulation, d'optimisation de la planification (Optimizer), d'exécution en atelier (Operator) et d'analyse (Analyzer) [31]. Le site web présente l'aéronautique comme un secteur distinct et décrit l'accompagnement des fournisseurs et des fabricants aux procédés de fabrication complexes [31].

Comme référence aéronautique, iFAKT publie une étude de cas avec Airbus Pays-Bas. Depuis 2018, le site fabrique des cadres de poussée pour les modules de propulsion du lanceur Ariane 6 (Vulcain Aft Bay et Vinci Thrust Frame). Selon l'étude de cas, les modules Polaris Optimizer, Operator et Analyzer accompagnent cette production depuis sept ans. Les exigences énoncées étaient la documentation numérique, l'assurance qualité en cours de processus, des délais plus courts, la planification automatisée des ordres et une allocation optimisée des ressources. L'étude de cas décrit des résultats qualitatifs tels que des temps d'attente réduits grâce à une réaction plus rapide aux modifications imprévues, des délais de passation raccourcis et un statut des ordres disponible à tout moment ; elle ne fournit aucun chiffre [32]. Le responsable AIT d'Airbus Pays-Bas est cité affirmant que les outils Polaris ont contribué à apporter davantage de structure à la production [32].

Sur sa page d'accueil, iFAKT avance également des chiffres d'amélioration assortis de la mention « jusqu'à » (par exemple pour le délai et la capacité). Aucune méthodologie n'ayant été publiée pour ces chiffres, ils ne sont pas repris ici [31].

**Contexte :** les exigences décrites dans ce guide (ordonnancement sous contraintes, qualifications, opérations externes, simulation de scénarios de cadence, retour d'information depuis l'atelier) sont indépendantes des fournisseurs. Polaris est l'une des nombreuses solutions du marché. Évaluez tout système selon les critères de la section 11.3 et à l'aide d'un pilote utilisant vos propres données. L'article connexe [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) décrit le logiciel plus en détail.

## 19. Glossaire

**APQP (Advanced Product Quality Planning) :** Planification structurée de la qualité pour les nouveaux produits et procédés ; dans l'aéronautique, régie par AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling) :** Logiciel de planification qui ordonnance en tenant compte de la capacité finie et de la disponibilité des matières.

**As-built / as-designed :** La configuration réellement fabriquée par opposition à la configuration spécifiée par le bureau d'études.

**Goulot d'étranglement (contrainte) :** La ressource qui limite le débit de l'ensemble du système.

**CAMO (Continuing Airworthiness Management Organisation) :** Organisme agréé par l'EASA qui gère le maintien de la navigabilité d'un aéronef (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification) :** Programme du département de la Défense américain qui vérifie la cybersécurité des sous-traitants traitant des FCI ou des CUI ; clause contractuelle DFARS 252.204-7021.

**CUI (Controlled Unclassified Information) :** Informations gouvernementales nécessitant une protection mais non classifiées ; leur présence dans les systèmes de planification les place dans le périmètre du CMMC.

**Fil numérique (digital thread) :** Lien continu de toutes les données produit sur l'ensemble du cycle de vie.

**Drum-buffer-rope (DBR) :** Principe de pilotage issu de la théorie des contraintes, dans lequel le goulot d'étranglement donne le rythme et limite les lancements.

**EASA Form 1 :** Certificat de remise en service autorisé pour les pièces aéronautiques, délivré par les organismes de production ou de maintenance agréés par l'EASA.

**Effectivité :** Indication du numéro de série, de l'aéronef ou de la date à partir desquels une configuration ou une modification s'applique.

**Fuite (escape) :** Pièce défectueuse parvenue chez le client.

**FAA Form 8130-3 :** Certificat de remise en service autorisé de la FAA (étiquette d'approbation de navigabilité) pour l'approbation de navigabilité nationale, la remise en service et l'exportation ; délivré uniquement par les personnes et organismes autorisés par la FAA.

**FAI (First Article Inspection) :** Contrôle complet d'une première pièce de série au regard de toutes les caractéristiques de conception, selon AS9102 / EN 9102.

**Généalogie :** Relations parent-enfant entre matières, lots, pièces et ensembles.

**HMLV (high mix, low volume) :** Production de nombreuses variantes en petites quantités.

**Caractéristique clé :** Caractéristique dont la variation affecte de manière significative l'ajustement, la fonction, les performances ou la durée de vie en service ; régie par AS9103 / EN 9103.

**Courbe d'apprentissage :** Relation entre la quantité cumulée et l'effort par unité ; d'après Wright (1936).

**LLP (life-limited part) :** Pièce dont le nombre maximal de cycles ou d'heures est approuvé.

**MRO (maintenance, repair and overhaul) :** Prestations de maintenance, de réparation et de révision des aéronefs et de leurs composants.

**Nadcap :** Programme d'accréditation géré par l'industrie pour les procédés spéciaux, administré par le Performance Review Institute (PRI).

**OTD (on-time delivery) :** Part des livraisons effectuées à la date engagée.

**Part 145 :** Aux États-Unis, certificat de station de réparation de la FAA (14 CFR Part 145) ; dans l'UE, agrément d'organisme de maintenance de l'EASA.

**Part 21 Subpart G :** Aux États-Unis, certificat de production de la FAA (14 CFR 21.131 à 21.150) ; dans l'UE, Production Organisation Approval (POA) de l'EASA.

**PMA (Parts Manufacturer Approval) :** Approbation de production de la FAA pour les pièces de rechange et de modification (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process) :** Procédure d'approbation des pièces de série ; dans l'aéronautique, partie de AS9145 / EN 9145.

**Cadence :** Quantité produite par mois, par exemple cadence 75 = 75 aéronefs par mois.

**Station de réparation :** Organisme de maintenance certifié par la FAA selon 14 CFR Part 145.

**Procédé spécial :** Procédé dont le résultat ne peut pas être entièrement vérifié sur la pièce finie sans la détruire, comme le traitement thermique ou le traitement de surface.

**TAT (turnaround time) :** Délai entre l'entrée d'un ordre de maintenance et le retour de l'aéronef ou du composant au client.

**Rang 1 / Rang 2 :** Niveaux de la chaîne d'approvisionnement ; le rang 1 fournit directement le constructeur d'aéronefs, le rang 2 fournit le rang 1.

**Encours (WIP, work in process) :** Stock présent dans l'atelier.

## 20. FAQ : questions fréquentes sur la planification de production aéronautique

**Qu'est-ce que la planification de production aéronautique ?**
C'est la planification des quantités, des délais, de la capacité et des matières pour la fabrication d'aéronefs, de moteurs et de composants, dans le cadre des exigences de preuve propres au secteur. Elle combine une production à forte variété et faibles volumes, de longs délais d'approvisionnement et des procédés spéciaux sous-traités, avec une traçabilité stricte et une maîtrise de la configuration. Les cadences clients des constructeurs d'aéronefs donnent le rythme à l'ensemble des niveaux de la chaîne d'approvisionnement.

**Pourquoi la planification ERP ne suffit-elle pas pour l'aéronautique ?**
La logique MRP classique calcule avec des délais fixes et sans limites de capacité. Un plan de production réalisable doit tenir compte de la capacité finie, des qualifications des personnes et des machines, ainsi que des créneaux chez les sous-traitants. Les systèmes APS, ou une couche de planification détaillée étendue, assurent cette prise en compte.

**Quelle cadence de production Airbus prévoit-il pour la famille A320 ?**
Selon son rapport sur les neuf premiers mois de 2026, Airbus vise 70 à 75 appareils par mois d'ici la fin de 2027, puis une stabilisation à la cadence 75 [3]. L'objectif a été repoussé à plusieurs reprises, en partie à cause de la pénurie de moteurs [4].

**Quelle est la cadence de production du 737 de Boeing ?**
En mai 2026, le PDG de Boeing a déclaré que la chaîne du 737 tournait à la cadence 47 [8]. Le communiqué du troisième trimestre 2026 de Boeing décrit le programme comme en progression vers une production stabilisée de 47 par mois [47]. La FAA avait plafonné la cadence à 38 après janvier 2024, puis en a approuvé 42 en octobre 2025 [7].

**Quelles normes un fournisseur aéronautique doit-il connaître ?**
Le socle est l'AS9100D (EN 9100:2018). Selon l'activité, ajoutez l'AS9102 (inspection du premier article), l'AS9103 (caractéristiques clés), l'AS9145 (APQP/PPAP), l'AS9120 (distributeurs) et souvent l'accréditation Nadcap pour les procédés spéciaux. Les titulaires d'approbation de production travaillent selon la FAA 14 CFR Part 21 (ou EASA Part 21 Subpart G) ; les fournisseurs de la défense sont également soumis aux exigences ITAR/EAR, DFARS et CMMC.

**Quelle est la différence entre AS9100 et EN 9100 ?**
Aucune sur le fond. La norme de l'IAQG est publiée sous le nom AS9100 par SAE International sur le continent américain, sous le nom EN 9100 en Europe et sous le nom JISQ 9100 en Asie [13][14].

**L'AS9100D est-elle toujours valide ?**
Oui. L'IAQG travaille à une révision qui sera publiée sous le nom IA9100. En octobre 2026, la date de publication et la période de transition n'étaient pas confirmées, et les certificats AS9100D restent valides [15].

**Que exige l'AS9100 en matière de traçabilité ?**
Elle exige la traçabilité des matières premières, des matériaux et des procédés utilisés, ainsi que des outils et des personnes [14]. Les clients ajoutent des exigences spécifiques dans leurs exigences qualité fournisseurs, et les titulaires d'approbation de production de la FAA répercutent leurs propres exigences de système qualité [41].

**Quand une inspection du premier article (AS9102) est-elle requise ?**
Pour les nouvelles pièces et pour les modifications pouvant affecter la forme, l'ajustage ou la fonction, par exemple la conception, le matériau, la source de fabrication, le procédé, l'outillage ou le site, ainsi qu'après une interruption de production de plus de deux ans. Selon le périmètre, une FAI complète ou partielle est requise [34].

**Qu'est-ce que la courbe d'apprentissage en construction aéronautique, et pourquoi compte-t-elle pour la planification ?**
La courbe d'apprentissage décrit la baisse de l'effort unitaire lorsque la quantité cumulée augmente. Wright a mis en évidence une réduction d'environ 20 % à chaque doublement en 1936 [25]. Si vous planifiez un lancement avec des temps de cadence mature, vous sous-estimez nettement la capacité nécessaire (exemple chiffré à la section 9).

**Comment planifier correctement une montée en cadence ?**
Évaluez chaque ressource individuellement, en particulier le goulot d'étranglement, plutôt que le taux d'utilisation moyen. Calculez plusieurs scénarios de cadence, tenez compte des courbes d'apprentissage, de la capacité d'inspection, des délais de qualification et des approbations, et sécurisez la capacité externe par contrat. La liste de contrôle de la section 10.3 vous aide.

**Qu'est-ce que Nadcap ?**
Nadcap est un programme d'accréditation géré par l'industrie pour les procédés spéciaux tels que le traitement thermique, le traitement chimique, le soudage et le contrôle non destructif ; fondé en 1990, il est administré par le Performance Review Institute [21][54]. De nombreux clients exigent l'accréditation Nadcap pour les procédés spéciaux.

**L'APS peut-il gérer des procédés externalisés comme le traitement thermique ?**
Oui, s'ils sont modélisés comme des ressources avec capacité et créneaux plutôt que comme un délai forfaitaire. Convenez de créneaux hebdomadaires avec le sous-traitant, enregistrez-les comme une contrainte et faites du certificat de retour une condition de l'opération suivante (section 7.2).

**Le CMMC s'applique-t-il aux fournisseurs de l'aéronautique ?**
Il s'applique aux entrepreneurs et sous-traitants de la défense dont les contrats impliquent des informations fédérales de contrat (FCI) ou des informations non classifiées contrôlées (CUI). La clause DFARS est entrée en vigueur le 10 novembre 2025 et sera déployée progressivement sur trois ans ; elle se répercute sur les sous-contrats qui impliquent des FCI ou des CUI [49].

**En quoi la planification MRO diffère-t-elle de la planification de production ?**
En maintenance, l'étendue des travaux n'est connue qu'après inspection. La planification doit composer avec des probabilités de découverte de défauts, la disponibilité des pièces et des marges de sécurité. Le KPI central est le délai de rotation (TAT).

**Comment un atelier de réparation peut-il réduire le délai de rotation ?**
En inspectant tôt, en stockant les pièces critiques ou en les fournissant via des pools d'échange, en réservant de la capacité pour les travaux non routiniers et en accélérant les validations client. Les engagements de TAT doivent reposer sur des percentiles plutôt que sur des moyennes.

**Quels KPI comptent le plus pour les fournisseurs de l'aéronautique ?**
Le taux de livraison à temps (OTD), le délai de fabrication, les en-cours (WIP), le taux d'utilisation du goulot d'étranglement, les échappements et le taux de conformité au premier passage (FPY). En maintenance, on ajoute le délai de rotation et le taux de découverte.

**Qu'apporte un jumeau numérique à la fabrication aéronautique ?**
Il permet de simuler des scénarios de cadences et d'investissements, de replanifier plus rapidement lors de perturbations et, combiné au fil numérique (digital thread), de répondre rapidement aux questions de traçabilité. Des données de référence propres et des données de confirmation en sont le prérequis.

**Où se situent les plus grands risques de la chaîne d'approvisionnement en 2026 ?**
Selon Roland Berger, dans la main-d'œuvre qualifiée, les matières premières telles que le titane, les pièces moulées et forgées, les fixations, ainsi que les services de contrôle et de traitement de surface [10]. Pour les moteurs, les pénuries d'approvisionnement limitent les cadences des constructeurs d'avions [4].

## 21. Conclusion

En 2026, l'industrie aéronautique dispose de carnets de commandes pleins, mais d'une chaîne d'approvisionnement qui ne peut les absorber que lentement. Pour les fournisseurs et les ateliers de maintenance, la planification de la production est devenue un facteur de compétitivité. Ceux qui connaissent leurs goulots d'étranglement, qui planifient de manière réaliste les courbes d'apprentissage et les procédés spéciaux, qui intègrent la traçabilité dans le flux de commandes et qui calculent à l'avance des scénarios de cadence peuvent accompagner les montées en cadence sans sacrifier la livraison à temps ni la qualité.

Le chemin commence rarement par le logiciel. Il commence par la mesure, des données de référence propres et des règles de pilotage simples, comme un en-cours limité et une libération des ordres fondée sur le goulot d'étranglement. APS, simulation et jumeaux numériques renforcent ces fondations ; ils ne les remplacent pas. Les mécanismes sont bien connus et documentés depuis des décennies, de la courbe d'apprentissage de Wright à la loi de Little en passant par la théorie des contraintes. Les appliquer de manière constante est la véritable tâche.

## Pour aller plus loin sur m365.fm

**Article et podcast**

- [Planification de la production aérospatiale : délai de fabrication et traçabilité](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Épisode de podcast [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Pages d'entités**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guides connexes**

- [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Jumeau numérique dans l'industrie manufacturière](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT industriel avec Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Cartographie du flux de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI de production](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Management en atelier](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la planification de la production, la traçabilité, la simulation et la numérisation de la fabrication. Il s'intéresse à la manière dont la planification sous contraintes, les jumeaux numériques et le retour d'information de l'atelier fonctionnent ensemble afin que les plans tiennent sur le terrain, y compris dans des secteurs exigeants comme l'aéronautique.

**Note : L'auteur travaille chez iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
