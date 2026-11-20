# SEO metadata

| Field | Value |
|---|---|
| Meta title | Logiciel de planification de production : guide APS (2026) |
| Meta description | Logiciel de planification de production et APS expliqués : capacité finie, goulots d'étranglement, drum-buffer-rope, EOQ, stock de sécurité, exemples et checklist. |
| Slug | `production-scheduling-aps` |

# Logiciel de planification de production et APS : le guide complet pour des plannings tenables sur l'atelier

> **Réponse courte :** Le logiciel de planification de la production avec APS (advanced planning and scheduling, planification et ordonnancement avancés) planifie les ordres de fabrication en tenant compte à la fois de la capacité finie et des matières disponibles. La logique MRP classique d'un ERP suppose une capacité illimitée et des délais de fabrication fixes. Un APS modélise les machines, le personnel, les outillages, les changements de série, les équipes et les goulots d'étranglement, de sorte que la séquence et les dates qu'il produit sont des dates que votre usine peut réellement tenir.

C'est lundi matin au service ordonnancement. La planification MRP du week-end a créé 140 ordres de travail avec une date de début « cette semaine ». La cellule d'usinage a presque deux semaines de charge devant elle, l'assemblage attend des pièces, et le commercial demande une date d'expédition que personne ne peut garantir sérieusement. Le planning est donc refait : dans Excel, sur le tableau blanc, dans une discussion dans le couloir avec le chef d'équipe. Dès mercredi, il est de nouveau périmé.

Si cela vous semble familier, la cause n'est que rarement un manque de rigueur. Elle tient à la logique de planification. La planification des besoins en matières (MRP, material requirements planning) a été conçue pour répondre à une seule question : *De quelles matières ai-je besoin, et quand ?* Elle répond de façon approximative, voire pas du tout, à la question *Mon usine peut-elle réellement réaliser ce travail dans cette séquence ?* C'est à cette seconde question que servent l'ordonnancement détaillé et l'APS.

