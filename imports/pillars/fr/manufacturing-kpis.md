# SEO metadata

| Field | Value |
|---|---|
| Meta title | KPI de fabrication : formules, exemples et guide Power BI |
| Meta description | KPI de fabrication avec formules et exemples : temps takt, temps de cycle, délai de livraison, TRS, rebut, TPE, OTIF, MTBF, TRIR et un tableau de bord Power BI. |
| Slug | `manufacturing-kpis` |

# KPI de fabrication : le guide complet des indicateurs de production, formules, exemples concrets et tableaux de bord Power BI

> **Réponse courte :** Les KPI de fabrication sont des indicateurs qui traduisent en chiffres la vitesse, la qualité, les délais de livraison, les coûts et la sécurité d'une opération de production. Les plus importants sont le temps takt, le temps de cycle, le délai de fabrication, le TRS (OEE), le taux de rebut, le rendement premier passage (first pass yield), la livraison complète à la date convenue (OTIF), les jours de couverture, le MTBF et le MTTR, le coût unitaire et un taux de sécurité tel que le TRIR. Ils ne fonctionnent que si chaque KPI a une définition unique et partagée, des données fiables et une routine de réunion fixe au cours de laquelle les écarts donnent lieu à des actions.

> **Points clés**
> - **Définir avant de construire un tableau de bord :** La norme ISO 22400-2:2014 décrit 34 KPI pour le management des opérations de fabrication, chacun avec sa formule, son unité et sa périodicité [1][38]. La norme ISA-95 place ces KPI au niveau 3, entre la couche de contrôle et l'ERP [40]. En Allemagne, la directive VDMA 66412-1 ajoute des définitions de KPI pour les MES [4].
> - **Le temps takt n'est pas un temps machine :** le takt est le temps disponible divisé par la demande client [9]. Le temps de cycle se mesure ; le délai de fabrication inclut en plus tous les temps d'attente et de file d'attente [10].
> - **TRS = Disponibilité × Performance × Qualité.** La cible populaire de 85 % « classe mondiale » remonte à Nakajima, mais ce n'est pas une référence universelle [6][8].
> - **La loi de Little** relie en-cours, débit et délai : si vous ne réduisez pas les en-cours (WIP), vous ne raccourcirez pas durablement le délai [13].
> - **La sécurité passe en premier et dispose d'une formule standard américaine :** le taux d'incidence de l'OSHA est nombre de cas × 200 000 ÷ heures travaillées [42]. En 2025, l'industrie privée américaine a enregistré 2,3 cas déclarables pour 100 travailleurs équivalent temps plein [43].
> - **Moins c'est plus (recommandation) :** cinq à huit KPI par niveau, classés selon Sécurité, Qualité, Coût, Délais et Personnel (SQCDP), suffisent à piloter une opération.
> - **Les KPI utilisés comme objectifs perdent leur valeur** lorsqu'on les récompense au lieu de les comprendre (loi de Goodhart) [23][24].
> - **Power BI** convient bien aux tableaux de bord de KPI si le modèle de données est en schéma en étoile et si le TRS est calculé à partir de durées sommées, et non de moyennes de pourcentages [27].

## Table des matières

1. Que sont les KPI de fabrication ?
2. Aide-mémoire des KPI de fabrication : toutes les formules en un coup d'œil
3. L'exemple détaillé « Ligne 3 » : données d'entrée
4. Indicateurs de temps : temps takt, temps de cycle, délai de fabrication, temps de traitement, facteur de flux
5. Temps takt vs temps de cycle vs délai de fabrication
6. Temps de changement de série, SMED et micro-arrêts
7. TRS : comment calculer l'efficacité globale des équipements
8. KPI qualité : taux de rebut, rendement premier passage, taux de retouche, PPM
9. KPI de livraison et de stock : OTIF, respect du planning, en-cours (WIP), jours de couverture
10. Capacité et productivité : taux d'utilisation, efficacité d'utilisation, productivité de la main-d'œuvre
11. KPI de maintenance : MTBF, MTTR et disponibilité intrinsèque
12. Énergie, sécurité (TRIR, DART, LTIFR) et coût unitaire
13. Systèmes de KPI : hiérarchie, indicateurs avancés et retardés, SQCDP
14. Collecte des données et qualité des données
15. Visualisation : tableaux d'atelier et tableaux de bord Power BI
16. Comment fixer les objectifs des KPI
17. Erreurs courantes et comment les éviter
18. Feuille de route : déployer les KPI de fabrication en 90 jours
19. KPI issus de la modélisation de la chaîne de valeur : iFAKT Polaris
20. Glossaire
21. FAQ : KPI de fabrication
22. Conclusion

## 1. Qu'est-ce que les KPI de fabrication ?

Les KPI de fabrication (aussi appelés indicateurs de performance de production, KPI de production ou indicateurs clés de performance en fabrication) sont des chiffres synthétiques qui rendent mesurable un aspect de la production. Quelle est la vitesse de passage d'une commande dans l'usine ? Quelle part du temps planifié une machine passe-t-elle réellement à produire de bonnes pièces ? Combien d'expéditions arrivent chez le client à l'heure et complètes ? Chaque KPI repose sur quatre éléments : une **définition** (ce qui est exactement compté), une **formule**, une **unité** et une **période**. Si l'un d'eux manque, on obtient la réunion familière où deux services utilisent le même nom pour deux chiffres différents.

Toute métrique n'est pas un [indicateur clé de performance (KPI)](https://www.m365.fm/entity/key-performance-indicator/). Un KPI est une métrique directement liée à un objectif et qui guide régulièrement les décisions. Le nombre de pièces produites est une métrique. La livraison à l'heure au client est un KPI pour la plupart des usines, car le chiffre d'affaires et la fidélisation des clients en dépendent.

### Les normes qui sous-tendent les formules : ISO 22400, ISA-95, SEMI et VDMA 66412

Vous n'avez pas à inventer vos définitions de KPI. La norme internationale **ISO 22400-2:2014** « Systèmes d'automatisation et intégration – Indicateurs clés de performance (KPI) pour la gestion des opérations de fabrication – Partie 2 : Définitions et descriptions » définit une sélection de KPI courants avec leur formule, leur calendrier, leur unité, leur groupe d'utilisateurs et la méthodologie de production à laquelle ils s'appliquent [1]. Des sources secondaires en comptent 34 [38][3]. L'ISO indique que la norme est « à réviser » ; l'amendement 1 a ajouté en 2017 un ensemble de KPI énergétiques [1].

La norme repose sur un modèle temporel précis. Kang et al., dans un article publié par le National Institute of Standards and Technology (NIST) des États-Unis, donnent les formules de base : disponibilité = temps de production réel (APT) ÷ temps d'occupation planifié (PBT), et efficacité = temps d'exécution planifié par pièce (PRI) × quantité produite (PQ) ÷ APT [3]. Ainsi, la norme parle d'« efficacité » là où la littérature TPM dit « performance ».

Pour les lecteurs américains, **ISA-95** (ANSI/ISA-95, au niveau international CEI 62264) fournit l'architecture autour de ces KPI. Fondée sur le modèle de référence de Purdue, elle définit cinq niveaux, allant du processus physique (niveau 0) jusqu'à la planification d'entreprise et la logistique dans l'ERP (niveau 4), en passant par la détection, la commande de supervision et le **niveau 3, gestion des opérations de fabrication (MOM), où vivent le MES et le SCADA** [40]. Les KPI ISO 22400 sont, par leur nom même, des KPI de gestion des opérations de fabrication ; ils sont donc calculés au niveau 3 d'ISA-95 et remontés vers le haut. Dans les usines de semi-conducteurs, SEMI E10 (fiabilité, disponibilité, maintenabilité et taux d'utilisation des équipements) et SEMI E79 (productivité des équipements, dont le TRS) sont les références spécifiques au secteur [41].

En Allemagne, un groupe de travail de la VDMA (l'association allemande de l'industrie de la construction mécanique) a publié la directive **VDMA 66412-1 « Systèmes d'exécution de fabrication (MES) – KPI »** (édition 2009-10, 36 pages, modifiée par A1:2010-05) [4]. Elle définit des KPI standard et la manière de les calculer à partir des états machine [5]. Le message pour vous, en tant que praticien, est le même dans tous les pays : adoptez les termes normalisés chaque fois que c'est possible et documentez chaque écart. Cela facilite grandement les comparaisons entre usines et l'intégration MES.

### À quoi servent les KPI de fabrication

Les KPI remplissent trois fonctions. Ils **rendent visibles** les pertes qui échappent à la gestion quotidienne, par exemple le fait qu'une machine tourne en permanence mais ne fournit que les deux tiers de sa production possible. Ils **focalisent l'attention** sur le levier le plus important, car ils décomposent les pertes en catégories. Et ils **testent les contre-mesures** : la nouvelle méthode de changement de série a-t-elle réellement réduit le temps de changement, ou la perte s'est-elle simplement déplacée vers la phase de montée en cadence ? Sans chiffre, cette question reste une affaire d'opinion.