Ce guide couvre les fondamentaux de la planification et du pilotage de la production, les faiblesses structurelles du MRP, la physique d'une usine, le fonctionnement des systèmes APS, la théorie des contraintes avec drum-buffer-rope, les briques du lean telles que le heijunka et l'équilibrage des lignes, les formules classiques de taille de lot et de stock de sécurité avec exemples chiffrés, ainsi que la sélection et la mise en œuvre d'un logiciel d'ordonnancement de la production doté de capacités APS. Pour une définition succincte, voir la fiche entité m365.fm [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Points clés

- **L'ERP planifie les matières, l'APS planifie la faisabilité.** La logique MRP intégrée à un ERP, dans sa forme de base, suppose une capacité illimitée et des délais de fabrication planifiés fixes. Un APS ordonnance en tenant compte à la fois de la capacité finie et de la disponibilité des matières.
- **Le délai de fabrication correspond surtout à du temps d'attente.** La loi de Little énonce que temps de cycle = en-cours ÷ débit [9]. Réduisez les en-cours sans affamer le goulot et les délais diminuent.
- **Un taux d'utilisation élevé coûte du temps.** Le temps d'attente en file croît selon le facteur u/(1−u), et non linéairement. À 95 % d'utilisation, l'attente est presque cinq fois plus longue qu'à 80 % [10][11].
- **Le goulot d'étranglement fixe le rythme.** La théorie des contraintes (TOC, theory of constraints) et le drum-buffer-rope (DBR) alignent le lancement des ordres et le séquencement sur la contrainte [1][2].
- **Les formules classiques sont des points de départ, pas des vérités.** La quantité économique de commande (EOQ, economic order quantity) et la formule du stock de sécurité reposent sur des hypothèses simplificatrices. La courbe de coût de l'EOQ est plate, et le temps de changement de série est généralement le levier le plus important.
- **Un APS n'est aussi bon que ses données de référence.** Les gammes, les temps standards, les matrices de changement de série et les calendriers de capacité déterminent la qualité de l'ordonnancement bien plus que l'algorithme lui-même.

### Par où commencer, selon votre rôle

| Vous êtes … | Lisez d'abord |
|---|---|
| Un planificateur ou ordonnanceur de production confronté à des plannings ERP irréalistes | Sections 3, 4 et 5 (faiblesses du MRP, physique de l'usine, fonctionnement de l'APS) |
| Dans le pilotage de production, l'ingénierie de fabrication ou l'encadrement d'atelier | Sections 7 et 8 (goulot, DBR, takt, heijunka) |
| Dans la supply chain, la planification des approvisionnements ou des stocks | Sections 9 et 10 (taille de lot, stock de sécurité) |
| Responsable d'une sélection ou d'une mise en œuvre d'APS | Sections 13 à 16 (sélection, données, feuille de route, erreurs à éviter) |
| Directeur d'usine ou dirigeant opérationnel | Réponse courte, Section 11 (KPI) et Section 21 (Conclusion) |

## Table des matières

1. [Pourquoi les plannings ERP échouent sur le terrain](#1-pourquoi-les-plannings-erp-échouent-sur-le-terrain)
2. [Fondamentaux : ce que couvre la planification et la maîtrise de la production](#2-fondamentaux--ce-que-couvre-la-planification-et-la-maîtrise-de-la-production)
3. [Les faiblesses de la logique MRP classique](#3-les-faiblesses-de-la-logique-mrp-classique)
4. [Physique de l'usine : loi de Little, courbes d'exploitation et variabilité](#4-physique-de-lusine--loi-de-little-courbes-opérationnelles-et-variabilité)
5. [Ce qu'est un système APS et comment il calcule](#5-quest-ce-quun-système-aps-et-comment-calcule-t-il)
6. [ERP vs APS vs MES](#6-erp-vs-aps-vs-mes)
7. [Théorie des contraintes, drum-buffer-rope et gestion par les tampons](#7-théorie-des-contraintes-drum-buffer-rope-et-gestion-des-tampons)
8. [Briques Lean dans l'ordonnancement : takt, heijunka, équilibrage de ligne, flux tiré](#8-briques-lean-dans-lordonnancement--takt-heijunka-équilibrage-de-ligne-flux-tiré)
9. [Taille de lot : EOQ, exemple détaillé et limites](#9-taille-de-lot--eoq-exemple-chiffré-et-limites)
10. [Stock de sécurité : formule et exemple détaillé](#10-stock-de-sécurité--formule-et-exemple-chiffré)
11. [Indicateurs de planification de production](#11-indicateurs-de-performance-de-la-planification-de-production)
12. [Jumeau numérique et simulation](#12-jumeau-numérique-et-simulation)
13. [Comment choisir un logiciel d'ordonnancement de production : critères et liste de contrôle](#13-comment-choisir-un-logiciel-dordonnancement-de-production--critères-et-checklist)
14. [Exigences en données et qualité des données de référence](#14-exigences-en-matière-de-données-et-qualité-des-données-de-référence)
15. [Feuille de route de mise en œuvre d'un APS](#15-feuille-de-route-de-mise-en-œuvre-de-laps)
16. [Erreurs courantes et comment les éviter](#16-erreurs-courantes-et-comment-les-éviter)
17. [Preuves : ce que rapportent les études et les utilisateurs](#17-preuves--ce-que-rapportent-les-études-et-les-utilisateurs)
18. [Planification sous contraintes avec iFAKT Polaris](#18-planification-sous-contraintes-avec-ifakt-polaris)
19. [Glossaire](#19-glossaire)
20. [FAQ : logiciels d'ordonnancement de production et APS](#20-faq--logiciel-de-planification-de-production-et-aps)
21. [Conclusion](#21-conclusion)

## 1. Pourquoi les plannings ERP échouent sur le terrain

La plupart des industriels planifient leur production dans leur système ERP, et pour de bonnes raisons : c'est là que vivent les commandes clients, les nomenclatures, les gammes et les stocks. Un système [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) est le système de référence pour les quantités, les valeurs et les dates. La logique de planification intégrée à la plupart des ERP repose cependant sur une méthode développée dans les années 1960 et 1970 et documentée par Joseph Orlicky dans son ouvrage de référence de 1975 : la planification des besoins en composants (MRP) [24].

Les planificateurs reconnaissent les symptômes dès que cette logique atteint ses limites :

- **Postes de travail surchargés sur le papier :** L'ERP planifie des ordres dans une semaine où la capacité du poste est depuis longtemps épuisée.
- **Dates de livraison à l'intuition :** Les dates promises reposent sur des délais standard, et non sur la charge actuelle.
- **Ordonnancement parallèle sous Excel :** Le véritable planning détaillé vit hors de l'ERP, dans des tableurs, sur des tableaux blancs ou dans la tête de chefs d'équipe expérimentés.
- **Les urgences repoussent tout le reste :** Chaque accélération crée de nouvelles commandes en retard ailleurs.
- **Stocks élevés et pénuries malgré tout :** Il y a beaucoup de matière dans l'atelier, mais pas celle dont l'assemblage a besoin maintenant.
- **Planificateurs en mode pompiers :** Une part importante de la semaine est consacrée à replanifier plutôt qu'à planifier.

L'ampleur du phénomène apparaît dans une enquête menée par IDC pour l'éditeur de logiciels de planification Kinaxis. IDC a interrogé plus de 1 800 responsables de chaîne d'approvisionnement dans neuf pays, dont les États-Unis et le Canada, en décembre 2023 ; 83 % ont déclaré que leur organisation ne pouvait pas réagir à une perturbation de la chaîne d'approvisionnement dans les 24 heures [32]. Pour les 200 répondants allemands, le journal professionnel allemand Logistik Heute a rapporté que 37 % s'appuyaient uniquement sur Excel, ou sur Excel combiné à des outils autonomes, pour la planification de la chaîne d'approvisionnement, et que 89 % ne pouvaient pas réagir aux perturbations dans les 24 heures [25]. L'étude est financée par un éditeur et porte sur la planification de la chaîne d'approvisionnement en général, et non spécifiquement sur l'ordonnancement en atelier ; le communiqué publié ne donne aucun chiffre spécifique aux États-Unis concernant les tableurs. Elle n'en illustre pas moins l'ampleur du problème.

La bonne nouvelle : les causes sont bien comprises. Elles se situent dans trois domaines que ce guide traite successivement : la logique de planification (section 3), la physique des files d'attente et des stocks (section 4), et l'attention insuffisante portée au goulot d'étranglement (section 7). Une version plus courte du premier argument figure dans l'article du blog m365.fm [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Fondamentaux : ce que couvre la planification et la maîtrise de la production

### 2.1 Définitions

La **planification et maîtrise de la production (PMP)** couvre l'ensemble des tâches qui permettent à une entreprise de décider *quoi*, *en quelle quantité*, *quand* et *où* produire, puis de déclencher et de suivre l'exécution. La planification fixe des objectifs ; la maîtrise les met en œuvre sur l'atelier et réagit aux écarts. Dans la pratique américaine, le même périmètre est souvent désigné par l'expression manufacturing planning and control (MPC). Le corpus de connaissances professionnelles est entretenu par l'ASCM, l'Association for Supply Chain Management, à travers sa certification APICS CPIM, dont les modules portent notamment sur la planification commerciale et opérationnelle (S&OP), l'approvisionnement interne, les stocks et les ordonnancements détaillés [33].

Deux termes prêtent régulièrement à confusion : **planification** et **ordonnancement**. La planification (planification grossière ou agrégée) raisonne sur des quantités agrégées, des périodes hebdomadaires ou mensuelles et des groupes de postes de travail. L'**ordonnancement détaillé** décide, pour chaque opération, sur quelle ressource elle s'exécute, dans quel ordre et à quel moment. Il raisonne en jours, en équipes ou en minutes, et constitue le cœur de ce que fait un système APS. La pratique allemande utilise la paire *Grobplanung* et *Feinplanung* pour la même distinction ; le terme « Feinplanung » apparaît dans la documentation des éditeurs allemands.

### 2.2 Les niveaux de planification en un coup d'œil

La littérature organise la planification de façon hiérarchique, du plan commercial et de capacité à long terme jusqu'à la séquence sur une machine unique [7][12]. Le tableau en résume les niveaux. Les horizons indiqués sont des ordres de grandeur typiques, qui varient selon le secteur et le type de production.

| Niveau | Horizon typique | Question clé | Sortie | Système typique |
|---|---|---|---|---|
| Planification commerciale et opérationnelle (S&OP) | 12 à 24 mois | Que allons-nous vendre, et quelle capacité faut-il ? | Plan de ventes et de capacité par famille de produits | ERP, outils de planification, Excel |
| Programme directeur de production (MPS) | semaines à mois | Quels produits finis fabriquons-nous, quand et en quelle quantité ? | Demande indépendante, programme de production | ERP |
| Planification des besoins en matières (MRP) | semaines | Quels sous-ensembles, pièces et matières premières faut-il, et quand ? | Demande dépendante, ordres planifiés, demandes d'achat | ERP |
| Planification des besoins en capacité (CRP) | jours à semaines | Quand les opérations s'exécutent-elles, et la capacité est-elle suffisante ? | Dates jalons, charge de capacité | ERP (grossier), APS (précis) |
| Ordonnancement détaillé | heures à jours, glissant sur quelques semaines | Quelle opération s'exécute sur quelle ressource, dans quel ordre ? | Planning des ressources, séquence (diagramme de Gantt) | APS, module d'ordonnancement MES, tableau d'ordonnancement |
| Maîtrise de l'activité de production / lancement | de l'équipe à la minute | Quel ordre est lancé, que se passe-t-il en cas de panne ? | Lancements, confirmations, déclencheurs de replanification | MES, APS, atelier |

Hermann Lödding, chercheur allemand en maîtrise de la production, répartit la maîtrise de la production en quatre tâches : génération des ordres, lancement, maîtrise de la capacité et séquencement [12]. Cette répartition est utile, car elle montre qu'un bon ordonnancement ne suffit pas à lui seul. La décision de *quand* un ordre entre dans l'atelier influence souvent davantage les en-cours et les délais que la séquence sur une machine donnée.

### 2.3 Modèles de référence : ISA-95, ASCM et le modèle PPC d'Aix-la-Chapelle

Les fabricants américains s'orientent généralement selon deux cadres. La hiérarchie de planification ASCM/APICS présentée dans le tableau ci-dessus (S&OP, MPS, MRP, CRP, ordonnancement détaillé, exécution) est le langage commun des planificateurs et des professionnels de la chaîne d'approvisionnement [33]. La norme ANSI/ISA-95 (publiée à l'international sous le nom CEI 62264) trace la frontière entre planification d'entreprise et logistique (niveau 4, généralement l'ERP) et gestion des opérations de fabrication (niveau 3, généralement MES et ordonnancement). La partie 3, ANSI/ISA-95.00.03-2013, décrit les modèles d'activités de la gestion des opérations de fabrication et définit l'ordonnancement à capacité finie comme une méthode dans laquelle le travail est programmé pour un ensemble de ressources de fabrication de telle sorte qu'aucune capacité programmée ne dépasse la capacité disponible [31].

Dans les pays germanophones, le modèle de référence dominant est le **modèle PPC d'Aix-la-Chapelle** (*Aachener PPS-Modell*) de l'institut FIR de l'université RWTH Aachen. Il est décrit dans plusieurs éditions du manuel allemand de référence *Produktionsplanung und -steuerung* ; la quatrième édition a été dirigée par Günther Schuh et Volker Stich en 2012 [7]. Le modèle regroupe les tâches de planification et de pilotage en trois catégories :

- **Tâches de réseau :** conception stratégique du réseau de production, comme les décisions de sites et de fournisseurs.
- **Tâches centrales :** les tâches qui font avancer une commande, à savoir la planification du programme de production, la planification des besoins de production, la planification et le pilotage de la production interne, ainsi que la planification et le pilotage de l'approvisionnement externe.
- **Tâches transversales :** gestion des commandes, gestion des stocks et contrôle de gestion, qui intègrent et optimisent les processus entre les fonctions.

La valeur de ces trois cadres tient à la séparation nette des tâches. Ils aident à déterminer quel système doit prendre en charge quel travail : l'ERP couvre en général la planification du programme et des besoins, un APS couvre l'ordonnancement détaillé de la production interne, et un MES couvre l'exécution et les déclarations de réalisation.

### 2.4 Du MRP au MRP II puis à l'APS

L'histoire des systèmes de planification explique bon nombre des problèmes actuels :

1. **Points de réapprovisionnement et formules de taille de lot (à partir de 1913) :** Ford Whitman Harris a publié la formule de la taille économique de lot en 1913 [17]. Dans les pays germanophones, elle est devenue connue grâce à Kurt Andler (1929) et y est toujours appelée *formule d'Andler* [18].
2. **MRP (années 1960 et 1970) :** Les ordinateurs ont permis de décomposer la demande à travers les nomenclatures et de la décaler dans le temps selon les délais de fabrication planifiés. Orlicky a décrit la méthode de manière exhaustive en 1975 [24].
3. **MRP II (début des années 1980) :** La planification des ressources de fabrication a ajouté la planification directrice, la planification grossière des capacités, la planification des besoins en capacité (CRP) et le lien avec la planification financière. La vérification de la capacité restait toutefois une étape en aval : ordonnancer d'abord, puis afficher la charge [10].
4. **ERP (années 1990) :** Les systèmes ERP ont intégré la finance, la vente, les achats et les ressources humaines. Le noyau de planification restait souvent le MRP II.
5. **APS (à partir des années 1990) :** Les systèmes avancés de planification s'attaquent à la vérification de capacité en aval en planifiant conjointement les matières et les capacités à l'aide de méthodes d'optimisation. Ils ne remplacent pas l'ERP ; ils ajoutent une planification qui respecte la capacité finie [13].

## 3. Les faiblesses de la logique MRP classique

La logique MRP n'est pas fausse. Pour déterminer quel matériel est nécessaire et en quelle quantité, elle est indispensable. Le problème apparaît lorsque son résultat est utilisé tel quel comme planning de production. Wallace Hopp et Mark Spearman critiquent dans *Factory Physics* le fait que le modèle MRP de base suppose des délais fixes, indépendants de la charge. Des délais fixes ne seraient toutefois possibles qu'avec une capacité illimitée [10].

### 3.1 Capacité infinie

Le MRP planifie chaque ordre prévisionnel en remontant du délai prévu à partir de la date d'échéance. Il ne vérifie pas si le poste de travail est libre à ce moment-là. On parle de **planification à capacité infinie**. La planification des besoins en capacité (CRP) en aval fait apparaître les surcharges mais ne les résout pas. Cette tâche revient au planificateur.

**Exemple détaillé : la surcharge que le MRP ne voit pas**

Un centre d'usinage fonctionne en deux équipes, cinq jours par semaine, 8 heures par équipe : 80 heures de capacité par semaine. Le calcul MRP génère cette charge :

| Semaine | Capacité (h) | Charge MRP (h) | Écart (h) | Charge |
|---|---|---|---|---|
| Semaine 12 | 80 | 112 | −32 | 140 % |
| Semaine 13 | 80 | 54 | +26 | 68 % |
| Semaine 14 | 80 | 96 | −16 | 120 % |
| **Total** | **240** | **262** | **−22** | **109 %** |

Même si le planificateur lisse parfaitement en reportant du travail de la semaine 12 vers la semaine 13, il reste 22 heures qui ne peuvent pas être réalisées sur les trois semaines. Il faut alors prévoir des heures supplémentaires, de la sous-traitance ou une machine de remplacement, ou bien au moins un ordre sera livré en retard. Or l'ERP affiche toujours chaque ordre à sa date d'origine, et les ventes s'engagent sur les dates de livraison en se basant sur cet affichage. Un APS planifierait les ordres en fonction de 80 heures par semaine et indiquerait la date d'achèvement réaliste la plus proche.

### 3.2 Délais de fabrication prévisionnels fixes

La deuxième hypothèse est un **délai de fabrication prévisionnel fixe** par article ou par gamme, par exemple « fraisage : 5 jours ouvrés ». En réalité, le délai dépend fortement de la charge actuelle, comme le montre la section 4. Lorsque l'atelier est vide, un ordre traverse en deux jours ; lorsqu'il est plein, il faut deux semaines. Une valeur fixe est donc presque toujours soit trop longue (conséquence : stocks élevés, lancements trop précoces), soit trop courte (conséquence : retards de livraison).

Le délai prévisionnel contient en outre généralement une part importante de temps de déplacement et d'attente. Peter Nyhuis et Hans-Peter Wiendahl de l'Université Leibniz de Hanovre distinguent le temps opératoire (préparation et usinage) du temps inter-opérations (attente avant et après l'usinage, plus transport) [8]. Dans les ateliers à la commande, le temps inter-opérations représente généralement la plus grande part. Inscrire ce temps d'attente dans les données de base sous forme de constante figée le verrouille.

### 3.3 Le syndrome du délai

Que se passe-t-il lorsque les planificateurs réagissent aux retards en allongeant les délais prévisionnels ? Cet effet est connu depuis des décennies sous le nom de **syndrome du délai** et est principalement discuté dans le contexte du MRP [23] :

1. Les ordres sont livrés en retard.
2. Les planificateurs allongent les délais prévisionnels par précaution.
3. Les ordres sont en conséquence lancés plus tôt.
4. Davantage d'ordres sont simultanément en atelier ; les en-cours augmentent.
5. Selon la loi de Little, à débit constant, le délai réel augmente.
6. Les ordres sont à nouveau livrés en retard, et le cycle recommence.

En 2023, Matthias Thürer, Nuno Fernandes, Stefan Haeussler et Mark Stevenson ont utilisé la simulation pour vérifier si l'ajustement dynamique des délais prévisionnels nuit aux ateliers en fabrication à la commande. Leur réponse : oui, mais pas de la manière attendue. Le dommage provient principalement de la réduction des délais prévisionnels pendant les périodes de faible charge, ce qui augmente ensuite la charge lors des périodes de forte charge ultérieures [23]. En pratique : ajuster les délais prévisionnels sans contrôler le lancement des ordres ne fait que déplacer le problème.

Les remèdes sont le lancement des ordres basé sur la charge ou sur le goulot d'étranglement (sections 7 et 8), ainsi que l'ordonnancement à capacité finie, qui déduit les délais de l'ordonnancement réel au lieu de les imposer.

### 3.4 Planification séquentielle

La troisième faiblesse est la **planification séquentielle** : d'abord le programme, puis les matières, puis les dates, puis la capacité. Chaque étape prend le résultat précédent comme acquis. Une boucle de rétroaction du type « cette machine est saturée, je déplace donc le besoin et, avec lui, la commande d'achat » ne fait pas partie de la conception. Le résultat : des plans cohérents à chaque étape, mais irréalisables dans leur ensemble.

| Hypothèse de la MRP | Réalité de l'atelier | Conséquence |
|---|---|---|
| La capacité est illimitée | La capacité est limitée à chaque poste de travail | semaines surchargées, dates irréalistes |
| Les délais de fabrication sont fixes | Les délais de fabrication dépendent de la charge | ordres lancés trop tôt ou trop tard |
| Les tailles de lots sont indépendantes de l'séquence | Les temps de changement dépendent de la variante précédente | capacité perdue au goulot d'étranglement |
| Les étapes de planification s'enchaînent les unes après les autres | Matières, capacité et dates interagissent | plans qui ne fonctionnent que sur le papier |
| La demande et les stocks sont connus exactement | Les prévisions varient, les enregistrements de stock contiennent des erreurs | nervosité, ruptures, marges de sécurité excessives |

## 4. Physique de l'usine : loi de Little, courbes opérationnelles et variabilité

Pour comprendre pourquoi les ordonnancements échouent, il faut trois relations qui valent quels que soient le secteur et le logiciel. Hopp et Spearman les ont résumées sous le nom de *Factory Physics* [10].

### 4.1 Loi de Little : en-cours, débit et temps de cycle

En 1961, John D. C. Little a démontré une relation valable pour tout système stable à arrivées et départs [9]. En termes de production :

> **Temps de cycle (CT) = en-cours (WIP) ÷ débit (TH)**

La formule est valable pour les moyennes à long terme, quelle que soit la distribution des temps de traitement ou la règle de séquencement. Note sur la terminologie : dans la loi de Little, « temps de cycle » désigne le temps qu'un ordre passe dans le système (son temps de passage ou délai de fabrication), et non le temps de cycle d'un poste, qui est comparé au takt time à la section 8.

**Exemple chiffré :** Un atelier de pièces termine en moyenne 40 ordres de fabrication par jour ouvré. En moyenne, 600 ordres lancés mais non terminés se trouvent dans l'atelier.

- CT = 600 ÷ 40 = **15 jours ouvrés**

Si un lancement maîtrisé réduit l'en-cours à 320 ordres, le goulot restant alimenté et le débit maintenu à 40 ordres par jour :

- CT = 320 ÷ 40 = **8 jours ouvrés**

Le délai a presque été divisé par deux sans qu'une seule machine tourne plus vite. C'est pourquoi la maîtrise de l'en-cours et le lancement des ordres figurent parmi les leviers les plus efficaces et les moins coûteux de la planification de production. Pour en savoir plus sur cet indicateur, voir la page d'entité [Lead Time](https://www.m365.fm/entity/lead-time/).

**Mise en garde importante :** La loi de Little ne dit pas que toute réduction de l'en-cours réduit le délai sans effets secondaires. Si l'en-cours devant le goulot baisse au point qu'il se retrouve à court de travail, le débit baisse aussi. Les courbes opérationnelles décrivent précisément cette relation.

### 4.2 Courbes opérationnelles et modèle de l'entonnoir

Des chercheurs de l'Institut des systèmes de production et de logistique (IFA) de l'Université Leibniz de Hanovre ont développé le **modèle de l'entonnoir** : un poste de travail est assimilé à un entonnoir dans lequel les ordres entrent et d'où ils sortent après traitement. Le **diagramme de débit** qui en découle montre l'en-cours, la production et le délai au fil du temps [8]. S'appuyant sur ce modèle, Nyhuis et Wiendahl ont formulé les **courbes opérationnelles logistiques**, qui montrent comment la production et le délai d'un système de travail dépendent de l'en-cours [8] :

- À **faible en-cours**, la production croît presque linéairement à chaque ordre ajouté, et le délai reste proche du temps opératoire pur. Mais le poste risque de manquer de matière.
- À partir d'un **en-cours moyen**, la production approche son maximum. Ajouter de l'en-cours n'apporte presque plus de production.
- À **fort en-cours**, la production stagne tandis que le délai continue de croître proportionnellement à l'en-cours. L'en-cours supplémentaire n'est plus que du temps d'attente.

On en tire une règle de planification centrale : chaque poste de travail a une plage d'en-cours dans laquelle la production est assurée et le délai reste court. L'ordonnancement et le lancement doivent viser à maintenir l'atelier dans cette plage. Hopp et Spearman décrivent un concept voisin, l'**en-cours critique** : le niveau d'en-cours auquel une ligne idéale atteint tout juste son débit maximal avec un temps de cycle minimal [10]. Nyhuis et Wiendahl rapprochent explicitement ces deux approches et relient la théorie des courbes opérationnelles à la loi de Little [8].

### 4.3 Variabilité et taux d'utilisation : pourquoi 95 % peut être trop

La troisième loi concerne le temps d'attente devant une ressource. John Kingman a publié en 1961 une approximation pour les files d'attente en trafic dense [11]. Hopp et Spearman l'utilisent dans *Factory Physics* sous le nom d'**équation VUT** (variabilité × utilisation × temps) [10] :

> **Temps moyen d'attente devant la ressource ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (variabilité des arrivées et des temps de traitement)
> U = u ÷ (1 − u) (facteur d'utilisation, u = taux d'utilisation entre 0 et 1)
> T = t_e (temps de traitement effectif moyen)

c_a et c_e sont les coefficients de variation (écart type divisé par la moyenne) des temps inter-arrivées et des temps de traitement. L'approximation s'applique à une seule ressource et est plus précise à taux d'utilisation élevé.

**Exemple chiffré :** Une machine a un temps de traitement effectif moyen de 1 heure par commande. Les arrivées et les temps de traitement varient modérément ; les deux coefficients de variation valent 1, donc V = (1 + 1) ÷ 2 = 1.

| Taux d'utilisation u | U = u ÷ (1 − u) | Temps d'attente moyen (h) | Temps passé sur la machine, traitement inclus (h) |
|---|---|---|---|
| 80 % | 4,0 | 4,0 | 5,0 |
| 85 % | 5,7 | 5,7 | 6,7 |
| 90 % | 9,0 | 9,0 | 10,0 |
| 95 % | 19,0 | 19,0 | 20,0 |

Passer de 80 % à 95 % d'utilisation ajoute 15 points de charge, mais multiplie presque par cinq le temps d'attente. Trois enseignements pour la planification en découlent :

1. **Une utilisation maximale partout n'est pas un objectif raisonnable.** Si chaque poste de travail est planifié à 95 %, on obtient des délais longs et très variables.
2. **Réduire la variabilité agit comme l'ajout de capacité.** Diviser V par deux, par exemple grâce à des changements de série plus stables, des lots plus petits et plus réguliers ou un lancement lissé, divise par deux le temps d'attente à taux d'utilisation identique.
3. **Un taux d'utilisation élevé est souhaitable au goulot d'étranglement, mais seulement avec un tampon.** Le goulot ne doit jamais être privé de travail. Cela ne fonctionne que si un stock tampon dimensionné délibérément se trouve en amont et si les autres ressources disposent d'une capacité libre (section 7).

## 5. Qu'est-ce qu'un système APS et comment calcule-t-il

### 5.1 Définition

**La planification et l'ordonnancement avancés (APS, Advanced Planning and Scheduling)** désignent les logiciels et méthodes qui planifient et ordonnancent les ordres de fabrication en tenant simultanément compte de la disponibilité des matières et de la capacité finie. La littérature sur la chaîne d'approvisionnement retient une définition plus large : Bernhard Fleischmann, Herbert Meyr et Michael Wagner placent la planification avancée dans une matrice de planification allant de la conception du réseau à long terme jusqu'à l'ordonnancement à court terme, couvrant l'approvisionnement, la production, la distribution et les ventes [13]. Sur l'atelier, « APS » désigne généralement la partie responsable de l'ordonnancement détaillé et du séquencement de la production. De nombreux produits répertoriés sous « logiciels d'ordonnancement de production » dans les annuaires de logiciels américains couvrent cette couche, en tant que produit autonome ou module d'un ERP ou d'un MES ; d'autres dans ces mêmes listes sont des outils de planification de projets ou de ressources (section 13.1).

Le mot **« avancé »** renvoie à trois différences par rapport à la logique MRP classique :

- **Ordonnancement à capacité finie :** Chaque ressource a une capacité limitée, dépendante du calendrier. Une opération n'est planifiée que là où la ressource est libre. La norme ISA-95 définit l'ordonnancement à capacité finie exactement en ces termes : aucune capacité planifiée ne peut dépasser la capacité disponible [31].
- **Planification simultanée :** Matières, capacités et dates sont considérées ensemble. Si une matière manque, l'opération est décalée ; si la machine est occupée, l'exigence en matière est décalée.
- **Optimisation :** Au lieu de calculer une seule réponse, le système recherche parmi de nombreuses solutions réalisables une solution satisfaisante, idéalement la meilleure selon des objectifs définis.

### 5.2 Ordonnancement basé sur les contraintes : ce qu'un APS modélise

Un APS ne planifie pas contre une « capacité » exprimée par un seul chiffre, mais contre un réseau de contraintes. On parle d'**[ordonnancement basé sur les contraintes](https://www.m365.fm/entity/constraint-based-scheduling/)**. Contraintes typiques :

| Contrainte | Exemple | Pourquoi c'est important |
|---|---|---|
| Capacité des ressources | Machine A : 2 équipes, du lundi au vendredi | base de tout planning détaillé |
| Ressources de substitution | La pièce peut être fabriquée sur la machine A ou B, 20 % plus lentement sur B | solution de secours lorsqu'une ressource est surchargée |
| Main-d'œuvre et compétences | Seuls trois opérateurs sont certifiés sur le banc d'essai | la main-d'œuvre est souvent le véritable goulot d'étranglement |
| Outillages et gabarits | Un seul moule d'injection par variante | deux machines ne peuvent pas fabriquer la même variante en même temps |
| Changements de série dépendants de la séquence | Couleur claire vers foncée : 10 min ; foncée vers claire : 45 min | la séquence détermine la capacité disponible |
| Séquence des opérations et recouvrement | Le montage ne démarre qu'après la peinture ; transfert par lots partiels autorisé | délai de traversée et synchronisation |
| Temps d'attente minimum et maximum | La colle doit durcir 24 h ; la pièce ne peut pas attendre plus de 4 h entre le lavage et le revêtement | temps technologiques minimum et maximum |
| Matières et composants achetés | L'électronique arrive le jeudi | la disponibilité des matières limite le démarrage au plus tôt |
| Zones et surface au sol | Seules deux sections de fuselage tiennent simultanément dans une zone de montage | typique de l'assemblage de grands équipements et de l'aéronautique |
| Campagnes et lots | Le four ne fonctionne qu'en lots complets à la même température | regroupement contre dates de livraison |

Plus ces contraintes s'appliquent, moins il est fiable de construire un planning à la main ou dans Excel, et plus l'APS apporte de bénéfice.

### 5.3 Ampleur du problème : explosion combinatoire

Même sur une seule machine, le nombre de séquences possibles croît avec la factorielle du nombre de commandes :

- 4 commandes : 4! = 24 séquences
- 10 commandes : 10! = 3 628 800 séquences
- 15 commandes : 15! = 1 307 674 368 000 séquences, soit environ 1,3 billion

Dans un atelier réel à production en ateliers spécialisés (job shop) comportant des dizaines de machines, des centaines de commandes et des gammes en plusieurs étapes, essayer toutes les options est impossible. En 1976, Michael Garey, David Johnson et Ravi Sethi ont montré que la minimisation de la durée totale (makespan) est NP-complète dans un atelier en ligne (flow shop) à trois machines ou plus, et dans un atelier en ateliers spécialisés à deux machines ou plus [14]. Pour ces problèmes, aucune méthode connue ne garantit de trouver l'optimum pour des instances de taille quelconque dans un temps raisonnable. C'est pourquoi les systèmes APS combinent règles, heuristiques et optimisation.

### 5.4 Méthodes : des règles de priorité à l'optimisation mathématique

**Les règles de priorité** (règles de dispatching) décident quelle commande en attente passe ensuite. Elles sont simples, rapides et transparentes :

| Règle | Logique | Force | Faiblesse |
|---|---|---|---|
| FIFO (premier entré, premier sorti) | premier arrivé, premier servi | équitable, simple, faible variance | ignore les dates de livraison |
| EDD (date de livraison la plus proche) | date de livraison la plus proche en premier | sur une machine, minimise le retard maximal | ignore les temps d'exécution |
| SPT (temps d'exécution le plus court) | opération la plus courte en premier | sur une machine, minimise le temps de séjour moyen | les longues tâches peuvent être indéfiniment retardées |
| CR (ratio critique) | temps restant avant la date de livraison ÷ travail restant | prend en compte la date de livraison et le travail restant | instable lorsque la replanification est fréquente |
| Marge (slack) | temps avant la date de livraison moins temps d'exécution restant, le plus petit en premier | adaptée aux commandes en plusieurs étapes | nécessite des temps restants fiables |
| Optimisée sur les changements | regroupe les tâches d'une même famille de réglages | économise le temps de changement au goulot | peut ne pas respecter les dates de livraison |

Que l'EDD minimise le retard maximal et que la SPT minimise le temps de séjour moyen sur une seule machine sont des résultats classiques de la théorie de l'ordonnancement [29].

**Exemple détaillé : trois règles, quatre commandes, une machine**

Quatre commandes attendent à une machine à l'instant 0, dans l'ordre d'arrivée A, B, C, D. Durées en heures :

| Commande | Temps d'exécution | Échéance |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Règle | Séquence | Instants de fin | Retard | Commandes en retard | Retard total | Temps de séjour moyen |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 h | (4+6+12+15)÷4 = 9,25 h |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 h | (2+5+9+15)÷4 = 7,75 h |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 h | (2+6+9+15)÷4 = 8,00 h |

Même machine, même travail, même capacité : la seule séquence détermine si une ou deux commandes sont en retard et si le retard total est de 1 ou de 8 heures. La SPT donne le temps de séjour moyen le plus court, l'EDD la meilleure performance sur les échéances. La règle « la meilleure » dépend de l'objectif visé. Dans un atelier multi-étapes avec des changements dépendant de la séquence, aucune règle unique ne suffit, et c'est là que l'APS commence à être rentable.

**Les heuristiques** fournissent rapidement des solutions de bonne qualité, mais sans garantie d'optimalité. Elles comprennent des méthodes de construction qui établissent un ordonnancement commande par commande (par exemple « goulot d'abord » : charger le goulot d'étranglement, puis aligner les autres ressources sur celui-ci) et des méthodes d'amélioration qui modifient pas à pas un ordonnancement existant.

**Les métaheuristiques**, telles que les algorithmes génétiques, le recuit simulé ou la recherche tabou, explorent l'espace des solutions de manière systématique et peuvent s'échapper des optimums locaux. Elles sont courantes dans les systèmes APS commerciaux pour l'optimisation des séquences.

**L'optimisation mathématique** formule le problème d'ordonnancement sous la forme d'un modèle comportant une fonction objectif et des contraintes, par exemple un programme linéaire en nombres mixtes (MILP) ou un modèle de programmation par contraintes (CP). Les solveurs trouvent des solutions optimales pour les problèmes de petite et moyenne taille, ou fournissent du moins une borne sur l'écart entre la solution trouvée et l'optimum. Les grands problèmes d'ordonnancement détaillé sont souvent décomposés, par exemple par fenêtre temporelle ou par groupe de ressources.

**L'intelligence artificielle** joue plusieurs rôles dans les systèmes APS : prédire les temps d'usinage et de réglage à partir des données réelles, prédire les perturbations, apprendre des politiques d'ordonnancement (par exemple par apprentissage par renforcement) et permettre une interaction en langage naturel. Les éditeurs sérieux l'utilisent pour améliorer les données d'entrée et accélérer la recherche, et non pour remplacer l'optimisation. Un ordonnancement assisté par IA ne vaut que par les données de confirmation issues de l'atelier à partir desquelles il apprend.

### 5.5 Objectifs et compromis

Un APS n'optimise jamais « l'ordonnancement » en soi ; il optimise une combinaison pondérée d'objectifs. Objectifs typiques :

- respect des délais de livraison (minimisation du retard ou du retard pondéré)
- délais courts et faible en-cours
- taux d'utilisation élevé du goulot d'étranglement
- temps de réglage faible
- peu d'heures supplémentaires et charge de travail homogène pour le personnel
- stabilité de l'ordonnancement (peu de modifications par rapport à l'ordonnancement précédent)

Ces objectifs sont en conflit. La littérature économique allemande désigne le cœur de ce conflit par le terme « dilemme de l'ordonnancement » (*Dilemma der Ablaufplanung*) : un taux d'utilisation élevé exige des files d'attente, tandis que des délais courts exigent une capacité inoccupée. La section 4.3 montre pourquoi il en est mathématiquement ainsi. L'une des tâches les plus importantes lors du déploiement d'un APS consiste donc à convenir de la pondération des objectifs avec les équipes commerciales, production et logistique.

### 5.6 Sens d'ordonnancement, ATP et CTP

La question « quels sont les types d'ordonnancement de la production ? » se ramène généralement à deux couples : capacité finie ou infinie (section 3.1) et sens d'ordonnancement :

- **Ordonnancement en avant :** les opérations sont planifiées à partir du début au plus tôt. Le résultat est la date d'achèvement au plus tôt.
- **Ordonnancement en arrière :** les opérations sont planifiées à rebours à partir de la date d'échéance. Le résultat est le début au plus tard, ce qui limite les stocks mais ne laisse aucune marge.
- **Ordonnancement basé sur le goulot :** le goulot est chargé en premier ; les opérations amont sont ensuite planifiées en arrière et les opérations aval en avant.

Deux fonctions sont particulièrement précieuses pour les ventes :

- **Available to promise (ATP) :** quelle quantité peut être promise à quelle date à partir du stock et des réceptions planifiées ?
- **Capable to promise (CTP) :** quelle date est réalisable pour une nouvelle commande en tenant compte à la fois de la matière *et* de la capacité ?

Le CTP est une fonction typique d'un APS, car il réalise un ordonnancement d'essai d'une nouvelle commande par rapport à la charge actuelle. Il transforme la promesse de date d'expédition d'une estimation en un calcul.

## 6. ERP vs APS vs MES

Les trois catégories de systèmes ne se concurrencent pas ; elles se complètent. La norme ANSI/ISA-95 place l'ERP au niveau 4 (planification d'entreprise et logistique) et la gestion des opérations de fabrication au niveau 3 ; les modèles d'activités de la partie 3 couvrent le planning de travail (appelé « détailed production schedule » dans l'édition 2005) et son exécution [31]. La directive allemande VDI 5600 partie 1 (octobre 2016), largement utilisée en Europe, va plus loin et cite explicitement la « planification détaillée et la commande détaillée » comme l'une des dix tâches d'un système d'exécution de fabrication (MES), aux côtés de la gestion des commandes, de la gestion des équipements, de la gestion des matières, de la gestion du personnel, de la collecte de données, de l'analyse des performances, de la gestion de la qualité, de la gestion de l'information et de la gestion de l'énergie [15]. En pratique, l'ordonnancement détaillé est assuré soit dans le MES, soit dans un APS autonome, soit dans un module APS de l'ERP.

| Caractéristique | ERP (module de planification) | APS | MES |
|---|---|---|---|
| Fonction principale | quantités, valeurs, matières, dates jalons | dates et séquences réalisables sous contraintes | exécution, confirmation, visibilité en temps réel |
| Horizon de planification | semaines à mois | heures à semaines, glissant | de l'équipe à la minute |
| Modèle de capacité | infinie dans sa forme de base, affichage de charge en aval | finie, de nombreuses ressources simultanément | mesure la capacité réellement utilisée |
| Granularité temporelle | jours, semaines | minutes à heures | secondes à minutes |
| Logique de planification | MRP, ordonnancement à rebours avec délais fixes | heuristiques, métaheuristiques, optimisation mathématique | règles de lancement et de répartition, parfois son propre ordonnanceur |
| Question type | Que doit-on faire pour quelle date, quelle matière manque-t-il ? | Quelle opération tourne quand, sur quelle ressource ? | Que tourne-t-il maintenant, où en est chaque ordre, pourquoi la machine est-elle à l'arrêt ? |
| Données | données de base, commandes clients et ordres planifiés | données ERP plus matrices de changement de format, calendriers, contraintes, confirmations | données machines, de production et de qualité |
| Réaction aux perturbations | prochain calcul de planification, souvent pendant la nuit | replanification en minutes, comparaison de scénarios | capture, alarme, déclenchement de replanification |
| Utilisateurs | planification des matières, achats, ventes, finance | planification de production, pilotage de production, chaîne d'approvisionnement | chefs d'équipe, opérateurs, maintenance, qualité |
| Limite | planifie sur la base d'hypothèses et non de la réalité | nécessite de bonnes données de base et des confirmations | souvent une planification à court terme et locale uniquement |

**Comment les systèmes travaillent ensemble :** L'ERP transmet à l'APS les commandes, les nomenclatures, les gammes et les stocks. L'APS ordonnance en capacité finie et renvoie des dates et des séquences réalistes, que l'ERP utilise pour les dates d'expédition et les besoins en matières. Le MES exécute la séquence en atelier et remonte vers l'APS et l'ERP les temps réels, les quantités et les perturbations. Seule cette boucle fermée rend un ordonnancement fiable. La manière de fermer le chemin entre l'ERP et l'atelier à l'aide d'un jumeau numérique est décrite dans l'article [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**Quand l'ERP suffit-il ?** Si vos commandes comportent peu d'opérations, si les changements de format dépendent peu de la séquence, si un goulot bien identifié peut être piloté par une règle de lancement simple et si la capacité est rarement tendue, un plan ERP bien entretenu complété par un tableau d'ordonnancement suffit souvent. Plus les contraintes de la section 5.2 s'appliquent, plus le cas en faveur d'un APS est net.

## 7. Théorie des contraintes, drum-buffer-rope et gestion des tampons

### 7.1 Théorie des contraintes

Eliyahu M. Goldratt a introduit la **[théorie des contraintes](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) en 1984 dans le roman d'entreprise *The Goal*, coécrit avec Jeff Cox [1]. Le message central : tout système possède au moins une contrainte qui limite son débit. Une heure perdue au goulot d'étranglement est une heure perdue pour l'ensemble du système. Une heure gagnée sur un poste qui n'est pas le goulot n'a aucune valeur tant qu'elle ne soulage pas le goulot.

Goldratt a formulé cinq étapes de focalisation, connues sous le nom de processus d'amélioration continue (POOGI) [3] :

1. **Identifier** la contrainte du système.
2. **Exploiter** la contrainte : pas de temps d'arrêt, pas de traitement de rebuts, changements de série hors du temps de goulot dans la mesure du possible.
3. **Subordonner** tout le reste à la contrainte : la libération, les tailles de lots et les séquences des autres ressources suivent le goulot.
4. **Élever** la contrainte : seulement alors ajouter des équipes, investir ou sous-traiter.
5. **Empêcher l'inertie :** si la contrainte a changé de place, revenir à l'étape 1.

L'ordre compte. De nombreuses entreprises passent directement à l'étape 4 et achètent une nouvelle machine alors que le goulot existant perd encore de la capacité à cause des temps d'arrêt, de l'attente de matière, de mauvaises séquences ou de changements de série inutiles.

### 7.2 Trouver le goulot : analyse du goulot en pratique

Le goulot n'est pas toujours la machine qui tombe le plus souvent en panne ni celle qui a le prix le plus élevé. Indicateurs éprouvés :

- **Files d'attente :** les ordres s'accumulent en permanence devant le goulot, tandis que les ressources situées en aval restent inactives.
- **Charge par rapport à la capacité :** pour chaque ressource, comparer la charge planifiée (temps de changement de série compris) à la capacité disponible sur plusieurs semaines. La ressource ayant le ratio le plus élevé est le candidat.
- **Diagrammes de débit :** là où l'en-cours reste élevé et où la courbe de production ne s'accentue toujours pas, il existe un goulot de capacité [8].
- **Interroger les experts, puis vérifier :** les superviseurs savent généralement où les choses se bloquent. Vérifier avec des données, car les goulots « ressentis » sont souvent des ressources qui tombent fréquemment en panne de façon visible.

Attention aux **goulots mobiles**. Avec un mix produits variable, le goulot peut se déplacer d'une ressource à l'autre d'une semaine à l'autre. Une gestion statique du goulot ne suffit alors plus, et un APS qui calcule la charge prévisionnelle par ressource pour le carnet de commandes en cours devient particulièrement précieux. Les goulots ne sont pas non plus toujours des machines : ce sont souvent des personnes qualifiées, des postes de contrôle, des outillages ou le service planification lui-même.

### 7.3 Drum-buffer-rope

Dans *The Race* (1986), Goldratt et Robert E. Fox ont décrit une méthode de pilotage qui traduit les cinq étapes en pilotage d'atelier : **drum-buffer-rope** (DBR) [2]. La métaphore provient de *The Goal*, où une troupe de scouts ne peut avancer qu'à la vitesse de son membre le plus lent :

- **Drum (tambour) :** le goulot fixe le rythme. Son planning est le seul planning détaillé qui doit être tenu.
- **Buffer (tampon) :** un **tampon temporel** se place devant le goulot (et devant les points d'expédition et d'assemblage où les pièces du goulot rejoignent d'autres pièces). Il protège le goulot de la variabilité en amont.
- **Rope (corde) :** la matière n'est lancée dans l'atelier qu'à la cadence à laquelle le goulot peut la traiter. La corde lie la libération au planning du goulot, décalée du temps de tampon.

**Exemple détaillé de libération en DBR :** le goulot est une opération de traitement thermique. L'ordre 4711 est planifié pour démarrer sur ce poste le jeudi à 6 h 00. Le tampon temporel devant le goulot est de 3 jours ouvrés. La matière de l'ordre 4711 est donc lancée le lundi à 6 h 00, et non plus tôt. Lancer plus tôt n'augmente que l'en-cours et, selon la loi de Little, le délai de traversée, sans ajouter de débit.

Le tampon temporel est d'abord fixé de manière pragmatique. Une valeur de départ souvent citée dans la pratique de la TOC est environ la moitié du délai actuel jusqu'au goulot [unverified: valeur souvent citée dans la littérature TOC, sans source primaire vérifiée]. Il est ensuite ajusté par la gestion des tampons.

### 7.4 Gestion des tampons

La **[gestion des tampons](https://www.m365.fm/entity/buffer-management/)** est le mécanisme de rétroaction du DBR [4]. Pour chaque ordre lancé, on suit la part de son tampon temporel déjà consommée. Une répartition en trois zones est courante :

| Zone | Tampon consommé | Signification | Réaction |
|---|---|---|---|
| Verte | jusqu'à environ un tiers | l'ordre est dans les temps | aucune action |
| Jaune | environ un à deux tiers | l'ordre se tend | identifier la cause, préparer une action |
| Rouge | plus des deux tiers | le goulot risque d'être en manque ou la date de livraison est menacée | accélérer : prioriser l'ordre, supprimer l'obstacle |

La répartition en tiers est une convention largement répandue, et non une loi naturelle. Deux avantages comptent avant tout :

1. **Priorités au quotidien :** Au lieu de nombreuses listes de priorités contradictoires, une règle unique s'applique : commandes rouges d'abord, puis jaunes, puis vertes.
2. **Amélioration systématique :** En consignant et en analysant les causes des commandes rouges, on obtient une liste de Pareto des sources de perturbation. Si de nombreuses commandes sont rouges en permanence, le tampon est trop petit ou le processus trop instable. Si presque toutes sont vertes, le tampon peut être réduit, ce qui diminue les en-cours et le délai de traversée.

La variante **DBR simplifiée** (S-DBR) destinée aux fabricants en production à la commande se passe d'un ordonnancement détaillé du goulot et s'appuie sur un tampon d'expédition ainsi que sur un contrôle de charge du goulot à l'acceptation de la commande. Elle est décrite dans le *Theory of Constraints Handbook*, aux côtés du DBR classique [4].

### 7.5 DBR et APS : opposés ou complémentaires ?

Les praticiens de la TOC se sont longtemps montrés sceptiques envers les logiciels de planification complexes, car un planning détaillé de chaque ressource devient vite obsolète lorsque surviennent des perturbations. Les systèmes APS modernes savent toutefois bien modéliser les principes du DBR : l'ordonnancement fondé sur le goulot, la mise en production avec un tampon temporel et l'affichage de l'état des tampons sont paramétrables dans de nombreux systèmes. Inversement, le DBR tire profit d'un APS lorsque le goulot se déplace, lorsque les séquences de réglage au goulot doivent être optimisées ou lorsque de nombreuses contraintes s'appliquent simultanément. La position raisonnable : le DBR fournit la philosophie de pilotage, l'APS fournit la puissance de calcul.

## 8. Briques Lean dans l'ordonnancement : takt, heijunka, équilibrage de ligne, flux tiré

La production Lean et l'APS sont souvent présentés comme des opposés : d'un côté le flux tiré et le pilotage visuel, de l'autre la planification centrale par algorithme. En pratique, ils se complètent. Le Lean stabilise le flux et réduit la variabilité ; l'APS planifie là où le flux seul ne suffit pas, par exemple en cas de forte variété de produits, de délais longs ou de ressources partagées. Pour approfondir le volet Lean, consultez le guide de m365.fm [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

### 8.1 Temps takt

Le **[temps takt](https://www.m365.fm/entity/takt-time/)** est l'intervalle auquel une unité doit être terminée pour satisfaire la demande client :

> **Temps takt = temps de travail disponible par période ÷ demande client par période**

**Exemple chiffré :** Une ligne d'assemblage fonctionne en deux équipes de 7,5 heures de temps de travail net chacune (après les pauses planifiées), soit 900 minutes par jour. La demande client est de 450 unités par jour.

- Temps takt = 900 min ÷ 450 unités = **2,0 minutes par unité** (120 secondes)

Le temps takt est une cadence de demande, non une mesure de performance. Le temps de cycle réel de chaque poste doit être inférieur à celui-ci pour que la demande soit satisfaite.

### 8.2 Équilibrage de ligne

**[L'équilibrage de ligne](https://www.m365.fm/entity/line-balancing/)** répartit le contenu de travail entre les postes de manière à ce que chaque poste reste en dessous du temps takt, avec le moins de temps d'inactivité possible. Nils Boysen, Malte Fliedner et Armin Scholl ont classé systématiquement les nombreuses variantes du problème [22].

**Exemple chiffré (suite) :** Le contenu de travail total par unité est de 9,6 minutes.

- Nombre minimal théorique de postes = 9,6 min ÷ 2,0 min = 4,8, arrondi à **5 postes**
- En raison du graphe de précédence et des éléments de travail indivisibles, **6 postes** sont nécessaires en pratique.
- Efficacité d'équilibrage = 9,6 min ÷ (6 × 2,0 min) = 9,6 ÷ 12,0 = **80 %**
- Retard d'équilibrage = 100 % − 80 % = **20 %** de la capacité de la ligne

Pour l'ordonnancement, cela signifie : avec 6 postes, la ligne couvre 450 unités par jour, mais chaque poste attend en moyenne 20 % du temps. Si la demande augmente, la ligne doit être rééquilibrée ou le temps de travail allongé.

### 8.3 Heijunka

Le **[heijunka](https://www.m365.fm/entity/heijunka/)** (japonais pour « nivellement ») est un principe central du Toyota Production System décrit par Taiichi Ohno [20]. Le Lean Enterprise Institute le définit comme le nivellement du type et de la quantité de production sur une période donnée [34]. Au lieu de lancer de grands lots d'une variante après l'autre, le mix est réparti uniformément dans le temps.

**Exemple :** Un site fabrique 200 unités de la variante A, 100 de la variante B et 100 de la variante C par semaine, sur cinq jours.

| Approche | Lundi | Mardi | Mercredi | Jeudi | Vendredi |
|---|---|---|---|---|---|
| Lot par lot | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Nivelé (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

Dans le plan nivelé, la charge de pointe sur les processus amont diminue, le stock de produits finis par variante se réduit et les clients de chaque variante peuvent être approvisionnés quotidiennement. Le prix à payer est un nombre plus élevé de changements de série. Le Heijunka exige donc des temps de préparation courts, et c'est là que le lean et l'APS se rejoignent : un APS peut calculer, au sein d'une journée, la séquence la plus favorable aux préparations pour un mix nivelé.

### 8.4 Kanban, flux tiré et CONWIP

Un **[système en flux tiré](https://www.m365.fm/entity/pull-system/)** limite les en-cours en ne lançant de nouveaux travaux que lorsqu'un consommateur aval signale un besoin. La forme la plus connue en est le **[kanban](https://www.m365.fm/entity/kanban/)** : des cartes ou des signaux électroniques entre processus déclenchent le réapprovisionnement, et le nombre de cartes plafonne le stock.

Le kanban convient aux pièces à demande régulière et à un nombre de variantes maîtrisable. Dans les ateliers à la commande et la production à faible volume et à forte diversité, il atteint ses limites, car chaque variante nécessiterait un stock. Une alternative est le **CONWIP** (constant work in process), proposé en 1990 par Mark Spearman, David Woodruff et Wallace Hopp comme alternative de flux tiré au kanban [21]. Le CONWIP ne plafonne pas le stock par pièce mais le nombre total de commandes dans une ligne : une nouvelle commande n'est lancée que lorsqu'une autre se termine. La loi de Little devient une règle de pilotage. Une méthode apparentée, issue de l'IFA à Hanovre, est la **libération des ordres orientée charge** (*belastungsorientierte Auftragsfreigabe*), qui ne libère des ordres que tant que la charge devant un poste de travail reste sous une limite ; Lödding la décrit avec le CONWIP et le contrôle du goulot comme méthodes de libération des ordres [12]. Dans la recherche anglophone, cette famille de méthodes est généralement traitée sous le nom de workload control.

**Ce que cela implique pour l'ordonnancement :** le kanban et le CONWIP décident *quand* lancer et plafonnent les en-cours. Un APS décide *quoi* fabriquer, dans quelle séquence, et si les dates sont tenables. De nombreux sites utilisent les deux : les pièces standard tournent en boucle kanban, les commandes spécifiques aux clients sont ordonnancées dans l'APS et lancées sous un plafond d'en-cours.

## 9. Taille de lot : EOQ, exemple chiffré et limites

### 9.1 Le problème de base

Chaque lot entraîne des coûts fixes de préparation, de gestion de commande et de démarrage, quelle que soit la quantité. Les gros lots répartissent ces coûts sur de nombreuses unités, mais augmentent le stock et le capital immobilisé. Les petits lots réduisent le stock, mais impliquent des préparations plus fréquentes. La **[taille de lot](https://www.m365.fm/entity/batch-size/)** est donc un compromis classique.

### 9.2 La formule classique : Harris (EOQ) et Andler

Ford Whitman Harris a publié en 1913 dans *Factory, The Magazine of Management* la formule en racine carrée de la taille économique de lot. Elle est aujourd'hui connue sous le nom de quantité économique de commande (EOQ, economic order quantity) ; Donald Erlenkotter a retracé sa paternité en 1990 [17]. Lorsque la formule est utilisée pour des lots de production plutôt que pour des commandes d'achat, les textes américains parlent souvent de taille économique de production ou de lot économique. Dans les pays germanophones, elle est connue sous le nom de **formule d'Andler**, d'après le livre de Kurt Andler paru en 1929 [18] :

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = taille de lot optimale (unités)
> D = demande par période (unités par an)
> S = coût fixe par lot, c'est-à-dire coût de préparation et de commande (« $ » par lot)
> H = coût de possession par unité et par période (« $ » par unité et par an), souvent calculé comme coût unitaire × taux de coût de possession

La formule minimise la somme des coûts de préparation (D ÷ Q × S) et des coûts de possession (Q ÷ 2 × H). À l'optimum, les deux composantes de coût sont égales.

### 9.3 Exemple chiffré

Une pièce tournée (au tour) a une demande annuelle de 12 000 unités. Une préparation coûte 300 « $ », machine et main-d'œuvre comprises. Le coût unitaire est de 40 « $ », le taux de coût de possession de 20 % par an. (L'original allemand utilise les mêmes chiffres en euros ; les nombres sont illustratifs et non convertis.)

- H = 40 « $ » × 0,20 = 8 « $ » par unité et par an
- Q* = √(2 × 12 000 × 300 ÷ 8) = √(7 200 000 ÷ 8) = √900 000 ≈ **949 unités**
- Lots par an = 12 000 ÷ 949 ≈ 12,6
- Coût de préparation par an = 12 000 ÷ 949 × 300 « $ » ≈ 3 793 « $ »
- Coût de possession par an = 949 ÷ 2 × 8 « $ » = 3 796 « $ »
- **Coût total ≈ 7 589 « $ »** par an

Dans quelle mesure le coût est-il sensible aux écarts par rapport à Q* ?

| Taille de lot | Coût de préparation (« $ »/an) | Coût de possession (« $ »/an) | Coût total (« $ »/an) | Écart par rapport à l'optimum |
|---|---|---|---|---|
| 500 | 7 200 | 2 000 | 9 200 | +21,2 % |
| 600 | 6 000 | 2 400 | 8 400 | +10,7 % |
| 949 | 3 793 | 3 796 | 7 589 | 0 % |
| 1 200 | 3 000 | 4 800 | 7 800 | +2,8 % |
| 2 000 | 1 800 | 8 000 | 9 800 | +29,1 % |

Le coût total est peu sensible autour de l'optimum : une taille de lot environ un quart plus grande coûte moins de 3 % de plus. En pratique, on peut arrondir les tailles de lot à des valeurs pratiques, comme des quantités de conteneur ou la demande journalière, sans pénalité de coût significative.

**Le temps de changement est le levier le plus important :** si la réduction du temps de changement divise par deux le coût de lancement, de 300 $ à 150 $, la taille de lot optimale tombe à √(2 × 12 000 × 150 ÷ 8) ≈ **671 unités**. Le coût total baisse à environ 5 367 $ par an, soit environ 29 % de moins, car le coût total à l'optimum est proportionnel à la racine carrée de S. Le stock moyen de cycle baisse également d'environ 29 %. Les méthodes de réduction des temps de changement, comme le SMED (changement d'outil en moins de dix minutes, *single-minute exchange of die*), sont donc rentables à double titre. Pour en savoir plus, consultez la page d'entité [Temps de changement](https://www.m365.fm/entity/setup-time/).

### 9.4 Limites de la formule de Wilson (EOQ)

La formule est un point de départ utile, mais ses hypothèses sont rarement vérifiées sur le terrain :

- **Demande constante et connue :** la demande réelle fluctue et est incertaine.
- **Capacité illimitée :** la formule ignore que les changements consomment de la capacité au goulot d'étranglement. Au goulot, une heure de changement est une heure de débit perdue ; à un poste non goulot, son coût est presque nul. La TOC (théorie des contraintes) en conclut que les lots devraient tendre à être plus grands au goulot et plus petits aux postes non goulots.
- **Produit unique, sans interactions :** plusieurs produits partagent les mêmes machines ; les changements dépendant de la séquence ne sont pas modélisés.
- **Production instantanée :** dans sa forme de base, la totalité du lot est disponible d'un coup. Pour un taux de production fini, il existe une formule étendue (quantité économique de production) dans laquelle les coûts de possession sont pondérés par le facteur (1 − taux de demande ÷ taux de production).
- **Aucun effet sur le délai :** les grands lots allongent le délai de toutes les commandes suivantes sur la même machine et augmentent la variabilité. Cet effet n'est pas pris en compte dans le calcul des coûts.
- **Taux de coûts difficiles à déterminer :** le coût de lancement et le taux de coût de possession sont souvent des valeurs imputées, laissant une grande marge d'appréciation.

Pour une demande dynamique, il existe des méthodes comme l'algorithme de Wagner-Whitin et des heuristiques comme l'équilibrage parties-périodes (*part-period balancing*) et Silver-Meal. Un APS (planification avancée et ordonnancement) va plus loin : il décide conjointement des tailles de lot et de la séquence, en tenant compte de la capacité, des matrices de changement et des dates d'échéance.

## 10. Stock de sécurité : formule et exemple chiffré

### 10.1 À quoi sert le stock de sécurité

Le **[stock de sécurité](https://www.m365.fm/entity/safety-stock/)** protège contre deux incertitudes : la variation de la demande pendant le délai de réapprovisionnement et la variation du délai lui-même. Ce n'est pas un remède à une mauvaise planification, mais une assurance délibérément payée contre l'aléa.

### 10.2 Formule pour une demande variable

Si la demande journalière suit approximativement une loi normale et que le délai de réapprovisionnement est constant [19] :

> **SS = z × σ_D × √L**
>
> SS = stock de sécurité (unités)
> z = facteur de sécurité tiré de la loi normale centrée réduite pour le niveau de service visé
> σ_D = écart type de la demande journalière (unités)
> L = délai de réapprovisionnement (jours)

Le niveau de service utilisé ici est le **taux de service de cycle** (probabilité qu'il n'y ait pas de rupture pendant un cycle de réapprovisionnement, appelé niveau de service α dans les textes allemands). Il ne se confond pas avec le **taux de service en quantité** (part de la quantité demandée livrée immédiatement depuis le stock, le niveau de service β). Les confondre conduit à un dimensionnement systématiquement erroné des stocks.

**Exemple chiffré :** une pièce achetée est consommée en moyenne à raison de 100 unités par jour ; l'écart type est de 30 unités par jour. Le délai de réapprovisionnement est de 9 jours ouvrés.

| Taux de service de cycle | z | Calcul | Stock de sécurité |
|---|---|---|---|
| 90 % | 1,282 | 1,282 × 30 × √9 = 1,282 × 30 × 3 | ≈ 115 unités |
| 95 % | 1,645 | 1,645 × 30 × 3 | ≈ 148 unités |
| 99 % | 2,326 | 2,326 × 30 × 3 | ≈ 209 unités |

Passer de 95 % à 99 % coûte plus de 40 % de stock de sécurité en plus. Les niveaux de service élevés deviennent disproportionnellement coûteux.

### 10.3 Formule pour une demande et un délai variables

Si le délai varie également, la formule est étendue [19] :

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = demande journalière moyenne, σ_L = écart type du délai (jours)

**Exemple chiffré (suite) :** le fournisseur livre en 9 jours en moyenne, mais avec un écart type de 2 jours.

- L × σ_D² = 9 × 30² = 8 100
- d² × σ_L² = 100² × 2² = 40 000
- √(8 100 + 40 000) = √48 100 ≈ 219,3
- SS (95 %) = 1,645 × 219,3 ≈ **361 unités**

Le stock de sécurité passe de 148 à 361 unités, soit près de deux fois et demie plus, uniquement à cause du délai d'approvisionnement peu fiable. La variation du délai d'approvisionnement explique environ 83 % de la variance ici. Améliorer le taux de livraison à la date prévue du fournisseur réduit souvent davantage le stock que toute amélioration des prévisions.

### 10.4 Limites de la formule

- La loi normale s'adapte mal à une demande intermittente (de nombreuses périodes sans consommation). D'autres lois de probabilité ou la simulation sont alors plus appropriées.
- La formule suppose une demande indépendante. Pour les pièces à demande dépendante issues des nomenclatures, le stock de sécurité n'est généralement pas le bon outil ; un délai de sécurité ou des tampons placés à des points ciblés donnent de meilleurs résultats.
- Un stock de sécurité qui est consommé en permanence n'est pas un stock de sécurité mais une erreur de planification. Vérifiez régulièrement la fréquence et les causes de ces dépassements.

## 11. Indicateurs de performance de la planification de production

Sans indicateurs de performance (KPI), vous ne pouvez ni démontrer la valeur d'un APS ni améliorer la planification. Définissez chaque KPI sans ambiguïté avant le déploiement et mesurez une situation de référence. Un guide séparé de m365.fm sur les [indicateurs de performance industriels](https://www.m365.fm/en/learn/manufacturing-kpis/) couvre l'ensemble plus large.

| KPI | Formule | Ce qu'il indique | Pièges |
|---|---|---|---|
| Livraison complète à la date prévue (OTIF) | lignes livrées à temps et complètes ÷ toutes les lignes échues | vision client | définir la référence : date demandée ou date confirmée ; fixer une fenêtre de tolérance |
| Livraison à la date prévue (OTD) | lignes livrées à temps ÷ toutes les lignes échues | comme l'OTIF mais sans le critère de quantité | les expéditions partielles faussent le constat |
| Délai de fabrication (temps de cycle de production) | achèvement moins lancement (par ordre), moyenne et dispersion | vitesse de flux | la moyenne ne suffit pas ; la dispersion détermine la fiabilité des dates d'expédition |
| Facteur de flux | délai moyen ÷ temps d'opération moyen | combien de temps un ordre attend par rapport au temps où il est travaillé [8] | utiliser la même unité de temps (heures ouvrées ou heures calendaires) |
| Encours (work in process, WIP) | nombre ou contenu de travail des ordres lancés non terminés | facteur du délai selon la loi de Little | mesurer en heures de contenu de travail, pas seulement en unités |
| Taux d'utilisation | temps occupé ÷ temps disponible | usage de la capacité | un taux élevé sur des postes non goulots n'est pas un succès |
| Taux d'utilisation du goulot | temps productif au goulot ÷ temps disponible au goulot | le KPI d'utilisation le plus important selon la TOC | présenter séparément le temps de réglage et le temps d'inactivité au goulot |
| Taux de réglage | temps de réglage ÷ (temps de réglage + temps d'usinage) | capacité perdue lors des changements de série | particulièrement critique au goulot |
| Efficacité globale des équipements (TRS / OEE) | disponibilité × performance × qualité | efficacité d'une machine | adapté aux équipements, pas à l'évaluation d'un planning |
| Respect du planning | opérations démarrées ou terminées selon le planning ÷ toutes les opérations planifiées | le planning est-il réaliste et stable ? | définir une tolérance, par exemple ± 1 poste |
| Stabilité du planning | opérations modifiées dans l'horizon gelé ÷ toutes les opérations | nervosité de la planification | trop de changements indiquent des données de mauvaise qualité ou une zone gelée absente |
| État des tampons | part des ordres en rouge, jaune et vert | alerte précoce dans la gestion par tampons | significatif seulement si les tampons sont définis |

**Exemple détaillé, performance de livraison :** En octobre, 480 lignes de commande étaient dues à leur date confirmée. 432 ont été expédiées à temps ; parmi celles-ci, 410 ont aussi été expédiées complètes.

- Livraison à la date prévue = 432 ÷ 480 = **90,0 %**
- OTIF = 410 ÷ 480 ≈ **85,4 %**

**Exemple détaillé, taux de réglage et facteur de flux :** Sur une semaine, le goulot a consacré 18 heures aux réglages et 62 heures à l'usinage. Taux de réglage = 18 ÷ (18 + 62) = **22,5 %**. Un ordre dont le temps d'opération est de 6 heures a passé 120 heures ouvrées (15 jours de 8 heures) dans l'atelier. Facteur de flux = 120 ÷ 6 = **20** : l'ordre est resté dans l'atelier vingt fois plus longtemps que le temps pendant lequel quelqu'un a travaillé dessus.

**Ensemble de KPI pour un déploiement d'APS :** Au minimum, mesurez l'OTIF, le délai de fabrication (moyenne et dispersion), l'encours et le taux d'utilisation du goulot avant la mise en service, puis mensuellement ensuite. Ces quatre indicateurs sont liés par la loi de Little et les courbes de fonctionnement ; ensemble, ils montrent si un meilleur planning a conduit à un meilleur flux.

## 12. Jumeau numérique et simulation

**La simulation** modélise un système de production et l'exécute dans le temps. La directive allemande VDI 3633 partie 1 couvre les principes de la simulation des systèmes logistiques, des flux de matières et de production [16]. La simulation répond à des questions qu'un calcul de capacité statique ne peut pas traiter, car elle prend en compte l'aléa, les perturbations et les interactions : quel est l'effet d'une panne machine sur les dates d'expédition des deux prochaines semaines ? Que rapporte une troisième équipe au goulot d'étranglement ? Comment un nouveau mix produit modifie-t-il les délais de fabrication ?

Un **jumeau numérique de production** va plus loin : c'est un modèle synchronisé en continu avec les données de l'ERP, du MES et des machines. Pour l'ordonnancement de la production, il remplit trois fonctions :

1. **Base de planification :** l'APS ordonnance sur un modèle qui reflète en temps réel les ressources, les contraintes et l'état réel.
2. **Analyse de scénarios :** avant une décision, comme accepter une commande urgente ou réaliser un investissement, les alternatives sont simulées et comparées sur les KPI.
3. **Boucle d'apprentissage :** les écarts entre le plan et le flux réel remontent et améliorent les temps standards et les contraintes.

Distinguez un modèle de simulation construit une fois pour une étude d'un jumeau maintenu en continu et utilisé en exploitation. Le second apporte davantage de valeur, mais exige une intégration de données stable et une responsabilité claire pour la maintenance du modèle. La manière de relier les données de l'ERP, le jumeau et l'atelier est présentée dans l'article [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Le guide m365.fm [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) va plus loin ; le volet cloud et données est traité dans [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

**Cartographie du flux de valeur d'abord :** avant de modéliser un jumeau ou un APS, cartographiez le flux de valeur. Elle montre où se trouvent les stocks, où le goulot d'étranglement est présumé et quels flux d'information pilotent aujourd'hui la planification. Voir le guide [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 13. Comment choisir un logiciel d'ordonnancement de production : critères et checklist

### 13.1 Avant la présélection : clarifier les objectifs et le point de départ

Que vous recherchiez « logiciel d'ordonnancement de production », « logiciel APS », « logiciel d'ordonnancement à capacité finie » ou « logiciel de planification de capacité », ce qui compte en fabrication, c'est qu'un système ordonnance la capacité comme finie et avec vos contraintes réelles. Beaucoup d'outils qui se classent sur ces termes sont des outils de gestion de projet ou de planification des ressources d'équipe. Ils sont utiles pour les projets, mais ne modélisent généralement ni les gammes, ni les temps de changement dépendant de la séquence, ni la disponibilité des matières. Les listes de « meilleur logiciel d'ordonnancement de production » sur google.com mélangent les deux catégories : vérifiez donc chaque candidat par rapport au tableau des contraintes de la section 5.2.

Avant de parler aux éditeurs, répondez à trois questions :

1. **Quel problème faut-il résoudre ?** Par exemple : faire passer l'OTIF de 78 % à plus de 90 %, réduire de moitié le délai de fabrication, diminuer l'effort de planification, donner des dates d'expédition fiables dès la saisie de la commande.
2. **Quelles contraintes comptent réellement ?** Parcourez le tableau de la section 5.2 et marquez ce qui s'applique dans votre site.
3. **Quelle est la qualité de vos données ?** Vérifiez les gammes, les temps standards et la qualité des déclarations avant la sélection (section 14).

### 13.2 Critères de sélection

| Critère | Question à poser | Pondération (exemple) |
|---|---|---|
| Modélisation des contraintes | Le système modélise-t-il toutes les contraintes pertinentes sans code spécifique ? | élevée |
| Qualité de l'ordonnancement | Quelle est la qualité des plannings sur *vos* données, mesurée selon vos objectifs ? | élevée |
| Temps de calcul | Combien de temps faut-il pour un replanification complète avec un volume de données réaliste ? | moyenne à élevée |
| Ordonnancement interactif | Les planificateurs peuvent-ils glisser-déposer des ordres, et le système vérifie-t-il immédiatement les conséquences ? | élevée |
| Explicabilité | Les planificateurs peuvent-ils voir pourquoi un ordre est placé à cet endroit ? | élevée |
| Scénarios et simulation | Peut-on calculer des variantes en parallèle et les comparer sur des KPI ? | moyenne |
| Intégration ERP | Existe-t-il des connecteurs standard vers votre ERP, dans quel sens, à quelle fréquence ? | élevée |
| Intégration MES et déclaration de production | Comment les réalisés parviennent-ils à l'APS, et à quelle vitesse ? | élevée |
| Ergonomie | Les planificateurs et les superviseurs acceptent-ils l'interface ? | élevée |
| Évolutivité | Plusieurs sites, davantage de ressources, davantage d'ordres ? | moyenne |
| Exploitation et sécurité | Cloud ou sur site, région d'hébergement, certifications (par exemple ISO/IEC 27001, SOC 2), modèle de rôles et de droits, adéquation avec votre cadre de sécurité (par exemple NIST CSF 2.0 [35]) ; pour les fournisseurs de la défense américaine, exigences CMMC applicables aux données concernées [36] | moyenne |
| Éditeur et partenaires | Expérience dans l'industrie, références de production comparable, support, feuille de route | moyenne |
| Coût total de possession | Licences, mise en œuvre, nettoyage des données, formation, exploitation sur 5 ans | moyenne |

**Et le prix ?** Les tarifs de cette catégorie vont des abonnements SaaS par utilisateur pour les outils simples aux devis d'entreprise pour les APS multi-sites, et la plupart des éditeurs d'APS ne publient aucun tarif public. Les annuaires de logiciels qui ressortent sur le terme principal montrent le même schéma : beaucoup de fiches indiquent « tarif sur demande », et au moins un annuaire de classement affiche encore des données tarifaires collectées en 2019. Comparez le coût total de possession sur cinq ans, y compris l'effort interne pour le nettoyage des données et l'intégration, plutôt que le seul prix de la licence.

### 13.3 Liste de contrôle pour le choix

Utilisez cette liste comme aide-mémoire pour les rendez-vous avec les éditeurs et les tests de preuve de concept :

- [ ] Les objectifs et les KPI avec leurs valeurs de référence sont documentés.
- [ ] Les contraintes pertinentes sont hiérarchisées (impératif, souhaitable, facultatif).
- [ ] Un jeu de données de test représentatif, avec des ordres, gammes et temps de changement réels, est prêt.
- [ ] Chaque éditeur ordonnance le **même** jeu de données de test ; les résultats sont comparés sur les mêmes KPI.
- [ ] Un scénario de perturbation a été testé (panne machine, commande urgente, matière en retard).
- [ ] Le temps de calcul d'une replanification complète a été mesuré.
- [ ] Vos propres planificateurs ont travaillé avec le système en pratique, et pas seulement assisté à une démonstration.
- [ ] L'interface ERP est spécifiée (objets, sens, fréquence, gestion des erreurs).
- [ ] Le chemin de déclaration depuis l'atelier est défini (MES, terminal, application mobile).
- [ ] Le système explique ses décisions d'ordonnancement d'une manière que les planificateurs peuvent suivre.
- [ ] Les rôles et les droits peuvent être modélisés (qui peut ordonnancer, libérer, figer ?).
- [ ] Au moins une référence avec un type de production comparable a été interrogée en face à face.
- [ ] Le coût total sur cinq ans est calculé, y compris l'effort interne.
- [ ] La protection des données, l'hébergement et la sécurité de l'information sont validés avec la DSI (et, pour les travaux de défense, avec le responsable de la conformité CMMC).
- [ ] Une option de sortie (export des données, durée du contrat) est clarifiée.

**Conseil :** Le test le plus révélateur est un **pilote avec vos propres données**. Les démonstrations des éditeurs sur des données d'exemple propres en disent peu sur la façon dont un système gère vos gammes incomplètes et vos cas particuliers.

## 14. Exigences en matière de données et qualité des données de référence

Un APS calcule avec précision, y compris à partir de données erronées. Un planning fondé sur des temps standard erronés de 30 % est précisément faux. La qualité des données est donc la cause la plus fréquente des retards des projets APS par rapport au calendrier prévu.

| Objet de données | Exigence minimale | Lacunes typiques | Comment vérifier |
|---|---|---|---|
| Gammes | séquence d'opérations complète, groupe de postes de travail correct | opérations manquantes, ressources obsolètes | comparer des échantillons avec le flux réel de l'atelier |
| Temps standards (usinage) | écart par rapport aux réalisés dans une plage de tolérance définie | standards issus de la comptabilité analytique au lieu de la mesure | prévu vs réalisé à partir des déclarations |
| Temps de réglage | dépendants de la séquence lorsque c'est pertinent (matrice de changements de série) | un seul temps de réglage forfaitaire par opération | analyser les journaux de réglage |
| Ressources et calendriers | modèles d'équipes, pauses, fenêtres de maintenance, arrêts d'usine | calendriers non tenus à jour dans l'ERP | comparer avec le planning des équipes |
| Ressources alternatives | alternatives autorisées avec facteur de performance | connues uniquement des superviseurs | entretiens, puis saisie dans le système |
| Main-d'œuvre et compétences | matrice de compétences, planification des présences | non disponibles sous forme numérique | établir une matrice de compétences |
| Outillages et gabarits | nombre, affectation aux opérations | non modélisés comme ressource | rapprocher de la liste des outils |
| Stocks et dates d'approvisionnement | stock exact, dates de livraison fiables | retards de saisie des mouvements, dates de livraison non confirmées | écarts d'inventaire tournant, respect des délais fournisseurs |
| Déclarations | rapides, par opération, avec quantité et temps | déclaration par lot en fin d'équipe, ou aucune déclaration | mesurer le taux de déclaration et le retard |
| Ordres et priorités | dates d'échéance claires, priorité client | dates avancées « par précaution » | examiner l'historique des dates d'échéance |

**Règle empirique pour l'ordre de traitement :** commencez par le goulot d'étranglement. Si les gammes, les temps standards et les temps de réglage des ressources goulots sont corrects, le planning est déjà nettement meilleur qu'auparavant, même si les postes non goulots comportent encore des imprécisions. Remontez ensuite le flux matière.

**Les déclarations sont la clé :** sans déclarations rapides depuis l'atelier, l'APS ignore où se trouve un ordre et planifie sur la base d'un état qui n'existe plus. Tout aussi important : seules les déclarations permettent la comparaison prévu/réalisé qui améliore les temps standards au fil du temps.

## 15. Feuille de route de mise en œuvre de l'APS

La feuille de route ci-dessous décrit des phases éprouvées. Les durées sont des valeurs indicatives pour une usine mono-site de taille moyenne et dépendent fortement de la qualité des données, de l'effort d'intégration et des ressources du projet [unverified: aucune étude solide sur la durée de mise en œuvre n'a été trouvée].

| Phase | Contenu | Résultat | Valeur indicative |
|---|---|---|---|
| 1. Diagnostic | objectifs, KPI avec valeurs de référence, flux de valeur et goulots, contraintes, qualité des données | cahier des charges, constats sur les données, business case | 4 à 8 semaines |
| 2. Sélection | longue liste de fournisseurs, jeu de données de test, preuve de concept, références clients | décision sur le système, contrat | 6 à 12 semaines |
| 3. Nettoyage des données | gammes, temps standards et temps de réglage, calendriers, compétences ; en commençant par le goulot | données de base planifiables | en parallèle des phases 2 et 4, souvent le bloc le plus long |
| 4. Modélisation et intégration | modèle de ressources, contraintes, pondération des objectifs, interfaces ERP et MES | modèle d'ordonnancement opérationnel | 8 à 16 semaines |
| 5. Pilote | un secteur, idéalement incluant le goulot ; fonctionnement parallèle avec l'ancien processus | preuve de la qualité d'ordonnancement, acceptation par les utilisateurs | 6 à 12 semaines |
| 6. Déploiement | autres secteurs, arrêt de l'ordonnancement parallèle, règles de lancement, horizon gelé | exploitation en production | dépend du périmètre |
| 7. Amélioration continue | prévu vs réalisé, maintien des temps standards, analyse des causes des stocks tampons, revue des KPI | un système de planification qui apprend | en continu |

**Facteurs de réussite à toutes les phases :**

- **Impliquer les planificateurs dès le premier jour.** Un APS auquel les planificateurs ne font pas confiance est contourné, et la feuille Excel perdure.
- **Fixer les règles de planification avant le logiciel.** Qui peut modifier les priorités ? Quelle est la durée de l'horizon gelé ? Quelle règle régit le lancement ?
- **Commencer petit, apprendre vite.** Un pilote sur le goulot montre en quelques semaines si les données et le modèle tiennent.
- **Mesurer le succès.** Sans valeurs de référence, la valeur ne peut pas être démontrée, et la discussion du projet devient une question d'opinion.
- **Associer l'atelier.** Un ordonnancement n'est utile que s'il parvient à l'atelier sous forme de tâches, et que les confirmations remontent. Pour les routines quotidiennes qui rendent cela possible, consultez le guide [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 16. Erreurs courantes et comment les éviter

| Erreur | Conséquence | Mieux |
|---|---|---|
| Considérer l'APS comme un substitut à l'amélioration des processus | des processus instables sont simplement ordonnancés plus précisément | stabiliser d'abord les réglages, les pannes et les lancements, ordonnancer en parallèle |
| Modéliser toutes les contraintes en même temps | le projet dérape, le modèle devient incompréhensible | commencer par les contraintes qui agissent sur le goulot |
| Reprendre les temps standards du service calcul des coûts | les ordonnancements sont systématiquement trop optimistes ou trop pessimistes | utiliser les réalisés issus des confirmations et les mettre à jour régulièrement |
| Ordonnancer chaque ressource à son taux d'utilisation maximal | longues files d'attente, délais de livraison erratiques | charger pleinement le goulot, laisser des marges sur les non-goulots |
| Absence d'horizon gelé | replanifications constantes, nervosité à l'atelier | définir une zone gelée, par exemple les 1 à 3 prochaines équipes |
| Lancement sans plafond d'en-cours (WIP) | syndrome du temps de cycle, accumulation de stocks | lancer en fonction du goulot ou sous plafond d'en-cours |
| Augmentation généralisée des délais planifiés lorsque les commandes sont en retard | des lancements anticipés augmentent les en-cours et les retards | traiter les causes au niveau du goulot, maîtriser les lancements |
| Objectifs non partagés | ventes, production et logistique jugent l'ordonnancement différemment | convenir et documenter ensemble la pondération des objectifs |
| Planificateurs non impliqués | le système est contourné, l'ordonnancement parallèle subsiste | impliquer les planificateurs dans la sélection, la modélisation et le pilote |
| Confirmations uniquement en fin d'équipe | l'APS ordonnance sur la base d'un état périmé | confirmation en temps utile pour chaque opération |
| Succès non mesuré | la valeur reste une affirmation | collecter les valeurs de référence avant la mise en service |
| Optimisation en boîte noire | les planificateurs ne comprennent pas l'ordonnancement et ne lui font pas confiance | choisir un système dont les décisions d'ordonnancement sont explicables |

**Gains rapides sans nouveau logiciel :** si vous voulez commencer dès demain, cinq étapes ne nécessitent aucun investissement :

1. Pendant les huit dernières semaines, comparez la charge et la capacité de chaque ressource et désignez le goulot d'étranglement.
2. Comptez les en-cours (WIP) et utilisez la loi de Little pour calculer le délai de fabrication moyen. Si celui-ci diffère nettement des délais planifiés dans l'ERP, vous comprenez pourquoi les dates ne sont pas tenues.
3. Définissez une règle de lancement : les nouvelles commandes n'entrent en atelier que lorsque la file d'attente devant le goulot d'étranglement est inférieure à une limite définie.
4. Au niveau du goulot d'étranglement, priorisez selon la date d'échéance et la famille de réglage, et non selon celui qui crie le plus fort.
5. Comparez les temps standards et les temps de réglage au goulot d'étranglement avec les temps réels, et corrigez les écarts les plus importants.

## 17. Preuves : ce que rapportent les études et les utilisateurs

**La théorie des contraintes dans la littérature :** Victoria Mabin et Steven Balderstone ont analysé plus de 80 mises en œuvre réussies de la TOC, dont les résultats quantitatifs sont publiés dans la littérature [5]. Selon la synthèse de Roberto Panizzolo, ces cas font état d'améliorations moyennes de 70 % du délai entre la commande et la livraison, de 65 % du temps de cycle de fabrication, de 49 % des stocks, de 63 % du débit ou du chiffre d'affaires, et de 44 % de la performance en matière de respect des dates d'échéance [6]. Ces chiffres doivent être lus avec prudence : seules des réussites publiées ont été analysées, et aucun échec n'a été relevé dans la littérature [5]. Il s'agit d'une sélection positive, et non de la moyenne attendue pour une mise en œuvre quelconque. La tendance des résultats reste néanmoins cohérente avec la loi de Little et les courbes de fonctionnement : moins d'en-cours avec un goulot d'étranglement protégé signifie des délais plus courts.

**Retours d'utilisateurs des éditeurs d'APS :** Les éditeurs publient de nombreux exemples de cas. L'éditeur allemand de MES MPDV, par exemple, indique pour son client VACOM, qui planifie environ 1 200 ordres avec jusqu'à 20 opérations chacun, une économie de temps de planification d'environ 50 % [30]. De tels chiffres sont des affirmations des éditeurs, sans méthode de mesure divulguée. Ils montrent quels effets sont possibles, mais ne remplacent pas un pilote avec vos propres données. Il en va de même pour les chiffres de cas figurant sur les pages des éditeurs américains qui se positionnent sur « logiciel d'ordonnancement de production ».

**L'aérospatiale comme cas extrême :** La fabrication aérospatiale combine de longs délais, des zones d'assemblage à surface limitée, des exigences de compétences et de certification, et une traçabilité complète. L'ordonnancement y doit protéger non seulement les dates, mais aussi les dossiers. Les exigences en matière de délai et de traçabilité sont décrites dans l'article [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). Un guide complet : [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

**Ce qui se généralise :** Dans les études et les rapports, trois schémas reviennent. Premièrement, l'essentiel du bénéfice ne vient pas de l'algorithme mais de la transparence sur la capacité et le goulot d'étranglement. Deuxièmement, les plafonds de WIP et le lancement contrôlé produisent des effets rapidement et à faible coût. Troisièmement, la pérennité des résultats dépend du maintien des confirmations en atelier et de la comparaison entre le plan et le réalisé.

## 18. Planification sous contraintes avec iFAKT Polaris

> **Note : l'auteur travaille chez iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), dont le siège se trouve à Stuttgart, en Allemagne, développe la famille de logiciels [iFAKT Polaris](https://www.m365.fm/entity/polaris/). Selon le site web de l'entreprise, Polaris relie les données ERP à un jumeau numérique de la production et présente comme fonctions la planification sous contraintes (ressources, compétences, équipes, stocks tampons), les simulations « what-if » pour les perturbations et les changements de mix, ainsi qu'un cockpit KPI avec délai de traversée, en-cours (WIP), taux d'utilisation et taux de respect des délais [28]. Le site cite comme secteurs l'aérospatial, l'automobile, la construction mécanique et l'automatisation, ainsi que l'énergie et les infrastructures [28]. Deux modules sont pertinents pour les thèmes de ce guide :

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)** : selon la page du fournisseur, il crée à partir des données ERP, de la disponibilité des ressources et des contraintes opérationnelles un planning de production optimisé et exécutable [26]. Fonctionnalités listées :

- ordonnancement automatique des machines, des employés et des outillages, en tenant compte des équipes, des zones, des compétences et des capacités
- détection des goulots d'étranglement, priorisation des commandes et visibilité des commandes en retard et des risques de livraison
- analyse d'impact et réoptimisation après perturbations, y compris à partir des retours du terrain
- un module d'optimisation des tailles de lot qui détermine les tailles de lot par variante et par machine, une séquence optimisée en temps de changement de série, et des niveaux de stock qui équilibrent le coût de stockage et la disponibilité pour la livraison
- prise en charge de la planification opérationnelle à court terme et de la prévision de capacité à long terme

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** : selon la page du fournisseur, il reprend les plannings optimisés et les transmet sous forme de tâches datées aux opérateurs et aux chefs d'équipe sur le terrain [27]. Sont listés : une vue individuelle des tâches par opérateur, la visibilité du chemin critique pour les chefs d'équipe, des instructions de travail intégrées aux tâches, la possibilité de mettre en pause, de bloquer ou de signaler des tâches avec un retour structuré, ainsi qu'une vue WIP en temps réel pour les planificateurs. Les retours sur l'avancement, les retards et les perturbations remontent dans la planification [27].

Les fonctions décrites répondent donc à deux points que ce guide identifie comme critiques : l'ordonnancement face aux contraintes réelles (section 5.2) et la boucle fermée entre planification, exécution et retour d'information (sections 6 et 14). iFAKT GmbH affiche sur son site les certifications ISO 9001 et ISO/IEC 27001 [27]. Les pages produit ne donnent ni nombre de clients ni résultats chiffrés avec méthode communiquée [26][27]. Toutes les affirmations sur les capacités ci-dessus sont des déclarations du fournisseur.

**Perspective :** Polaris est l'une des nombreuses solutions du marché. Évaluez-la comme tout autre système, à l'aide de la liste de contrôle de la section 13.3 et d'un pilote avec vos propres données. Un guide dédié, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/), est en préparation.

## 19. Glossaire

| Terme | Explication |
|---|---|
| APS (advanced planning and scheduling) | logiciels et méthodes de planification et d'ordonnancement à capacité finie et disponibilité des matières, avec optimisation |
| ATP (available to promise) | quantité pouvant être promise à partir du stock et des réceptions planifiées |
| Buffer management | pilotage fondé sur la consommation des tampons temporels par zones (verte, jaune, rouge) |
| Matrice de changement | tableau des temps de réglage dépendant de la séquence entre variantes |
| CONWIP | pilotage en flux tiré avec un nombre total constant d'ordres dans une ligne |
| CTP (capable to promise) | date d'expédition réalisable compte tenu des matières et de la capacité |
| CRP (capacity requirements planning) | étape de planification de capacité dans le MRP II ; elle montre la charge sans résoudre les surcharges |
| Temps de cycle (loi de Little) | durée passée par un ordre dans le système, de son lancement à son achèvement ; voir [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Ordonnancement détaillé | ordonnancement des opérations individuelles sur les ressources, avec séquence et temps (allemand : *Feinplanung*) |
| Drum-buffer-rope (DBR) | pilotage TOC : le goulot fixe le rythme, un tampon temporel le protège, le lancement lui est lié |
| EOQ (economic order quantity) | formule de taille de lot à racine carrée de Harris (1913) ; appelée formule d'Andler dans les textes allemands |
| Ordonnancement à capacité finie | ordonnancement dans lequel aucune capacité planifiée ne dépasse la capacité disponible (ISA-95) |
| Facteur de flux | rapport entre le délai de traversée et le temps opératoire |
| Zone gelée | horizon de planification figé dans lequel aucune replanification n'intervient |
| Heijunka | lissage du volume et du mix dans le temps |
| Syndrome du délai de traversée | cercle vicieux : allongement des délais planifiés, lancement anticipé, plus d'en-cours et délais encore plus longs |
| Loi de Little | temps de cycle = en-cours ÷ débit |
| Taille de lot | quantité produite sans interruption par un réglage ; voir [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | système d'exécution, de collecte de données et de pilotage d'atelier (ISA-95 niveau 3 ; VDI 5600) |
| MPS (master production schedule) | programme de production des produits finis |
| MRP (material requirements planning) | planification des matières par éclatement de la nomenclature avec délais planifiés |
| MRP II (manufacturing resource planning) | extension du MRP intégrant la planification directrice, la capacité et la planification financière |
| OTIF (on time in full) | part des lignes livrées à l'heure et complètes |
| PPC | planification et pilotage de la production (allemand : PPS) |
| Temps de réglage | temps nécessaire pour faire passer une ressource d'un ordre à un autre ; voir [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Stock de sécurité | stock détenu pour se protéger contre les variations de demande et de délai |
| Takt time | temps disponible ÷ demande client |
| Goulot d'étranglement (contrainte) | ressource qui limite le débit de l'ensemble du système |
| TOC (theory of constraints) | approche de management qui aligne le système sur sa contrainte |
| WIP (work in process) | ordres lancés et non encore achevés sur l'atelier |

## 20. FAQ : logiciel de planification de production et APS

### Qu'est-ce qu'un logiciel de planification de production ?

Un logiciel de planification de production détermine quelle opération s'exécute sur quelle machine ou quel poste de travail, dans quel ordre et à quel moment. Les bons outils planifient en tenant compte d'une capacité finie et de contraintes réelles telles que les équipes, les compétences, les outils et les changements de série dépendant de l'enchaînement. Beaucoup d'outils vendus sous ce nom sont en réalité des planificateurs de projets ou de ressources ; pour l'industrie manufacturière, vérifiez s'ils modélisent les gammes, les changements de série et la disponibilité des matières.

### Qu'est-ce qu'un système APS ?

Un APS (advanced planning and scheduling, planification et ordonnancement avancés) est un logiciel de planification qui ordonnance les ordres de fabrication en fonction de la capacité finie des machines, des personnes et des outils, ainsi que de la disponibilité des matières. Il établit des séquences et des dates réalisables à l'aide d'heuristiques et d'optimisation mathématique.

### Quelle est la différence entre APS et MRP ?

Le MRP calcule quelles matières sont nécessaires et quand, en éclatant les nomenclatures et en remontant à partir de délais de fabrication planifiés fixes. Dans sa forme de base, il suppose une capacité illimitée. L'APS ordonnance les opérations en tenant compte à la fois de la capacité finie et des matières, de sorte que ses dates sont réalisables. Le MRP répond à la question « de quoi avons-nous besoin ? », l'APS à la question « que pouvons-nous réellement fabriquer, et quand ? ».

### Quelle est la différence entre APS et ERP ? L'APS remplace-t-il l'ERP ?

Non, l'APS ne remplace pas l'ERP. L'ERP est le système de référence pour les commandes, les matières, les stocks et la finance. Sa logique de planification (MRP) suppose, dans sa forme de base, une capacité illimitée et des délais fixes. Un APS ajoute l'ordonnancement en fonction de la capacité réelle et des contraintes, et renvoie à l'ERP des dates réalistes.

### Quelle est la différence entre APS et MES ?

Un APS planifie ce qui doit être exécuté, quand et sur quelle ressource. Un MES pilote et enregistre l'exécution en temps réel. L'ISA-95 place à la fois le planning de travail et son exécution dans la gestion des opérations de fabrication (niveau 3) [31], et la norme allemande VDI 5600 cite l'ordonnancement détaillé comme une tâche du MES [15]. En pratique, l'ordonnancement est réalisé soit par un module MES, soit par un APS autonome qui échange des données avec le MES.

### Quelle est la différence entre planification de production et ordonnancement de production ?

La planification travaille avec des quantités agrégées, des périodes hebdomadaires ou mensuelles et des groupes de postes de travail, afin de fixer le programme et les besoins en matières. L'ordonnancement affecte chaque opération à une ressource avec un enchaînement et une heure de début, généralement exprimés en heures ou en équipes.

### Quels sont les types d'ordonnancement de production ?

Les distinctions les plus utiles sont l'ordonnancement à capacité finie ou infinie, et le sens de l'ordonnancement : en avant (début au plus tôt, fin au plus tôt), en arrière (à partir de la date due, début au plus tard) et fondé sur le goulot (charger d'abord le goulot, puis ordonnancer en amont à rebours et en aval en avant).

### Excel suffit-il pour l'ordonnancement de production ?

Parfois. Avec peu de commandes, des changements de série peu dépendants de l'enchaînement et un goulot stable, un tableur ou un tableau d'ordonnancement, associé à une maîtrise rigoureuse du goulot (DBR), fonctionne souvent. Un logiciel devient nécessaire lorsque le nombre de contraintes et de replanifications dépasse ce que la planification manuelle peut gérer de façon fiable, ce que le tableau des contraintes de la section 5.2 vous aide à évaluer.

### Quand un APS est-il rentable ?

En général lorsque plusieurs de ces conditions sont réunies : beaucoup d'opérations par commande, changements de série dépendant de l'enchaînement, équipes décalées ou goulots multiples, main-d'œuvre qualifiée rare, commandes urgentes fréquentes, effort de replanification important et livraisons à l'heure qui déçoivent malgré des stocks élevés. Il n'existe pas de seuil universel de taille d'entreprise.

### Un APS convient-il aux petites et moyennes entreprises industrielles ?

Oui. La complexité de la planification compte davantage que la taille de l'entreprise. Pour les petites et moyennes entreprises industrielles, les systèmes dotés de connecteurs ERP standard, paramétrables sans développement spécifique et démarrant pas à pas au niveau du goulot conviennent bien.

### Combien coûte un logiciel de planification de production ?

Il n'existe pas de référence de prix publique fiable. Les outils simples sont vendus sous forme d'abonnements par utilisateur ; la plupart des éditeurs d'APS établissent leur devis par site, par ressources et par périmètre. Prévoyez un coût total de possession sur cinq ans, incluant le nettoyage des données, l'intégration, la formation et l'effort interne, et demandez à chaque éditeur de chiffrer sur le même périmètre.

### Comment trouver le goulot d'étranglement de mon site ?

Pour chaque ressource, comparez la charge planifiée, y compris les réglages, à la capacité disponible sur plusieurs semaines, repérez les endroits où des files d'attente se forment de façon permanente, et vérifiez quelle ressource laisse les zones en aval inactives. Les goulots d'étranglement peuvent aussi être des personnes, des postes de contrôle ou des outils, et ils se déplacent lorsque le mix change.

### Qu'est-ce que la méthode drum-buffer-rope, en termes simples ?

Le goulot d'étranglement est le tambour qui fixe le rythme. Un buffer temporel placé en amont le protège des perturbations. La corde (rope) lie la libération des matières au planning du goulot, de sorte qu'il n'entre pas dans l'atelier plus de travail que le goulot ne peut en traiter [2].

### Comment réduire le délai de fabrication ?

Le levier le plus rapide consiste généralement à plafonner les en-cours (WIP), car selon la loi de Little, le délai diminue proportionnellement au WIP à débit constant [9]. Les autres leviers sont des lots plus petits avec des réglages courts, une variabilité moindre, et le maintien du taux d'utilisation des ressources non goulots en dessous du seuil à partir duquel les files d'attente explosent.

### Comment améliorer le taux de livraison à la date ?

Planifiez en tenant compte d'une capacité finie afin que les dates promises soient réalisables, maîtrisez la libération au niveau du goulot, priorisez le travail quotidien selon l'état des buffers et analysez systématiquement les causes des commandes en retard. Mesurez la performance de livraison de façon cohérente, par exemple en OTIF par rapport à la date confirmée.

### Comment calcule-t-on la quantité économique de commande ?

La formule classique de la QEC est Q* = √(2 × demande annuelle × coût de réglage ou de commande par lot ÷ coût de possession par unité et par an). Avec une demande de 12 000 unités, un coût de réglage de 300 $ et un coût de possession de 8 $, le résultat est d'environ 949 unités. La formule ignore la capacité et le séquencement et ne constitue qu'une valeur de départ.

### Comment calcule-t-on le stock de sécurité ?

Avec une demande variable et un délai d'approvisionnement constant : SS = z × σ_D × √L. Avec un écart-type de 30 unités par jour, un délai de 9 jours et un taux de service de cycle de 95 % (z = 1,645), on obtient environ 148 unités. Si le délai varie également, la valeur augmente fortement.

### L'IA peut-elle prendre en charge l'ordonnancement de la production ?

L'IA améliore les prévisions des durées de traitement et de réglage, détecte les schémas de perturbation et accélère la recherche de bons ordonnancements. Elle ne remplace ni des données de référence fiables ni un accord sur les objectifs et les règles. Sans données de confirmation fiables, l'IA apprend aussi à partir de mauvaises données.

### Combien de temps dure la mise en œuvre d'un APS ?

Cela dépend principalement de la qualité des données, de l'effort d'intégration et du périmètre. Un projet pilote dans une zone goulot peut être opérationnel en quelques mois ; un déploiement complet sur plusieurs zones prend plus de temps. Il n'existe pas d'étude indépendante solide sur les durées typiques de mise en œuvre.

### L'APS remplace-t-il les planificateurs de production ?

Non. Un APS prend en charge le calcul, pas les décisions. Les planificateurs fixent les priorités, maintiennent les règles et les données, gèrent les exceptions et arbitrent entre les scénarios. Dans les déploiements réussis, les planificateurs passent moins de temps à reconstruire les plannings et davantage sur les causes des retards.

## 21. Conclusion

Les plannings de production échouent rarement par manque d'effort des planificateurs. Ils échouent parce que la logique de planification suppose une capacité illimitée et des délais de fabrication fixes. La réalité physique de l'usine est claire : le délai de fabrication découle du WIP et du débit, les files d'attente explosent à forte utilisation, et le goulot d'étranglement détermine ce que l'usine peut livrer.

Un APS répond précisément à ce problème. Il planifie en tenant compte d'une capacité finie et de contraintes réelles, rend les dates d'expédition calculables et montre les conséquences des perturbations et des commandes urgentes avant qu'elles ne surviennent. Il ne produit des résultats qu'associé à trois éléments qu'aucun logiciel ne fournit : une concentration claire sur le goulot d'étranglement, une libération contrôlée des ordres, et des données de référence et des confirmations conformes à la réalité.

Commencez donc par une démarche simple : identifier le goulot d'étranglement, mesurer et plafonner le WIP, fiabiliser les données du goulot d'étranglement, puis tester un logiciel de planification de production doté de capacités APS dans un pilote utilisant vos propres données. Ainsi, le planning fantôme sous Excel ne sera pas remplacé par une nouvelle boîte noire, mais par un planning auquel la production, les ventes et les clients pourront se fier.

## Pour aller plus loin sur m365.fm

**Articles**

- [Au-delà de la MRP : pourquoi l'ERP échoue dans l'ordonnancement fini de la production](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [De l'ERP à l'atelier : pourquoi les plans de production ont besoin d'un jumeau numérique](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Planification de la production pour les fournisseurs aéronautiques : délai de fabrication et traçabilité](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Pages d'entités**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Guides associés**

- [Jumeau numérique dans l'industrie](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI de production](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Azure pour l'industrie](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Management de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la planification et l'ordonnancement de la production, la production allégée et la transformation numérique de l'industrie manufacturière. Chez [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), l'éditeur de [iFAKT Polaris](https://www.m365.fm/entity/polaris/), il travaille sur la manière dont la planification basée sur les contraintes, les jumeaux numériques et le retour d'information de l'atelier s'articulent pour que les plannings tiennent sur le terrain.

**Note : L'auteur travaille chez iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press 1984 (3rd rev. ed. 2004, ISBN 978-0-88427-178-9).
2. Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
3. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html
4. Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, Mokshagundam L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
5. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636
6. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
7. Schuh, Günther; Stich, Volker (eds.): Produktionsplanung und -steuerung 1. Grundlagen der PPS [Production planning and control 1: Fundamentals]. 4th rev. ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-642-25422-2. (German)
8. Nyhuis, Peter; Wiendahl, Hans-Peter: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-540-92838-6. DOI: 10.1007/978-3-540-92839-3 (German). English edition: Nyhuis, Peter; Wiendahl, Hans-Peter: Fundamentals of Production Logistics. Theory, Tools and Applications. Springer, Berlin/Heidelberg 2009 (published October 2008), ISBN 978-3-540-34210-6, DOI: 10.1007/978-3-540-34211-3
9. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383
10. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
11. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
12. Lödding, Hermann: Verfahren der Fertigungssteuerung. Grundlagen, Beschreibung, Konfiguration [Production control methods]. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2016, ISBN 978-3-662-48458-6 (print), 978-3-662-48459-3 (e-book). (German)
13. Fleischmann, Bernhard; Meyr, Herbert; Wagner, Michael: Advanced Planning. In: Stadtler, Hartmut; Kilger, Christoph; Meyr, Herbert (eds.): Supply Chain Management and Advanced Planning. Concepts, Models, Software, and Case Studies. 5th ed., Springer, Berlin/Heidelberg 2015, pp. 71–95. DOI: 10.1007/978-3-642-55309-7_4 (book: DOI 10.1007/978-3-642-55309-7)
14. Garey, M. R.; Johnson, D. S.; Sethi, Ravi: The Complexity of Flowshop and Jobshop Scheduling. Mathematics of Operations Research 1 (1976) 2, pp. 117–129. DOI: 10.1287/moor.1.2.117
15. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 ; table of contents: https://www.vdi.de/fileadmin/pages/vdi_de/redakteure/richtlinien/inhaltsverzeichnisse/2436698.pdf (German guideline of the Association of German Engineers)
16. VDI 3633 Part 1: Simulation of systems in materials handling, logistics and production – Fundamentals. Edition December 2014. https://din.de/de/wdc-beuth:din21:149034959 (German guideline)
17. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2, pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937
18. Andler, Kurt: Rationalisierung der Fabrikation und optimale Losgröße. Oldenbourg, Munich/Berlin 1929 [unverified: bibliographic details and first name not verified online, original not consulted; formula and assumptions per University of Duisburg-Essen, exercise "Statische Losgröße – Andler-Modell": https://www.uni-due.de/imperia/md/content/tul/de_ss2013_lm01_uebung_statische_losgroesse_andler_modell.pdf].
19. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
20. Ohno, Taiichi: Toyota Production System. Beyond Large-Scale Production. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-14-0.
21. Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
22. Boysen, Nils; Fliedner, Malte; Scholl, Armin: A classification of assembly line balancing problems. European Journal of Operational Research 183 (2007) 2, pp. 674–693. Reference: https://econpapers.repec.org/RePEc:eee:ejores:v:183:y:2007:i:2:p:674-693
23. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193
24. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
25. Logistik Heute: SCM-Studie: Mehr als ein Drittel der deutschen Unternehmen nutzt Excel als Rückgrat für die Lieferkettenplanung (IDC for Kinaxis), April 18, 2024. https://logistik-heute.de/news/scm-studie-mehr-als-ein-drittel-der-deutschen-unternehmen-nutzt-excel-als-rueckgrat-fuer-die-lieferkettenplanung-104313.html (German)
26. iFAKT GmbH: Polaris Optimizer. https://www.ifakt.de/en/solutions/optimizer
27. iFAKT GmbH: Polaris Operator. https://www.ifakt.de/en/solutions/operator
28. iFAKT GmbH: Home page. https://www.ifakt.de/
29. Pinedo, Michael L.: Scheduling. Theory, Algorithms, and Systems. 5th ed., Springer, Cham 2016. DOI: 10.1007/978-3-319-26580-3
30. MPDV Mikrolab GmbH: APS-Systeme einfach erklärt (Smart Factory glossary, with VACOM customer example). https://www.mpdv.com/industrie-4-0/smart-factory-glossar/advanced-planning-and-scheduling-system-aps (German)
31. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation. Preview incl. clause 3.1 definition of finite capacity scheduling: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf
32. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis, 1,800 respondents in nine countries incl. USA and Canada, fielded December 2023), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours
33. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf
34. Lean Enterprise Institute: Lean Lexicon, "Heijunka." https://www.lean.org/lexicon-terms/heijunka/
35. National Institute of Standards and Technology (NIST): The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
36. U.S. Department of Defense: Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), final rule. Federal Register 90 (2025) 173, September 10, 2025, effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