Une quatrième fonction est souvent oubliée : les KPI sont un **outil de communication**. Dans le [management visuel d'atelier](https://www.m365.fm/entity/shop-floor-management/), ils constituent le langage commun entre opérateurs, chefs d'équipe et direction de l'usine. Ils ne remplissent ce rôle que si chacun connaît la définition et voit le même chiffre.

## 2. Fiche de référence des KPI de production : toutes les formules en un coup d'œil

Le tableau résume tous les KPI couverts dans ce guide. « Niveau » indique le niveau de management habituel (M = machine/poste de travail, L = ligne/zone, P = usine). Les formules suivent les sources citées dans chaque section.

| KPI | Formule (forme courte) | Unité | Sens | Niveau |
|---|---|---|---|---|
| Takt time | temps de production disponible ÷ demande client | s/unité | une donnée d'entrée, pas un élément à optimiser | L |
| Temps de cycle | temps mesuré entre deux unités finies | s/unité | ≤ takt | M, L |
| Délai de fabrication | fin − début (commande ou pièce) ; en moyenne en-cours ÷ débit | h, jours | ↓ | L, P |
| Temps de traitement | somme des durées pendant lesquelles la pièce est réellement travaillée | s, min | ↓ (sans perte de qualité) | M, L |
| Facteur de flux (Wiendahl) | délai ÷ temps d'opération | ratio (≥ 1) | ↓ | L |
| Ratio à valeur ajoutée (VSM) | temps de traitement ÷ délai × 100 | % | ↑ | L, P |
| Temps de changement de série | dernière bonne pièce de l'ancienne série à la première bonne pièce de la nouvelle | min | ↓ | M |
| Part du temps de changement | temps de changement ÷ temps de production planifié × 100 | % | ↓ | M, L |
| Micro-arrêts | nombre ou durée des arrêts courts inférieurs à un seuil défini | nombre, min | ↓ | M |
| Disponibilité (TRS) | temps de marche ÷ temps de production planifié | % | ↑ | M |
| Performance (TRS) | temps de cycle idéal × nombre total ÷ temps de marche | % | ↑ | M |
| Taux de qualité (TRS) | nombre de bonnes pièces ÷ nombre total | % | ↑ | M |
| TRS | disponibilité × performance × qualité | % | ↑ | M, L |
| TEEP | TRS × taux de chargement (temps planifié ÷ temps calendaire) | % | ↑ | M, P |
| Taux de rebut | nombre de rebuts ÷ nombre total × 100 | % | ↓ | M, L, P |
| Rendement premier passage (FPY) | unités bonnes au premier passage ÷ nombre total × 100 | % | ↑ | M, L |
| Taux de retouche | nombre de pièces retouchées ÷ nombre total × 100 | % | ↓ | M, L |
| PPM | pièces défectueuses ÷ pièces contrôlées ou expédiées × 1 000 000 | ppm | ↓ | P |
| OTIF | lignes livrées à l'heure et complètes ÷ toutes les lignes dues × 100 | % | ↑ | P |
| Respect du planning (production) | commandes terminées dans les délais ÷ toutes les commandes dues × 100 | % | ↑ | L, P |
| En-cours (WIP) | quantité ou valeur des travaux en cours | unités, $ | ↓ (jusqu'au minimum nécessaire) | L |
| Jours de couverture | stock ÷ consommation journalière moyenne | jours | ↓ (jusqu'au niveau de sécurité) | L, P |
| Taux d'utilisation de la capacité | charge ÷ capacité disponible × 100 | % | plage cible, pas un maximum | L, P |
| Efficacité d'utilisation (ISO) | temps de production réel ÷ temps d'occupation réel de l'unité | % | ↑ | M |
| Productivité de la main-d'œuvre | nombre de bonnes pièces ÷ heures de main-d'œuvre | unités/h | ↑ | L, P |
| MTBF | temps de marche ÷ nombre de pannes | h, min | ↑ | M |
| MTTR | temps total de réparation ÷ nombre de pannes | min | ↓ | M |
| Énergie par unité | énergie consommée ÷ nombre de bonnes pièces | kWh/unité | ↓ | M, P |
| TRIR (OSHA) | cas déclarables × 200 000 ÷ heures travaillées | pour 100 ETP | ↓ | P |
| Taux DART (OSHA) | cas DART × 200 000 ÷ heures travaillées | pour 100 ETP | ↓ | P |
| LTIFR | accidents avec arrêt de travail ÷ heures travaillées × 1 000 000 | pour 1 million d'h | ↓ | P |
| Coût par unité | coût de la période ÷ nombre de bonnes pièces | $/unité | ↓ | L, P |

## 3. L'exemple travaillé « Ligne 3 » : données d'entrée

Pour rendre les formules concrètes, ce guide calcule chaque KPI sur une même ligne d'assemblage fictive. Les chiffres sont choisis pour se vérifier mutuellement : si le TRS est juste, il doit correspondre au nombre de bonnes pièces, et si le délai de traversée est juste, il doit correspondre au WIP et au débit.

| Donnée d'entrée | Valeur |
|---|---|
| Organisation des équipes | 2 équipes de 8 h (480 min), 5 jours par semaine |
| Pauses par équipe | 30 min (non comptées dans le temps de production planifié) |
| Temps de production planifié par équipe | 450 min |
| Demande client | 900 unités par jour, soit 450 unités par équipe |
| Temps de cycle idéal (poste goulot) | 50 s/unité |
| Pannes par équipe | 25 min |
| Changements de série par équipe | 2 changements de 10 min = 20 min |
| Quantité totale produite par équipe | 432 unités |
| dont bonnes du premier coup | 410 unités |
| dont reprises puis bonnes | 12 unités |
| dont rebuts | 10 unités |
| Effectifs | 6 opérateurs par équipe |

Ces données d'entrée reviennent dans chaque section. Chaque calcul a été revérifié ; l'arrondi n'intervient qu'au résultat. Les coûts de la section 12 sont exprimés en dollars américains ; les montants sont illustratifs, comme la ligne elle-même.

## 4. Indicateurs de temps : takt time, temps de cycle, délai de traversée, temps de traitement, facteur de flux

Les indicateurs de temps sont les KPI de fabrication les plus souvent confondus. Les termes se ressemblent, et les entreprises les utilisent différemment en pratique. Définissez une fois pour toutes ces notions pour votre site et renvoyez à cette définition sur chaque tableau de bord.

### Comment calculer le takt time

[Le takt time](https://www.m365.fm/entity/takt-time/) indique à quelle cadence une unité finie doit sortir de la ligne pour satisfaire la demande client. Le Lean Enterprise Institute (LEI) le définit comme le temps de production disponible divisé par la demande client [9]. Rother et Shook placent « Produire au rythme du takt time » comme première règle d'une chaîne de valeur lean, et décrivent le takt comme la traduction de la demande client [2][12].

> **Takt time = temps de production disponible par période ÷ demande client par période**

Le terme vient de l'allemand (« Takt » signifie battement ou mesure). Selon le LEI, le takt a été utilisé pour la première fois comme outil de pilotage de la production dans l'industrie aéronautique allemande, dans les années 1930 [9].

**Exemple Ligne 3 :** temps disponible par équipe 450 min = 27 000 s ; demande par équipe 450 unités.
Takt time = 27 000 s ÷ 450 unités = **60 s/unité**.

Pour vérifier, l'exemple du LEI : 480 minutes par jour et une demande de 240 unités donnent un takt time de 2 minutes [9].

**Erreurs fréquentes :**
- **Ne pas déduire les pauses.** Utiliser 480 au lieu de 450 minutes donne un takt de 64 s. Sur le papier, la ligne serait alors dimensionnée trop lentement.
- **Déduire les arrêts non planifiés.** Les pannes ne doivent pas être retranchées du temps disponible pour le takt. Ce sont des pertes que la ligne doit absorber grâce à sa réserve de capacité. Les déduire masque le problème à l'intérieur du takt.
- **Considérer le takt comme une grandeur à optimiser.** Le client fixe le takt, pas la production. Ce que l'on optimise, c'est le temps de cycle, pour qu'il respecte de façon fiable le takt.
- **Confondre takt et cadence.** Le takt est un temps par unité, pas un nombre d'unités par temps. Son inverse (1 unité toutes les 60 s = 60 unités par heure) est le débit requis.

### Temps de cycle

Selon le LEI, le [temps de cycle](https://www.m365.fm/entity/cycle-time/) est « le temps requis pour produire une pièce ou accomplir un processus, tel que mesuré en réalité » [10]. Dans la cartographie de chaîne de valeur, il décrit à quelle fréquence un processus achève une pièce. Le mot clé est « mesuré » : le temps de cycle est une valeur réelle. Le **temps de cycle idéal** (aussi appelé temps de cycle standard, théorique ou nominal) est le meilleur temps techniquement possible, et la base de la performance du TRS.

> **Temps de cycle réel moyen = temps de marche ÷ unités produites**

**Exemple Ligne 3 :** temps de marche 405 min (450 min moins 25 min de pannes moins 20 min de changements de série) = 24 300 s ; 432 unités produites.
Temps de cycle réel = 24 300 s ÷ 432 = **56,25 s/unité**.
Le temps de cycle idéal est de 50 s. L'écart de 6,25 s par unité se situe dans les micro-arrêts et la réduction de vitesse, c'est-à-dire dans la perte de performance (section 7).

Pour les machines, le LEI définit également le **temps de cycle machine effectif** : temps de cycle machine, plus temps de chargement et de déchargement, plus temps de changement de série, le tout divisé par le nombre de pièces fabriquées entre deux changements de série [10]. Il indique si une machine peut tenir le takt, compte tenu de la fréquence de ses changements de série.

**Erreur courante :** confondre temps de cycle et takt time. Les deux s'expriment en secondes par unité, mais le takt est une grandeur de demande, alors que le temps de cycle est une grandeur de processus. Au moins une page anglophone très bien classée donne la formule du temps de cycle à l'envers (pièces ÷ temps de passage) ; il s'agit là d'un débit, et non d'un temps de cycle.

### Comment calculer le délai de fabrication

Le [délai de fabrication](https://www.m365.fm/entity/lead-time/) (ou délai de production, aussi appelé temps de traversée) est « le temps nécessaire à un produit pour traverser l'ensemble d'un processus ou d'une chaîne de valeur, du début à la fin » [10]. Il comprend, outre le temps d'usinage, tous les temps de transport, d'attente en file et d'attente. La technique de production allemande le décompose en temps d'opération (préparation et usinage), temps de transition (attente en file et transport) et temps d'attente inter-opérations [15]. Hans-Peter Wiendahl a fait du délai de fabrication le concept central de la gestion de production avec son modèle en entonnoir [15][14].

Il existe deux façons de le déterminer :

**1. Directement, par commande ou par pièce :**

> **Délai de fabrication = horodatage de fin − horodatage de début (ou lancement de l'ordre)**

Décidez si vous comptez en jours calendaires, en jours ouvrés (jours calendaires d'atelier) ou en heures, et à quel moment le chronomètre démarre (saisie de la commande, lancement, première opération). Des points de départ différents sont la cause la plus fréquente des débats entre le commercial et la production sur « le » délai de fabrication.

**2. Indirectement, avec la loi de Little :**

En 1961, John D. C. Little a démontré qu'dans un système stable, le nombre moyen d'éléments présents dans le système est égal au taux d'arrivée multiplié par le temps moyen passé dans le système (L = λW) [13]. Appliqué à la fabrication :

> **Délai de fabrication moyen = en-cours moyen ÷ débit moyen**

**Exemple de la ligne 3 :** en moyenne 2 700 pièces se trouvent dans la ligne et ses tampons ; la ligne expédie en moyenne 900 pièces par jour ouvré.
Délai de fabrication = 2 700 ÷ 900 = **3 jours ouvrés**.

La loi de Little s'applique aux moyennes sur une période suffisamment longue durant laquelle les en-cours ne croissent ni ne décroissent durablement. Les en-cours et le débit doivent être exprimés dans la même unité (pièces ou euros, sans mélange). Son intérêt pratique majeur : à débit constant, un délai plus court n'est possible qu'avec moins d'en-cours. Des machines plus rapides ne servent pas à grand-chose tant que les pièces attendent devant elles.

### Temps d'usinage et temps alloué (REFA)

Le **temps d'usinage** est le temps pendant lequel le produit est effectivement travaillé [10] ; il ne représente généralement qu'une petite fraction du délai de fabrication. Pour la planification et le calcul des coûts, les usines allemandes utilisent les catégories de temps de la REFA, l'association allemande pour l'organisation du travail et le génie industriel (comparable par son rôle aux conventions de temps standard du génie industriel américain). La REFA décompose le temps de commande en temps de préparation et temps de déroulement, chacun composé de parts de base, de repos et de tolérances ; l'équivalent côté machine s'appelle le temps d'occupation de l'équipement [16][17] :

> **Temps de commande T = temps de préparation t_r + temps de déroulement t_a**, avec **t_a = quantité de commande m × temps par unité t_e**

**Exemple :** une commande de 400 unités passe sur le poste goulot : préparation 20 min, temps par unité 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333,3 = **353,3 min** (environ 5,9 h).

Nyhuis et Wiendahl dérivent le **temps d'opération** d'une étape de travail à partir du temps de commande et l'expriment en jours calendaires d'atelier en rapportant le temps de commande à la capacité journalière du moyen de production [14]. [unverified: notation exacte de la formule chez Nyhuis/Wiendahl, section 2.1.1, vérifiée uniquement d'après la table des matières et la liste des abréviations] Pour que les exemples restent comparables, ce guide simplifie et calcule en minutes de temps d'exploitation ; pour une machine unique, le temps d'opération est alors égal au temps de commande.

### Facteur de flux et taux de valeur ajoutée

Deux indicateurs différents circulent sous des noms voisins, et il ne faut pas les confondre.

**Facteur de flux selon Wiendahl (vision logistique) :** rapport entre le délai de fabrication et le temps d'opération d'une étape de travail ou d'une commande [14][15]. Une valeur de 1 signifie que la commande a été traitée sans attente ; une valeur de 6 signifie qu'elle a passé six fois plus de temps dans le système que n'en exigeaient la préparation et l'usinage.

> **Facteur de flux = délai de fabrication ÷ temps d'opération**

**Exemple :** la commande de l'exemple REFA a un temps d'opération de 353,3 min. Elle attend deux jours ouvrés avant l'opération (2 × 900 min = 1 800 min de temps d'exploitation).
Délai de fabrication de l'opération = 1 800 + 353,3 = 2 153,3 min. Facteur de flux = 2 153,3 ÷ 353,3 = **6,09**.

**Taux de valeur ajoutée (vue flux de valeur) :** dans le [value stream mapping](https://www.m365.fm/entity/value-stream-mapping/), la vue inverse est courante : la part du temps de traitement dans le délai de traversée, en pourcentage. (Le « temps à valeur créatrice » plus restreint de la LEI ne compte que les opérations que le client est prêt à payer [10].) Le Wikipedia allemand appelle ce ratio « Fließgrad », son inverse « Flussgrad », et situe la part d'activité à valeur ajoutée dans l'industrie allemande entre 5 et 15 % [15]. [unverified: source primaire de cette plage non clairement documentée dans Wikipedia] Certains manuels sur le flux de valeur appellent aussi ce pourcentage facteur de flux. Vérifiez donc toujours si l'on vise une valeur supérieure à 1 ou inférieure à 100 %.

> **Taux de valeur ajoutée = temps de traitement ÷ délai de traversée × 100 %**

**Exemple pour la ligne 3 :** les temps de traitement des quatre postes totalisent 190 s. Le délai de traversée est de 3 jours ouvrés de 900 min de temps d'exploitation chacun, soit 162 000 s.
Taux de valeur ajoutée = 190 ÷ 162 000 × 100 % = **0,117 %**.

Des valeurs inférieures à 1 % sont normales dans des exploitations avec stocks tampons et lots. Ce qui compte, ce sont la tendance et la base de temps : en temps calendaire, la valeur baisse encore. La méthode est détaillée dans le guide [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 5. Temps takt, temps de cycle et délai de traversée

« Quelle est la différence entre le temps takt et le temps de cycle ? » est l'une des questions les plus fréquentes autour des KPI de fabrication. Le tableau place les trois côte à côte. La LEI résume ainsi l'ordre des grandeurs : « En général, le temps à valeur créatrice est inférieur au temps de cycle, lequel est inférieur au délai de traversée de production » [10].

| Attribut | Temps takt | Temps de cycle | Délai de traversée |
|---|---|---|---|
| Question | À quelle fréquence une pièce **doit-elle** être terminée ? | À quelle fréquence une pièce **est-elle** terminée ? | Combien de temps une pièce **met-elle** pour traverser le système ? |
| Source | demande client et temps de travail | mesure au niveau du process | horodatages ou loi de Little |
| Formule | temps disponible ÷ demande | temps de marche ÷ unités (mesuré) | fin − début, ou en-cours ÷ débit |
| Unité type | s/unité | s/unité | h, jours |
| Ligne 3 | 60 s | 56,25 s (idéal 50 s) | 3 jours ouvrés |
| Qui l'influence ? | ventes, client, régime d'équipes | ingénierie, méthode, maintenance | ordonnancement, en-cours, tailles de lots |
| Sens raisonnable | aucun ; c'est une donnée | ≤ takt avec une réserve | aussi court que possible |
| Erreur courante | pauses non déduites | valeur idéale utilisée à la place de la valeur réelle | point de départ non défini |

**Enseignement clé de l'exemple :** le temps de cycle réel de 56,25 s est inférieur au takt de 60 s. Pourtant, la ligne 3 ne répond toujours pas à la demande, comme le montrent les sections suivantes, car le temps de cycle ne s'applique que pendant le temps de marche. Pannes, changements de série et rebuts n'apparaissent pas dans cette vue. Pour la conception de ligne, c'est le **temps de cycle effectif par pièce bonne** qui compte, c'est-à-dire le temps de production planifié divisé par le nombre de pièces bonnes.

## 6. Temps de changement de série, SMED et micro-arrêts

### Temps de changement de série et part du changement de série

Le [temps de changement de série](https://www.m365.fm/entity/setup-time/) (temps de réglage) est le temps nécessaire pour faire passer une machine ou une ligne d'un produit à un autre. En pratique, la mesure la plus fiable va du dernier bon produit de l'ancienne série jusqu'au premier bon produit de la nouvelle série, car elle inclut les réglages et la montée en cadence. [unverified: cette convention est répandue dans la pratique mais n'est pas énoncée textuellement dans les sources consultées ici.] Dans le système REFA, le temps de réglage fait partie du temps de commande [16].

> **Part du changement de série = temps de changement de série ÷ temps de production planifié × 100 %**

**Exemple pour la ligne 3 :** 20 min de changement de série ÷ 450 min = **4,44 %**.

### SMED : changements de série en moins de dix minutes

Le [SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) est une méthode visant à réduire au maximum les changements de série ; l'objectif est un temps de changement à un chiffre de minutes, c'est-à-dire inférieur à dix minutes [11]. Shigeo Shingo a développé les idées essentielles dans les années 1950 et 1960 : il a séparé le réglage interne, qui ne peut être effectué que machine à l'arrêt, du réglage externe, qui peut être réalisé pendant que la machine tourne, et a transféré autant d'opérations que possible vers le réglage externe [11].

**Exemple pour la ligne 3 :** si les deux changements de série passent de 10 à 6 min, la ligne gagne 8 min de temps de fonctionnement par poste. À performance inchangée de 88,9 %, cela représente 8 × 60 ÷ 50 × 0,889 = **environ 8,5 pièces supplémentaires** par poste. Autre option : la ligne peut conserver le même temps total de changement, changer de série plus souvent et produire des lots plus petits, ce qui réduit les en-cours et le délai de fabrication.

**Erreur courante :** considérer le temps de changement de série uniquement comme une perte. Des changements plus courts sont avant tout un levier pour réduire la taille des lots. Si l'on consacre tout le temps gagné à des séries plus longues, on renonce au bénéfice logistique.

### Micro-arrêts

Les [micro-arrêts](https://www.m365.fm/entity/micro-stops/) (arrêts mineurs) sont de courtes interruptions, comme une pièce coincée ou un capteur déclenché, qui sont à peine remarquées une à une. Dans le cadre TPM de Nakajima, ils font partie des six grandes pertes sous le nom de « pertes par marche à vide et arrêts mineurs » et réduisent la performance, et non la disponibilité [7]. Chaque entreprise fixe son propre seuil entre un micro-arrêt et une panne ; des seuils de quelques minutes sont courants. [unverified: aucune norme définissant un seuil contraignant n'a été trouvée.] Muchiri et Pintelon soulignent que l'enregistrement manuel omet souvent les petits arrêts [7].

**Exemple pour la ligne 3 :** la perte de performance totale correspond au temps de fonctionnement moins le temps idéal pour les unités produites : 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. L'automate de la machine compte 120 micro-arrêts de 15 s chacun, soit 30 min. Les 15 min restantes correspondent à une vitesse réduite. Sans saisie automatique des données, ces 30 minutes de micro-arrêts auraient probablement été consignées dans le rapport de poste comme « ligne en marche ».

## 7. TRG : comment calculer le rendement global des équipements

Le rendement global des équipements (TRG, en anglais OEE) est l'indicateur de fabrication le plus connu. Le terme remonte à Seiichi Nakajima et constitue un élément central de la [maintenance productive totale (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. Le glossaire de l'ASQ décrit le TRG comme une mesure de la performance d'une unité de fabrication par rapport à sa capacité de conception pendant les périodes où elle est programmée pour fonctionner, en combinant le temps de disponibilité, la vitesse et la part de production conforme [36]. Le TRG répond à une seule question : quelle part du temps de production planifié a servi à fabriquer des pièces conformes à la cadence idéale ?

### Les trois facteurs

> **TRG = Disponibilité × Performance × Qualité**

| Facteur | Formule | Pertes saisies |
|---|---|---|
| Disponibilité | temps de marche ÷ temps de production planifié | pannes, préparation et réglages |
| Performance (ISO : efficacité) | temps de cycle idéal × nombre total ÷ temps de marche | micro-arrêts, réduction de vitesse |
| Qualité | nombre de bonnes pièces ÷ nombre total | rebuts, retouches, pertes au démarrage |

Muchiri et Pintelon définissent la disponibilité comme le temps de fonctionnement exprimé en pourcentage du temps de chargement, la performance comme le temps de cycle théorique multiplié par la production réelle, divisé par le temps de fonctionnement, et le taux de qualité comme la production totale moins les défauts, rapportée à la production totale [7]. La norme ISO 22400-2 suit la même logique avec ses propres termes de temps [3].

### Les six grandes pertes

Nakajima répartit les pertes en six catégories [7] :

1. **Pannes** (pertes par panne) → disponibilité
2. **Préparation et réglage** → disponibilité
3. **Attentes et arrêts mineurs** → performance
4. **Réduction de vitesse** → performance
5. **Défauts de qualité et retouches** → qualité
6. **Rendement réduit au démarrage** → qualité

Cette correspondance fait la vraie valeur du TRG. Le total seul dit peu de chose ; seule la décomposition montre si la maintenance, l'équipe de changement de série ou la qualité dispose du levier le plus important.

### Comment calculer le TRG : l'exemple de la ligne 3

**Étape 1, disponibilité :** temps de production planifié 450 min ; pannes 25 min, changements de série 20 min ; temps de marche 405 min.
Disponibilité = 405 ÷ 450 = **90,0 %**.

**Étape 2, performance :** 432 unités × 50 s = 21 600 s de temps idéal ; temps de marche 405 min = 24 300 s.
Performance = 21 600 ÷ 24 300 = **88,9 %**.

**Étape 3, qualité :** 410 pièces conformes du premier coup sur 432 unités.
Qualité = 410 ÷ 432 = **94,9 %**.

**Étape 4, TRG :** 0,900 × 0,8889 × 0,9491 = **75,9 %**.

**Vérification par le temps :** nombre de bonnes pièces multiplié par le temps de cycle idéal, divisé par le temps de production planifié = 410 × 50 s ÷ 27 000 s = 20 500 ÷ 27 000 = **75,9 %**. Les deux méthodes doivent donner le même résultat ; si ce n'est pas le cas, les données d'entrée sont fausses.

**Ce que le TRG signifie pour le takt :** le temps de cycle effectif par bonne pièce est de 50 s ÷ 0,759 = 65,9 s, soit au-dessus du takt de 60 s. En 27 000 s, la ligne produit 410 bonnes pièces du premier coup, 422 en comptant les 12 pièces retouchées. La demande de 450 unités par équipe n'est pas atteinte, il manque 28 unités. Pour couvrir la demande avec les seules bonnes pièces du premier coup, la ligne 3 aurait besoin d'un TRG de 450 × 50 ÷ 27 000 = 83,3 %.

### Retouches : bonnes ou mauvaises ?

Dans la logique TPM, la retouche est une perte de qualité [7] ; c'est pourquoi l'exemple ne compte que les 410 pièces bonnes du premier coup. Kang et al. utilisent un taux de qualité qui compte les pièces retouchées comme bonnes [3]. Avec 422 pièces au lieu de 410, la qualité passerait à 97,7 % et le TRG à 78,1 %. Les deux variantes se défendent, mais il faut en choisir une et ne pas comparer des usines qui utilisent des définitions différentes.

### TEEP : le TRG rapporté au temps calendaire

Le rendement total des équipements (TEEP) rapporte le TRG au temps calendaire total et non au seul temps planifié [8] :

> **TEEP = TRG × taux de chargement**, avec **taux de chargement = temps de production planifié ÷ temps calendaire**

**Exemple de la ligne 3 :** 10 équipes × 450 min = 4 500 min de temps planifié par semaine ; temps calendaire 7 × 24 × 60 = 10 080 min.
Taux de chargement = 4 500 ÷ 10 080 = 44,6 %. TEEP = 75,9 % × 44,6 % = **33,9 %**.

Le TEEP est l'indicateur adapté aux décisions d'investissement : avant d'acheter une deuxième machine, il montre combien de temps calendaire inutilisé la machine existante laisse encore disponible. Notez que certaines pages en anglais donnent au TRG, à l'OOE et au TEEP la même formule ; c'est une erreur, car les trois diffèrent par la base de temps.

### Qu'est-ce qu'un bon TRG ? D'où vient la référence de 85 % et pourquoi elle est contestée

Le chiffre de 85 % présenté comme « OEE de classe mondiale » est régulièrement attribué à Nakajima dans la presse professionnelle, souvent reconstitué à partir de 90 % de disponibilité, 95 % de performance et 99,9 % de qualité (0,90 × 0,95 × 0,999 = 85,4 %) [37]. Dans les sources primaires et les revues consultées pour cet article, la décomposition par composante n'a pas pu être retrouvée mot pour mot. [unverified: passage original dans Nakajima 1988] L'article anglais de Wikipédia indique explicitement que 85 % n'est pas la bonne cible dans de nombreux cas, par exemple lorsque toutes les pertes ne sont pas captées ou lorsque les exigences de qualité de la branche sont plus élevées [8].

Autres points de critique [8] :

- L'OEE se comporte comme une moyenne géométrique et pénalise les facteurs inégaux : 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- Les définitions varient d'une entreprise à l'autre, si bien que l'OEE se prête mal aux comparaisons entre usines ou types de machines.
- L'OEE n'est pas une mesure de la performance individuelle d'un salarié.

Utilisez l'OEE comme KPI d'amélioration pour un même moyen de production dans le temps, et non comme classement. Une usine en process continu fonctionnant 24 h/24, 7 j/7 et un atelier de production à la commande avec de nombreux changements de série ont des valeurs structurellement différentes.

### Agréger correctement l'OEE sur plusieurs machines

Une erreur de reporting courante consiste à faire la moyenne des pourcentages d'OEE. Exemple : la machine A affiche un OEE de 80 % avec 450 min de temps planifié, la machine B 50 % avec 150 min.

- Faux (moyenne non pondérée) : (80 % + 50 %) ÷ 2 = 65,0 %
- Juste (pondérée par le temps) : (0,80 × 450 + 0,50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72,5 %**

La démarche la plus propre consiste à recalculer l'OEE à chaque niveau à partir des temps cumulés : somme du temps à valeur ajoutée (quantité bonne × temps de cycle idéal) divisée par la somme du temps planifié. La section 15 présente la formule DAX correspondante.

## 8. KPI qualité : taux de rebut, rendement premier passage, taux de reprise, PPM

Les KPI qualité répondent à deux questions différentes : quelle part de matière et de temps est perdue à l'intérieur de l'usine (interne) et combien de défauts atteignent le client (externe) ? Chaque vue nécessite ses propres KPI. La norme ISO 22400-2 comprend, entre autres, le ratio de qualité, le taux de rebut, le taux de reprise et un rendement premier passage [3] ; les taux de rebut et de reprise figurent également dans la liste des 34 KPI ISO de Fabrico [38].

### Formule du taux de rebut

Le [taux de rebut](https://www.m365.fm/entity/scrap-rate/) mesure la part des pièces qui ne peuvent plus être utilisées et sont mises au rebut ou recyclées. Dans la présentation de Kang et al., la formule ISO est la quantité mise au rebut divisée par la quantité produite [3].

> **Taux de rebut = nombre de rebuts ÷ nombre total × 100 %**

**Exemple ligne 3 :** 10 pièces rebutées ÷ 432 pièces × 100 % = **2,31 %**.

**Erreurs fréquentes :**
- **Changer de base.** Parfois le nombre total, parfois le nombre de pièces bonnes est utilisé (10 ÷ 422 = 2,37 %). Pour de faibles taux, l'écart est minime ; pour des taux élevés, il devient significatif.
- **Oublier le rebut de démarrage.** Les pièces écartées pendant le réglage après un changement de série ne sont souvent pas comptabilisées. Pourtant, elles montrent si les changements de série sont maîtrisés.
- **Compter des pièces sans valeur.** Une pièce rebutée en fin de chaîne de valeur coûte plusieurs fois le prix d'une matière brute. Ajoutez le coût du rebut au taux de pièces.

### Rendement premier passage (FPY)

Le rendement premier passage (également « first time through » ou « right first time ») mesure la part des unités qui passent un process du premier coup, sans reprise ni rebut. L'ASQ décrit le FPY, aussi appelé taux de qualité, comme le pourcentage d'unités qui achèvent un process et respectent les consignes de qualité sans être mises au rebut, reprises, retestées, retournées ou détournées vers une zone de réparation hors ligne [36]. Kang et al. donnent la formule comme quantité bonne au premier passage divisée par la quantité produite [3].

> **FPY = unités bonnes au premier passage ÷ nombre total × 100 %**

**Exemple ligne 3 :** 410 ÷ 432 × 100 % = **94,9 %**.

Pour plusieurs étapes de process, multipliez les valeurs de FPY de chaque étape pour obtenir le **rendement de passage cumulé (RTY, rolled throughput yield)**. Trois postes affichant chacun 98 % de FPY donnent 0,98 × 0,98 × 0,98 = 94,1 %. Le RTY montre quelle part des pièces traverse toute la chaîne sans aucune correction. [unverified: le RTY est largement utilisé dans la littérature Six Sigma mais n'a pas été vérifié auprès d'une source primaire pour cet article.]

**Qualité OEE vs FPY :** si vous traitez les reprises comme une perte, le FPY et le taux de qualité de l'OEE sont identiques (tous deux 94,9 % dans l'exemple). Si vous comptez les reprises comme bonnes, la qualité OEE équivaut au rendement final : (410 + 12) ÷ 432 = 97,7 %.

### Taux de reprise

> **Taux de reprise = nombre de pièces repris ÷ nombre total × 100 %**

**Exemple ligne 3 :** 12 ÷ 432 × 100 % = **2,78 %**.

Le contrôle : FPY + taux de reprise + taux de rebut = 94,91 % + 2,78 % + 2,31 % = 100 %. Cette vérification de somme doit s'exécuter automatiquement dans chaque tableau de bord ; si elle ne tombe pas juste, des transactions sont manquantes.

Les retouches sont souvent sous-estimées, parce que la pièce finit par être bonne. Pourtant, elles mobilisent des personnes, créent des en-cours et allongent le délai de livraison. Enregistrez le temps de retouche en plus de la quantité retouchée.

### PPM (pièces par million)

L'ASQ définit le PPM comme une mesure qui exprime le nombre de défauts rapporté à une population d'un million, afin de faciliter les comparaisons [36]. Il sert surtout pour les réclamations clients et l'évaluation des fournisseurs.

> **PPM = pièces défectueuses ÷ pièces expédiées (ou contrôlées) × 1 000 000**

**Exemple :** au cours d'un trimestre, le site expédie 250 000 pièces ; le client en refuse 18. PPM = 18 ÷ 250 000 × 1 000 000 = **72 ppm**.

Convenez avec le client si les pièces refusées, les lots refusés ou les réclamations acceptées sont comptabilisés. Exprimer la mise au rebut interne en PPM (Ligne 3 : 10 ÷ 432 × 1 000 000 = 23 148 ppm) est possible, mais peu intuitif ; le pourcentage est plus parlant dans ce cas.

## 9. Indicateurs de livraison et de stock : OTIF, respect du planning, en-cours, jours de couverture

### Livraison à l'heure et OTIF

La performance de livraison mesure la fiabilité avec laquelle le site tient ses engagements envers les clients. La forme la plus courante est l'**OTIF** (à l'heure et complet, *on time in full*) : une livraison ne compte que si elle est à l'heure **et** complète.

> **OTIF = lignes de commande livrées à l'heure et complètes ÷ toutes les lignes de commande dues × 100 %**

Il n'existe pas de définition normative contraignante. McKinsey a relevé en 2019 que, faute de définition standard, l'OTIF est interprété de façons très différentes ; dans une enquête menée auprès de 24 grands distributeurs et fabricants de biens de consommation nord-américains, 79 % se prononçaient pour un indicateur OTIF unique combinant les deux critères plutôt qu'une mesure séparée, et il n'existait aucun consensus sur la largeur de la fenêtre de livraison [18].

**Exemple :** sur un mois, 200 lignes de commande sont dues. 184 ont été livrées à l'heure, 190 complètes, 178 à l'heure et complètes.
- À l'heure = 184 ÷ 200 = 92,0 %
- Complet = 190 ÷ 200 = 95,0 %
- OTIF = 178 ÷ 200 = **89,0 %**

Notez que l'OTIF n'est pas le produit des deux taux (0,92 × 0,95 = 87,4 %) ; il se calcule à partir des lignes qui remplissent les deux conditions en même temps.

**Vous devez définir :** la date de référence (date demandée ou date confirmée), la fenêtre de tolérance (par exemple ±1 jour), le niveau (commande, ligne, quantité), et si les livraisons anticipées comptent comme livrées à l'heure. Les grands clients fixent souvent les règles à votre place : Walmart, par exemple, exigeait en 2019 de ses fournisseurs qu'ils livrent des camions complets dans une fenêtre de deux jours dans 87 % des cas, et pénalisait les écarts à hauteur de 3 % du coût des marchandises vendues [47]. Ces programmes évoluent ; vérifiez donc la définition actuelle de chaque client avant de comparer.

### Respect du planning en production

Le respect du planning (achèvement des ordres de fabrication à la date prévue) mesure si les ordres de production sont terminés à la date planifiée. C'est un indicateur interne et un indicateur avancé de l'OTIF client.

> **Respect du planning = ordres de fabrication terminés dans les délais ÷ tous les ordres de fabrication dus × 100 %**

**Exemple :** 102 des 120 ordres dus sont terminés dans les délais : **85,0 %**.

Nyhuis et Wiendahl justifient en partie leur modèle des courbes de fonctionnement logistique par l'atteinte insatisfaisante des objectifs logistiques dans de nombreuses entreprises [14]. [unverified: résumé tronqué dans la version récupérée après cette partie de la phrase] Ajoutez au taux l'écart moyen par rapport au planning, en jours ; 85 % de respect avec un jour de retard ne correspond pas à 85 % avec deux semaines de retard.

### En-cours (WIP, work in process)

Les en-cours regroupent tous les produits non finis entre la mise à disposition des matières et l'achèvement. Ils sont exprimés en pièces (pour le pilotage) ou en dollars (pour la finance). La loi de Little relie directement les en-cours au délai de livraison [13] : la Ligne 3 compte 2 700 pièces d'en-cours pour un débit quotidien de 900 pièces, soit 3 jours de délai. Si l'équipe ramène les en-cours à 1 800 pièces pour le même débit, le délai tombe à 2 jours.

### Jours de couverture (couverture des stocks)

> **Jours de couverture = stock ÷ consommation moyenne quotidienne (ou demande)**

**Exemple :** stock de produits finis de 2 250 unités, demande de 900 unités par jour. Jours de couverture = 2 250 ÷ 900 = **2,5 jours**.

Mathématiquement, les jours de couverture correspondent à la loi de Little appliquée à un seul point de stock. Utilisez une demande prévisionnelle lorsque la demande fluctue fortement ; sinon, une couverture fondée sur l'historique peut paraître trompeusement élevée ou basse.

## 10. Capacité et productivité : taux d'utilisation, efficacité d'utilisation, productivité du travail

### Taux d'utilisation de la capacité

Le taux d'utilisation compare la charge (capacité requise selon les temps standards) à la capacité disponible.

> **Taux d'utilisation de la capacité = charge ÷ capacité disponible × 100 %**

**Exemple :** les commandes représentant 4 050 min de temps standard sont planifiées sur le poste goulot pour la semaine ; la capacité disponible est de 4 500 min. Taux d'utilisation = 4 050 ÷ 4 500 = **90,0 %**.

**Pourquoi 100 % n'est pas un objectif :** les courbes de fonctionnement logistiques de Nyhuis et Wiendahl décrivent la relation entre le WIP, la production et le délai de traversée d'un système de travail [14]. À mesure que le taux d'utilisation s'approche de la limite de capacité, les files d'attente et les délais augmentent de manière disproportionnée, car chaque perturbation et chaque fluctuation ne peuvent plus être absorbées. Le goulot doit être fortement utilisé ; les postes non goulots ont besoin d'une réserve. Fixez une plage cible plutôt qu'un maximum.

### Le taux d'utilisation n'est pas l'efficacité d'utilisation

Ces termes sont souvent confondus. Le **taux d'utilisation de la capacité** est un indicateur de planification (quelle quantité de travail est chargée sur la capacité ?). L'**efficacité d'utilisation** (ISO 22400) est un indicateur d'exécution : le rapport entre le temps de production réel (APT) et le temps d'occupation réel de l'unité (AUBT) [3]. Une machine peut être chargée à 95 % et présenter tout de même une mauvaise efficacité d'utilisation si une part importante du temps occupé est perdue en pannes et en attentes. Pour la ligne 3, le rapport entre le temps de marche et le temps occupé est de 405 ÷ 450 = 90 %, ce qui, dans ce cas simple, correspond à la disponibilité du TRS ; dans les usines qui enregistrent séparément les temps de réglage et d'occupation, les valeurs diffèrent.

### Productivité

La productivité est le rapport entre la production et les ressources consommées. En fabrication, on mesure généralement des **productivités partielles**, car les facteurs de production ne peuvent pas être additionnés de manière significative.

> **Productivité du travail = nombre de pièces bonnes ÷ heures de travail effectuées**

**Exemple de la ligne 3 :** 422 pièces bonnes (y compris retravaillées) ÷ (6 opérateurs × 8 h) = 422 ÷ 48 = **8,79 unités par heure de travail**.

**Erreurs courantes :** confondre la productivité avec un ratio de performance (le rapport entre la production réelle et la production standard est un ratio de performance ou d'efficacité, et non de productivité), compter la production totale au lieu de la production bonne, et comparer la productivité entre produits ayant des contenus de travail différents. Pour les usines à forte variété de produits, les heures standards gagnées par heure de présence constituent une mesure plus pertinente.

## 11. Indicateurs de maintenance : MTBF, MTTR et disponibilité intrinsèque

La norme ISO 22400 inclut le MTBF et le MTTR parmi les indicateurs de maintenance [38][3]. Ils décomposent la perte de disponibilité due aux pannes en deux questions : à quelle fréquence la machine tombe-t-elle en panne, et combien de temps faut-il avant qu'elle redémarre ?

> **MTBF (temps moyen entre pannes) = temps de fonctionnement ÷ nombre de pannes**
> **MTTR (temps moyen de réparation) = temps total de réparation ÷ nombre de pannes**

**Exemple de la ligne 3, sur un mois :** 40 postes de 405 min de fonctionnement chacun = 16 200 min ; 40 pannes totalisant 1 000 min.
- MTBF = 16 200 ÷ 40 = **405 min** (6,75 h)
- MTTR = 1 000 ÷ 40 = **25 min**

À partir de ces valeurs, on peut calculer la **disponibilité intrinsèque (technique)**, qui ne prend en compte que les pannes :

> **Disponibilité intrinsèque = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94,2 %**. La disponibilité OEE de 90 % est plus basse, car elle inclut aussi le temps de changement de série.

**Erreurs courantes :** le MTTR peut ne mesurer que la réparation, sans le délai de réponse avant l'arrivée du technicien ; déterminez ce que vous mesurez et mesurez séparément le délai de réponse et la réparation. Une moyenne calculée sur quelques événements est aussi très aléatoire ; le MTBF ne devient fiable que sur plusieurs mois. Et ne confondez pas le MTBF avec le MTTF (temps moyen jusqu'à la défaillance), qui s'applique aux éléments non réparables ; certaines pages anglophones très bien classées confondent les deux.

## 12. Énergie, sécurité (TRIR, DART, LTIFR) et coût par unité

### Énergie par unité

Dans de nombreuses usines, l'énergie est devenue un poste de coût qui mérite son propre indicateur. La norme ISO 22400-2 a été complétée par des indicateurs énergétiques en 2017 [1] ; pour le management de l'énergie, la norme ISO 50006:2023 (deuxième édition, remplaçant la version de 2014) décrit la manière de construire les indicateurs de performance énergétique (EnPI) et les références énergétiques [22][34].

> **Consommation énergétique spécifique = énergie consommée sur la période ÷ nombre de pièces bonnes**

**Exemple de la ligne 3 :** 1 520 kWh par poste ÷ 422 pièces bonnes = **3,60 kWh par unité**.

Surveillez la charge de base : une ligne qui maintient l'air comprimé et le chauffage en fonctionnement à l'arrêt paraît beaucoup moins performante par unité lorsque la production est faible. Une simple droite de régression, avec une composante de charge de base et une composante proportionnelle au volume, vous en apprend davantage que le simple ratio.

### Indicateurs de sécurité : taux TRIR et taux DART de l'OSHA

Dans un système d'indicateurs SQCDP, la sécurité passe en premier. Aux États-Unis, la référence est la règle de tenue des registres de l'OSHA (29 CFR Part 1904). L'OSHA calcule les taux d'incidence avec une seule formule [42] :

> **Taux d'incidence = nombre de blessures et de maladies × 200 000 ÷ heures de travail des salariés**

Le chiffre 200 000 correspond aux heures travaillées par 100 salariés à raison de 40 heures par semaine pendant 50 semaines par an [42], si bien que le résultat s'exprime en « cas pour 100 équivalents temps plein ». Deux variantes sont standard :

- **TRIR** (total recordable incident rate, également total case incident rate) : tous les cas déclarables. Les cas déclarables sont les blessures et maladies liées au travail ayant entraîné un décès, une perte de conscience, des jours d'absence, un travail restreint ou un changement de poste, ou un traitement médical allant au-delà des premiers secours, parmi d'autres critères [46].
- **Taux DART** : uniquement les cas entraînant des jours d'absence, une activité de travail restreinte ou un changement de poste [46].

**Exemple :** 5 cas déclarables, dont 3 cas DART, dans une usine totalisant 420 000 heures travaillées par an.
TRIR = 5 × 200 000 ÷ 420 000 = **2,38**. Taux DART = 3 × 200 000 ÷ 420 000 = **1,43**.

Pour mise en contexte : selon le Bureau of Labor Statistics, l'industrie privée américaine a enregistré un taux total de cas déclarables de 2,3 pour 100 équivalents temps plein en 2025 (publié le 18 novembre 2026) [43]. Le graphique du BLS pour 2025 indique 2,5 cas pour 100 salariés à temps plein dans l'industrie manufacturière, soit 304 200 cas [44][43]. Ce sont des moyennes nationales, pas des références pour votre usine ; comparez plutôt avec votre propre secteur NAICS.

Indépendamment des taux, l'OSHA oblige les employeurs à signaler un décès lié au travail dans les 8 heures, ainsi qu'une hospitalisation, une amputation ou la perte d'un œil dans les 24 heures (29 CFR 1904.39) [45].

### LTIFR et le taux allemand pour 1 000 salariés

Les groupes multinationaux utilisent aussi souvent le **LTIFR** (lost time injury frequency rate, taux de fréquence des accidents avec arrêt de travail), qui repose sur une base d'un million d'heures au lieu de 200 000 :

> **LTIFR = nombre d'accidents avec arrêt de travail ÷ heures travaillées × 1 000 000**

Safe Work Australia définit le LTIFR comme le nombre d'accidents avec arrêt de travail par million d'heures travaillées ; un accident avec arrêt est un accident qui entraîne au moins une journée ou un poste entier d'absence [21].

**Exemple :** 3 accidents avec arrêt de travail pour 420 000 heures travaillées par an : 3 ÷ 420 000 × 1 000 000 = **7,14**. Notez qu'il s'agit de la même usine que précédemment : un taux DART de 1,43 et un LTIFR de 7,14 décrivent les mêmes trois cas (1,43 × 5 = 7,14) si les trois cas DART correspondent à des jours d'absence du travail. Le DART comptabilise aussi les cas de travail restreint et de changement de poste, que la plupart des définitions des accidents avec arrêt (LTI) excluent. Indiquez toujours la base de calcul lorsque vous comparez des sites.

Les usines allemandes publient un « taux pour 1 000 salariés » : le nombre d'accidents déclarables pour 1 000 équivalents temps plein. Un accident est déclarable en Allemagne si la personne assurée décède ou se trouve dans l'incapacité de travailler pendant plus de trois jours (article 193, paragraphe 1, du Code social allemand, livre VII) [20]. L'association d'assurance accidents légale allemande DGUV a fait état de 19,9 accidents du travail déclarables pour 1 000 équivalents temps plein pour 2025, soit 3,2 % de moins que l'année précédente [19]. **Exemple :** 4 accidents déclarables pour 250 équivalents temps plein donnent 4 ÷ 250 × 1 000 = **16,0**. Les seuils de déclaration étant différents, ce taux ne peut pas être comparé directement à un taux OSHA.

Complétez ces indicateurs retardés par des indicateurs avancés, tels que le nombre de presqu'accidents signalés et les actions de sécurité achevées. Une baisse du nombre de presqu'accidents signalés peut constituer un signal d'alerte si elle reflète un affaiblissement de la culture de déclaration.

### Coût par unité

> **Coût par unité = coût de la période ÷ nombre de pièces bonnes**

**Exemple pour la ligne 3, un poste (montants illustratifs en dollars US) :**
- Main-d'œuvre : 6 × 8 h × 45 $/h = 2 160 $
- Machine (amortissement, maintenance, surface au sol) : 8 h × 60 $/h = 480 $
- Matière : 432 pièces × 4,00 $ = 1 728 $ (les rebuts consomment aussi de la matière)
- Total : 4 368 $

Coût par unité = 4 368 $ ÷ 422 pièces bonnes = **10,35 $ par unité**.

Le calcul montre le lien avec le TRS : si les 432 pièces avaient toutes été bonnes du premier coup, le coût par unité serait tombé à 4 368 $ ÷ 432 = 10,11 $, sans qu'aucun taux ne change. Avec des coûts fixes, le volume de production joue le rôle principal, c'est pourquoi le coût par unité est difficile à interpréter sans tenir compte du volume. Pour les décisions de fabriquer ou d'acheter, ou de fixation des prix, il faut également disposer séparément des coûts fixes et des coûts variables. La manière de transformer les améliorations en un dossier d'investissement solide est traitée dans l'article [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. Systèmes d'indicateurs KPI : hiérarchie, indicateurs avancés et retardés, SQCDP

Les KPI pris isolément ne sont que des mesures. Un **système d'indicateurs KPI** les organise de telle sorte que chaque niveau voie les chiffres sur lesquels il peut agir, et que les chiffres des niveaux inférieurs se consolident logiquement dans ceux des niveaux supérieurs.

### Hiérarchie : usine, zone, ligne, poste de travail

| Niveau | KPI typiques | Rythme | Instance |
|---|---|---|---|
| Usine | OTIF, coût par unité, PPM client, TRIR, jours de couverture | hebdomadaire, mensuel | réunion de direction de l'usine |
| Zone | respect du planning, délai de production, TRS du goulot, coût des rebuts, productivité | quotidien, hebdomadaire | réunion de zone (Tier 3) |
| Ligne | production réelle vs. prévue par heure, TRS, FPY, principales causes d'arrêt, actions ouvertes | par équipe | réunion de ligne (Tier 2) |
| Poste de travail/machine | unités par heure vs. takt, pannes, micro-arrêts, écarts qualité | horaire, par équipe | point d'équipe (Tier 1) |

Les niveaux sont reliés par des chaînes de causes à effets : une baisse de l'OTIF au niveau de l'usine peut se retracer, à travers le respect du planning dans la zone, jusqu'au TRS et aux causes d'arrêt d'une seule machine. C'est précisément la chaîne qu'utilise une [réunion Tier](https://www.m365.fm/entity/tier-meeting/) : chaque niveau examine ses chiffres, remonte ce qu'il ne peut pas résoudre seul et reçoit un retour du niveau supérieur. Le guide [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) décrit ces routines en détail.

### Indicateurs avancés et indicateurs retardés

Les **indicateurs retardés** mesurent des résultats déjà acquis : OTIF, coût par unité, taux de rebut du mois, TRIR. Ils sont importants pour évaluer l'atteinte des objectifs, mais arrivent trop tard pour permettre des actions correctives.

Les **indicateurs avancés** mesurent les facteurs qui prédisent le résultat : respect du planning du processus amont, en-cours devant le goulot, temps de changement de série, conformité de la maintenance préventive, presque-accidents, production par heure par rapport au takt. Fabrico souligne à juste titre qu'un KPI doit déclencher une action [35] ; les indicateurs avancés le permettent alors qu'il est encore temps d'agir.

Une règle empirique : les indicateurs avancés dominent aux niveaux inférieurs, les indicateurs retardés au niveau de l'usine. Chaque KPI retardé au niveau de l'usine devrait avoir au moins un indicateur avancé attribué au niveau de la ligne.

### SQCDP : une structure pour les tableaux et les réunions

De nombreuses usines classent leurs KPI selon le **SQCDP** : Sécurité, Qualité, Coût, Délais et Personnel. L'ordre est délibéré : la sécurité avant la qualité, la qualité avant le coût. [unverified: le SQCDP est une convention de pratique, non une norme ; son origine ne peut pas être clairement documentée.] Les usines utilisent aussi des variantes avec un ordre différent ou sans le Personnel (par exemple SQDC).

| Catégorie | Ligne 3, exemples de KPI |
|---|---|
| S | blessures et presque-accidents de l'équipe, actions de sécurité ouvertes |
| Q | FPY 94,9 %, taux de rebut 2,31 %, réclamations clients |
| C | coût par unité 10,35 $, énergie 3,60 kWh/unité |
| D | prévu 450 / réel 422 pièces bonnes, TRS 75,9 %, respect du planning |
| P | présence, matrice des compétences, idées d'amélioration mises en œuvre |

Ces catégories protègent contre une fixation unilatérale sur la production. Si l'on ne mesure que la production, on obtient de la production au détriment de la qualité et de la sécurité.

## 14. Collecte de données et qualité des données

La meilleure formule ne sert à rien si les données d'entrée sont erronées. En pratique, les projets d'indicateurs de performance échouent plus souvent à cause des données qu'à cause de la méthode.

### Comparaison des méthodes de collecte de données

| Méthode | Description | Avantages | Inconvénients |
|---|---|---|---|
| Manuelle (feuille de pointage, journal de poste, Excel) | les opérateurs notent les comptages et les arrêts | rapide à mettre en place, sensibilise, pas besoin d'informatique | micro-arrêts omis, arrondis, saisies a posteriori, effort élevé |
| Terminaux de données de production | terminaux pour le démarrage/arrêt des ordres, quantités, motifs d'arrêt | motifs structurés, contexte de l'ordre | dépend de la rigueur de la saisie |
| Collecte de données machine | signaux du contrôleur (marche, arrêt, compteur) | durées complètes, arrêts courts inclus | motifs manquants sans saisie de l'opérateur |
| MES | intègre les données de production et machine, le contrôle qualité et des ordres ; KPI selon ISO 22400, ISA-95 niveau 3 (VDMA 66412-1 en Allemagne) | définitions cohérentes, temps réel | effort de mise en œuvre, maintenance des données de référence |
| Rétrofit IoT | capteurs et passerelles sur les machines existantes, données dans une plateforme cloud | fonctionne sur les machines anciennes, extensible | le contexte (ordre, produit) doit être ajouté |

La voie pragmatique est une combinaison : les signaux machine fournissent les durées et les comptages, tandis que les opérateurs ajoutent le motif d'un arrêt et les décisions qualité sur un terminal. Muchiri et Pintelon citent la précision de la collecte des données comme l'un des plus grands défis de la mesure du TRS [7]. La manière de connecter techniquement machines, MES et cloud est traitée dans le guide [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Cinq règles pour des KPI fiables

1. **Un seul modèle de temps pour tous.** Décider quels temps relèvent du temps de production planifié (pauses ? maintenance ? essais ? absence d'ordres ?). ISO 22400-2 et VDMA 66412-1 proposent un modèle [1][4].
2. **Un catalogue de motifs d'arrêt à deux niveaux au maximum.** Trop de motifs conduisent à « autre », trop peu à des Pareto dénués de sens. Chaque motif doit être rattaché clairement à une seule catégorie de perte du TRS.
3. **Maintenir des temps de cycle idéaux à jour.** La performance du TRS dépend entièrement de ces données de référence. Un standard trop généreux conduit à une performance supérieure à 100 % ou masque des pertes.
4. **Automatiser les contrôles de plausibilité.** FPY + reprise + rebut = 100 % ; temps de marche ≤ temps planifié ; performance ≤ 100 % ; somme des arrêts ≤ durée du poste.
5. **Rendre la définition visible.** Chaque KPI dispose d'une fiche de définition avec objectif, formule, source de données, responsable, cadence et cible.

### La fiche de définition du KPI

| Champ | Exemple : TRS ligne 3 |
|---|---|
| Objectif | rendre visibles les pertes de la machine goulot et les hiérarchiser |
| Formule | disponibilité × performance × qualité ; contrôle croisé quantité bonne × temps de cycle idéal ÷ temps planifié |
| Source de données | données machine (marche/arrêt, compteur), terminal (motif d'arrêt, rebut, reprise) |
| Définitions | temps planifié = poste moins pauses ; les changements de série comptent comme perte de disponibilité ; la reprise compte comme perte de qualité |
| Responsable | chef d'équipe ligne 3 |
| Cadence | par poste, tendance hebdomadaire |
| Cible | 80 % d'ici la fin du T2 (référence 75,9 %, voir section 16) |
| Escalade | deux postes consécutifs sous 70 % → réunion de niveau 2 |

## 15. Visualisation : tableaux d'atelier et tableaux de bord Power BI

### Le tableau d'atelier

Au poste de travail, la lisibilité en quelques secondes compte davantage que l'exhaustivité. La [gestion visuelle](https://www.m365.fm/entity/visual-management/) consiste ici à afficher le plan et le réalisé par heure, un rouge/vert clair par rapport à l'objectif, les trois principales causes d'arrêt et une liste d'actions avec responsables et échéances. Les tableaux horaires fonctionnent bien : l'équipe saisit le nombre prévu et le nombre réalisé pour chaque heure (ligne 3 : 60 pièces par heure de production complète à un takt de 60 s, nettement moins pendant les heures comportant une pause) et indique immédiatement une brève raison pour chaque écart. La manière de relier le flux et le tableau est décrite dans l'article [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Les tableaux numériques ne remplacent pas automatiquement le tableau blanc. Ils se justifient lorsque les données sont déjà collectées automatiquement, lorsque plusieurs équipes ou sites ont besoin de la même vue et lorsque les actions doivent être suivies. La discussion d'équipe reste la même.

### Tableau de bord Power BI : structure

Pour le niveau secteur et usine, Power BI est un outil évident si l'entreprise utilise déjà Microsoft 365. Une structure en trois pages, éprouvée :

1. **Vue d'ensemble (usine) :** vignettes SQCDP avec réalisé, objectif et tendance ; feux tricolores uniquement lorsqu'un objectif est défini.
2. **Ligne :** TRS sous forme de graphique en cascade, depuis le temps planifié jusqu'au temps à valeur ajoutée en passant par les six catégories de pertes ; diagramme de Pareto des causes d'arrêt ; FPY et rebut dans le temps.
3. **Détail et actions :** tableaux par équipe et par ordre de fabrication avec exploration détaillée (drill-through), reliés à la liste d'actions.

Pour les objectifs, les points de contrôle et les responsables, Power BI propose également des tableaux de bord avec objectifs (scorecards). Selon Microsoft, la création et le partage de ces tableaux de bord sont une fonctionnalité Pro ; leur consultation est possible avec une licence Pro ou, pour un utilisateur gratuit, dans un espace de travail sur une capacité Premium ou Fabric F64 ou supérieure [29].

### Modèle de données : schéma en étoile

Microsoft recommande un schéma en étoile pour Power BI : les tables de dimensions décrivent les entités métier et servent au filtrage et au regroupement, les tables de faits enregistrent les événements et servent aux agrégations [27]. Pour les indicateurs de fabrication, cela donne :

| Table | Type | Contenu (exemples de colonnes) |
|---|---|---|
| FactProduction | fait | Date, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | fait | Start, End, DurationMin, LineID, ReasonID |
| DimDate | dimension | Date, Week, Month, WorkingDay oui/non |
| DimShift | dimension | ShiftID, Name, Start, End |
| DimLine | dimension | LineID, Line, Area, Plant |
| DimProduct | dimension | ProductID, Product, ProductFamily |
| DimDowntimeReason | dimension | ReasonID, Reason, LossCategory (panne, changement de série, micro-arrêt …) |

La colonne LossCategory de la dimension des causes d'arrêt est la clé de la cascade des pertes : elle rattache chaque cause d'arrêt à l'une des six grandes pertes.

### Exemple DAX : agréger correctement le TRS

Les mesures suivantes calculent le TRS de manière à ce qu'il se consolide correctement à chaque niveau (équipe, ligne, semaine, usine), car il est construit à partir de temps additionnés et non de moyennes. `DIVIDE` renvoie BLANK au lieu d'une erreur lorsque le dénominateur est nul [25] ; Microsoft recommande cette fonction lorsque le dénominateur peut être nul ou vide, et l'opérateur `/` lorsque le dénominateur est une constante [26].

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

**Pourquoi la qualité est pondérée par le temps ici :** pour un seul produit, `Value Adding Min ÷ Ideal Min` est identique à quantité bonne ÷ quantité totale. Avec plusieurs produits ayant des temps idéaux différents, cette forme pondère chaque pièce par son temps idéal. Ce n'est qu'ainsi que disponibilité × performance × qualité = TRS reste exact à chaque niveau d'agrégation, car le temps de fonctionnement et le temps idéal s'annulent. Un taux de qualité en pièces est utile comme mesure complémentaire, mais il ne doit pas entrer dans la multiplication du TRS.

**Contrôle avec la ligne 3 :** temps planifié 450, temps de marche 405, temps idéal 432 × 50 ÷ 60 = 360, temps à valeur ajoutée 410 × 50 ÷ 60 = 341,67 min. Disponibilité 90,0 %, performance 88,9 %, qualité 94,9 %, TRS 341,67 ÷ 450 = 75,9 %. Les mesures reproduisent le calcul manuel de la section 7.

Une mesure supplémentaire pour le contrôle du takt :

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

Pour la ligne 3, on obtient 27 000 ÷ 410 = 65,9 s, soit au-dessus du takt de 60 s.

Les indicateurs qualité de la section 8 suivent le même schéma :

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

`Quality Sum Check` doit être égal à 100 %; une mise en forme conditionnelle qui signale les écarts en rouge rend immédiatement visibles les transactions manquantes.

**Deux pièges pour les développeurs Power BI :**
- **Double comptage des temps d'arrêt.** Si les minutes de panne et de changement de série sont stockées à la fois dans `FactProduction` et `FactDowntime`, calculez le temps de marche à partir d'une seule de ces deux tables. L'approche la plus robuste consiste à conserver `FactProduction` au grain équipe, ligne et produit, et à agréger les minutes d'arrêt depuis `FactDowntime` dans Power Query.
- **Grain du temps planifié.** Si plusieurs produits sont fabriqués au cours d'une même équipe, le temps planifié doit être réparti entre les produits (par exemple selon les dates de début et de fin des ordres). Si la totalité du temps d'équipe figure dans chaque ligne produit, il est compté plusieurs fois lors de la sommation.

### Notes sur les licences

Selon Microsoft Learn (page mise à jour le 24 août 2026) : les utilisateurs disposant d'une licence gratuite peuvent créer des rapports pour leur usage personnel, mais ne peuvent pas les partager. La publication et le partage exigent Power BI Pro. Les utilisateurs gratuits ne peuvent consulter un contenu partagé que s'il se trouve dans un espace de travail sur une capacité Power BI Premium ou une capacité Fabric F64 ou supérieure. Avec Premium Per User (PPU), le contenu ne peut être partagé qu'avec d'autres utilisateurs PPU, sauf s'il se trouve sur une capacité Premium [28]. Pour un tableau de bord d'atelier que de nombreux superviseurs ne font que consulter, la licence relève donc d'un choix d'architecture. Vérifiez les tarifs et conditions actuels auprès de Microsoft ; ils ne sont volontairement pas indiqués ici.

## 16. Comment définir les objectifs des KPI

Les objectifs sont l'endroit où les KPI causent le plus souvent des dégâts. Trois principes aident.

**1. Partir de votre propre référence, pas d'un benchmark.** Mesurez proprement pendant au moins quatre à huit semaines avant de fixer un objectif. La ligne 3 à 75,9 % de TRS gagne peu à viser un objectif de référence mondiale de 85 % tant que personne ne sait quelle perte traiter en premier.

**2. Déduire les objectifs de la demande.** Dans l'exemple, l'objectif découle directement du client : pour 450 pièces bonnes par équipe, la ligne 3 a besoin d'un TRS de 83,3 % si seules comptent les pièces bonnes au premier passage (section 7). Un objectif intermédiaire raisonnable est de 80 % ; cela représente 4,1 points de pourcentage d'écart. Mathématiquement, cela équivaut à (0,800 − 0,759) × 450 min = environ 18,3 min de temps à valeur ajoutée par équipe, par exemple grâce à moins de micro-arrêts (30 min de potentiel) ou à des changements de série plus courts (8 min de potentiel grâce au SMED).

**3. Utiliser des plages cibles plutôt que des valeurs ponctuelles pour les KPI avec des arbitrages.** Le taux d'utilisation, les en-cours et les jours de couverture ne suivent pas la règle « plus c'est élevé, mieux c'est ». Une plage (par exemple 2 à 3 jours de couverture) empêche une équipe de réduire les stocks au point de dégrader la livraison. Drees et Sack décrivent précisément cette tension entre réduction des stocks, rendement des ressources, capacité de livraison et réduction des délais de production pour les KPI de chaîne de valeur [32].

**Sur les benchmarks externes :** les valeurs sectorielles du TRS, du taux de rebut ou du MTTR citées sur de nombreuses pages de fournisseurs proviennent généralement de leurs propres données clients, sans méthode divulguée [37]. Utilisez-les tout au plus comme repère approximatif, jamais comme objectif. Les exceptions sont les statistiques officielles publiant leur méthode, comme les taux d'accidents du BLS par secteur NAICS [43].

## 17. Erreurs courantes et comment les éviter

| Erreur | Conséquence | Contre-mesure |
|---|---|---|
| Surcharge de KPI : 30 KPI sur le tableau de bord | personne ne sait ce qui compte ; les réunions tournent au cours magistral | 5 à 8 KPI par niveau, classés selon SQCDP |
| KPI sans définition | chaque service calcule différemment ; les comparaisons n'ont aucune valeur | fiche de définition, termes selon ISO 22400 (VDMA 66412-1 en Allemagne) |
| Moyenne de pourcentages | TRS d'usine faussé | recalculer les KPI à chaque niveau à partir des sommes |
| KPI comme évaluation individuelle de performance | manipulation des données, pannes dissimulées | KPI pour les processus, pas pour les personnes |
| Objectif sans chemin | frustration, embellissement des chiffres | chaque objectif appuyé par une analyse des pertes et un plan d'action |
| Uniquement des indicateurs retardés | les contre-mesures arrivent trop tard | associer un indicateur avancé à chaque indicateur retardé |
| Temps standards trop généreux | performance supérieure à 100 % ou pertes masquées | justifier techniquement les temps idéaux et les revoir chaque année |
| Données sans routine | le tableau de bord n'est plus consulté au bout de trois mois | cadences de réunion fixes avec les KPI comme ordre du jour |
| Comparaison de taux de sécurité sur des bases différentes | confusion entre TRIR, DART, LTIFR et taux allemands | toujours indiquer la formule et la base (200 000 h, 1 million d'heures, 1 000 ETP) |

### Loi de Goodhart

En 1975, l'économiste britannique Charles Goodhart a observé que toute régularité statistique observée tend à s'effondrer dès qu'une pression est exercée sur elle à des fins de contrôle [24]. L'anthropologue Marilyn Strathern a résumé cela en 1997 par la phrase bien connue « Lorsqu'une mesure devient un objectif, elle cesse d'être une bonne mesure » [23]. Sur le terrain, cela se traduit ainsi : si le TRS est lié aux primes, les changements de série sont évités (lots plus gros, plus de stocks), les arrêts sont reclassés en « planifiés », ou les temps standards sont étirés. Le KPI augmente ; l'usine ne s'améliore pas.

Trois antidotes : toujours considérer un KPI avec un contre-KPI (TRS avec stocks et OTIF), tenir les définitions centralisées et journaliser les modifications, et utiliser les KPI en réunion comme un motif de poser des questions, non comme un verdict.

## 18. Feuille de route : déployer les KPI de production en 90 jours

La feuille de route suivante sert de cadre pour une ligne ou un secteur. Elle ne nécessite aucun logiciel ; un logiciel accélère les phases 2 et 3.

**Phase 1, semaines 1 à 3 : objectif et définitions**
- Clarifier les objectifs du secteur (que demande le client ? où se trouvent les plus grandes pertes ?).
- Sélectionner 5 à 8 KPI, au moins un par catégorie SQCDP.
- Définir le modèle temporel, le catalogue des motifs d'arrêt et les fiches de définition ; vérifier les temps de cycle idéaux.

**Phase 2, semaines 4 à 8 : mesurer et apprendre**
- Démarrer la collecte de données, manuellement ou en semi-automatique au début si nécessaire.
- Contrôler la plausibilité chaque jour ; préciser les définitions dès que des questions apparaissent.
- Établir des référentiels sur au moins quatre semaines.

**Phase 3, semaines 9 à 12 : piloter**
- Dériver les objectifs de la demande et du référentiel.
- Construire le tableau de bord et, si utile, un rapport Power BI.
- Mettre en place des routines à trois niveaux : Niveau 1 par poste, Niveau 2 quotidien, Niveau 3 hebdomadaire.
- Choisir les premiers sujets d'amélioration à partir des diagrammes de Pareto des pertes et les traiter avec PDCA.

**Ensuite :** vérifier chaque trimestre que chaque KPI déclenche encore une décision. Les KPI que personne n'utilise sont abandonnés. L'intégration des KPI dans un système d'amélioration plus large est traitée dans les guides [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) et [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Les objectifs du goulot d'étranglement alimentent aussi directement l'ordonnancement, voir [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## 19. KPI issus de la modélisation de la chaîne de valeur : iFAKT Polaris

> **Note : l'auteur travaille chez iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), dont le siège est à Stuttgart, en Allemagne, développe des logiciels de planification et d'optimisation des processus logistiques et de production fondés sur la technologie Microsoft [33]. L'entreprise travaille depuis longtemps sur les KPI : en 2011, Jörg Drees et Christoph Sack ont montré dans la revue allemande ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) que les KPI de chaîne de valeur entrent facilement en conflit entre réduction des stocks, rendement des ressources, capacité de livraison et réduction des délais, et qu'un ensemble de KPI choisi délibérément, combiné aux méthodes lean, permet des boucles de contrôle durables [32].

Selon le fournisseur, la famille de logiciels [iFAKT Polaris](https://www.m365.fm/entity/polaris/) comprend Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator et Analyzer [31]. Deux d'entre eux sont pertinents pour les KPI de production :

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)**, selon ifakt.de, rassemble les KPI de tous les modules Polaris dans des tableaux de bord structurés, visualise les délais, le taux d'utilisation, les goulots d'étranglement et l'état des projets, montre les limites de capacité et le potentiel d'amélioration, et compare les scénarios, les plans et la performance réelle [30]. La page du fournisseur ne donne aucune information sur les intégrations, le modèle de déploiement ou les tarifs.
- **Polaris VSM**, selon le fournisseur, calcule automatiquement à partir du modèle de chaîne de valeur des KPI lean tels que le délai, le temps de cycle, le WIP, le ratio de valeur ajoutée et le facteur de flux, propose des tableaux de bord pour le délai, le WIP, le ratio de valeur ajoutée et le TRS, et compare côte à côte les KPI de scénarios [31].

**Évaluation :** un outil de ce type ne remplace ni des définitions claires ni la routine de réunion. Sa valeur réside dans le calcul cohérent des KPI à partir d'un seul modèle et dans la comparaison de scénarios avant la mise en œuvre, par exemple l'effet d'un plafond de WIP sur le délai et l'OTIF. Son adéquation à votre site doit être vérifiée comme pour toute autre solution : sur vos données, votre environnement informatique et les décisions que les KPI doivent soutenir. Davantage d'informations sur la famille de produits figurent dans le guide [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/).

## 20. Glossaire

| Terme | Explication |
|---|---|
| Disponibilité (TRS) | temps de fonctionnement ÷ temps de production planifié [7] |
| Temps de cycle | temps mesuré pour réaliser une unité à un poste [10] |
| Taux DART | taux OSHA des cas avec jours d'absence, travail restreint ou changement de poste pour 100 ETP [42][46] |
| Jours de couverture | stock ÷ consommation moyenne journalière |
| Efficacité (ISO 22400) | correspond à la performance du TRS : temps de fonctionnement planifié par article × quantité ÷ temps de production réel [3] |
| Facteur de flux | délai de traversée ÷ temps d'opération (Wiendahl) [14][15] |
| FPY | rendement au premier passage, part des unités bonnes sans reprise ni rebut [36] |
| ISA-95 | ANSI/ISA-95 (CEI 62264) ; niveau 3 = gestion des opérations de fabrication [40] |
| Indicateur retardé | KPI qui mesure un résultat déjà survenu |
| Délai de traversée | temps entre le début et la fin d'une commande, y compris tous les temps d'attente, de file d'attente et de transport [10][15] |
| Indicateur avancé | KPI qui prédit un résultat futur |
| Loi de Little | L = λW : en-cours moyen = débit × délai de traversée moyen [13] |
| Chargement | temps de production planifié ÷ temps calendaire ; facteur du TEEP [8] |
| MES | système d'exécution de la fabrication ; ISA-95 niveau 3 [40] ; directive KPI VDMA 66412-1 en Allemagne [4] |
| MTBF / MTTR | temps moyen de fonctionnement entre pannes / temps moyen de réparation |
| TRS | disponibilité × performance × qualité [7] |
| Temps d'opération | temps de préparation plus temps d'usinage d'une étape de travail (Wiendahl) [14][15] |
| Temps de commande (REFA) | temps de préparation plus temps de fonctionnement (quantité × temps par unité) [16][17] |
| OTIF | à temps et complet ; pas de définition normalisée [18] |
| PPM | pièces par million, défauts ramenés à un million [36] |
| SMED | méthode de changement de série visant moins de dix minutes [11] |
| SQCDP | Sécurité, Qualité, Coût, Délais, Personnes : ordre de classement des KPI |
| Takt time | temps disponible ÷ demande client [9] |
| TEEP | TRS × chargement [8] |
| TRIR | taux total d'incidents enregistrables OSHA : cas enregistrables × 200 000 ÷ heures travaillées [42] |
| En-cours | travail en cours de fabrication |

## 21. FAQ : KPI de fabrication

**Que sont les KPI de fabrication ?**
Les KPI de fabrication sont des mesures qui quantifient le temps, la production, la qualité, les délais, le coût et la sécurité d'une opération de production, par exemple le takt time, le TRS, le taux de rebut ou l'OTIF. Chaque KPI nécessite une définition, une formule, une unité et une période.

**Quelle est la différence entre un KPI et une métrique ?**
Tout KPI est une métrique, mais toute métrique n'est pas un KPI. Un KPI est directement lié à un objectif et guide régulièrement les décisions, comme l'OTIF ou le TRS du goulot. Le nombre de pièces produites est une métrique ; seul, il déclenche rarement une action.

**Quels sont les KPI les plus importants en fabrication ?**
Pour la plupart des sites, un ensemble de base suffit : le TRS du goulot, le FPY ou le taux de rebut, l'OTIF, le délai de traversée ou l'en-cours, le coût unitaire et un taux de sécurité tel que le TRIR. Les KPI « les plus importants » dépendent de l'endroit où se situent vos plus grandes pertes.

**Quels sont les 5 indicateurs clés de performance en fabrication ?**
Il n'existe pas de top cinq officiel. Un ensemble pratique couvre un KPI par catégorie SQCDP : le TRIR (sécurité), le rendement au premier passage (qualité), le coût unitaire (coût), l'OTIF (délais) et un indicateur lié aux personnes, tel que le nombre d'idées d'amélioration mises en œuvre, ainsi que le TRS du goulot.

**Comment calcule-t-on le takt time ?**
Takt time = temps de production disponible ÷ demande client. Exemple : 450 min (27 000 s) de temps disponible par équipe et une demande de 450 unités donnent 60 s par unité. Déduisez les pauses, mais pas les arrêts non planifiés.

**Quelle est la différence entre takt time et temps de cycle ?**
Le takt time provient de la demande client et indique à quelle fréquence une pièce doit être terminée. Le temps de cycle est mesuré au niveau du process et indique à quelle fréquence une pièce est réellement terminée. Le temps de cycle doit être inférieur au takt, avec une marge.

**Comment calcule-t-on le délai de traversée en fabrication ?**
Directement, comme horodatage de fin moins horodatage de début par commande, ou indirectement avec la loi de Little : en-cours moyen ÷ débit moyen. 2 700 pièces d'en-cours pour un débit quotidien de 900 pièces donnent 3 jours ouvrés.

**Comment calcule-t-on le TRS ?**
TRS = disponibilité × performance × qualité. Avec 90 % de disponibilité, 88,9 % de performance et 94,9 % de qualité, le TRS est de 75,9 %. Contrôle croisé : nombre de bonnes pièces × temps de cycle idéal ÷ temps de production planifié.

**Quel est un bon score de TRS ?**
85 % est souvent présenté comme « de classe mondiale » et attribué à Nakajima, mais ce chiffre est contesté et dépend de l'industrie [8]. Un objectif plus pertinent est celui qui découle de votre propre référence et de la demande client.

**Comment calcule-t-on le taux de rebut ?**
Taux de rebut = nombre de pièces mises au rebut ÷ nombre total de pièces × 100 %. 10 pièces mises au rebut sur 432 produites donnent 2,31 %.

**Quelle est la différence entre le taux de rebut et le rendement au premier passage ?**
Le taux de rebut ne compte que les pièces finalement écartées. Le rendement au premier passage (FPY) ne compte que les pièces bonnes sans aucune correction, donc aussi sans reprise. Le FPY, le taux de reprise et le taux de rebut totalisent 100 %.

**Que signifie OTIF ?**
On time in full : la part des livraisons ou des lignes de commande qui arrivent chez le client à temps et complètes. Il n'existe pas de définition normalisée ; il faut fixer la date de référence, la tolérance et le seuil [18].

**Comment calcule-t-on le TRIR ?**
TRIR = nombre de cas déclarables OSHA × 200 000 ÷ nombre total d'heures travaillées [42]. 5 cas déclarables avec 420 000 heures donnent 2,38. Le chiffre 200 000 correspond à 100 salariés à temps plein travaillant 40 heures par semaine pendant 50 semaines.

**Quelle est la différence entre le taux d'utilisation de la capacité et l'efficacité d'utilisation ?**
Le taux d'utilisation de la capacité est un indicateur de planification (charge rapportée à la capacité). L'efficacité d'utilisation mesure pendant l'exécution la part du temps occupé qui a effectivement été productive. Un taux d'utilisation élevé n'est pas un objectif en soi, car les délais de traversée augmentent fortement à proximité de la limite de capacité.

**Combien d'indicateurs KPI un site doit-il suivre ?**
Cinq à huit KPI par niveau de management, classés par SQCDP, chaque indicateur retardé étant associé à un indicateur avancé. Un nombre plus élevé de KPI accroît l'effort de collecte de données sans améliorer le pilotage.

**Quelle norme définit les KPI de production ?**
La norme ISO 22400-2:2014 définit les KPI du management des opérations de fabrication, avec leurs formules, unités et calendrier [1]. La norme ISA-95 définit le contexte de niveau 3 dans lequel ils sont calculés [40] ; en Allemagne, la directive VDMA 66412-1 relative aux KPI des MES est également largement utilisée [4].

**Peut-on construire des KPI de production dans Power BI ?**
Oui. L'essentiel est un schéma en étoile avec des tables de faits et de dimensions [27] et des mesures qui calculent les KPI à partir de durées cumulées. Le partage nécessite Power BI Pro ; les lecteurs sans licence Pro ont besoin d'un contenu sur une capacité Premium ou Fabric F64 ou supérieure [28].

**Que sont le MTBF et le MTTR ?**
Le MTBF est la durée moyenne de fonctionnement entre deux pannes, le MTTR le temps moyen de remise en état de la machine. 16 200 min de fonctionnement et 40 pannes d'une durée totale de 1 000 min donnent un MTBF de 405 min et un MTTR de 25 min.

## 22. Conclusion

Les KPI de fabrication ne sont pas une fin en soi. Leur valeur tient à trois éléments : une définition sans ambiguïté fondée sur l'ISO 22400-2 (et sur l'ISA-95 pour le contexte système), une base de données fiable issue des signaux machines et de la saisie par les opérateurs, et une routine dans laquelle les écarts donnent lieu à des questions et à des actions. L'exemple de la ligne 3 montre à quel point les KPI sont liés : un temps de cycle inférieur au takt ne garantit pas la livraison tant que les pannes, les changements de série et les pertes de qualité font tomber le TRS à 75,9 %; les 28 pièces manquantes par poste peuvent être rattachées à chaque catégorie de perte et aux minutes correspondantes. Commencez par quelques KPI, calculez-les à chaque niveau à partir de sommes, fixez les objectifs à partir de la demande client, placez la sécurité en premier avec un taux correctement calculé, et considérez chaque KPI comme une raison d'engager la discussion au gemba.

### Pour aller plus loin sur m365.fm

- Guides : [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) · [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) · [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) · [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog : [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Termes : [Takt Time](https://www.m365.fm/entity/takt-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Micro Stops](https://www.m365.fm/entity/micro-stops/) · [Scrap Rate](https://www.m365.fm/entity/scrap-rate/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visual Management](https://www.m365.fm/entity/visual-management/) · [Tier Meeting](https://www.m365.fm/entity/tier-meeting/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) à Stuttgart, en Allemagne. Sur m365.fm, il écrit sur la production au plus juste (lean manufacturing), les KPI de fabrication, les méthodes de chaîne de valeur et la numérisation de la production avec Microsoft 365, Power BI et Azure. Il s'intéresse particulièrement à la manière de définir et de visualiser les KPI afin qu'ils conduisent à des décisions sur le terrain.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

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
