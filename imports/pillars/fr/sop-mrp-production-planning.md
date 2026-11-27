# SEO metadata

| Field | Value |
|---|---|
| Meta title | Guide S&OP, PDP et MRP : planification des ventes et des opérations |
| Meta description | Planification des ventes et des opérations, PDP et MRP expliqués : le cycle S&OP mensuel, le calcul MRP détaillé, DDMRP, options ERP, KPI et modèles. |
| Slug | `sop-mrp-production-planning` |

# Planification des ventes et des opérations (S&OP) et MRP : comment fonctionne la planification de production, du plan aux pièces

> **Réponse courte :** La planification des ventes et des opérations (S&OP) est un processus de management mensuel dans lequel les ventes, les opérations, la supply chain et la finance s'accordent sur un plan unique pour la demande, l'approvisionnement et les stocks par famille de produits, généralement sur un horizon glissant de 18 à 36 mois [5][6] ; les sources académiques décrivent son noyau tactique comme pouvant atteindre environ 18 mois [1]. Le plan directeur de production (MPS) traduit ce plan en quantités de produits finis par semaine, et la planification des besoins en composants (MRP) éclate le MPS à travers les nomenclatures en ordres datés pour chaque pièce et chaque matière première [7][13]. Dans la plupart des usines, le MPS et le MRP fonctionnent dans le système ERP ; le S&OP fonctionne dans un cycle de réunions appuyé par des tableurs, un ERP ou un logiciel de planification dédié.

> **Points clés**
> - Le S&OP décide *combien* par famille de produits et par mois ; le MPS décide *quels produits finis* par semaine ; le MRP décide *quelles pièces, en quelle quantité et quand*. L'ordonnancement détaillé (séquence par machine et par heure) se situe en dessous et fait l'objet du [guide de l'ordonnancement de production et de l'APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - Le concept de S&OP remonte à la planification agrégée de la production des années 1950 ; les consultants d'Oliver Wight ont façonné le S&OP moderne dans les années 1980 et ont forgé le terme de planification intégrée des affaires (IBP) au début des années 2000 [1][2].
> - Joseph Orlicky a formalisé le MRP en 1964 ; Black & Decker en a été le premier utilisateur, et en 1981 environ 8 000 entreprises utilisaient le MRP [3][4]. Oliver Wight l'a étendu au MRP II en 1983 [3].
> - Un cycle S&OP mensuel type comporte cinq étapes : collecte des données, revue de la demande, revue de l'approvisionnement, réunion de pré-S&OP (réconciliation) et réunion S&OP de direction [1].
> - Le MRP suppose une capacité infinie et des délais d'approvisionnement fixes ; c'est pourquoi il nécessite un contrôle de capacité grossier au-dessus de lui et un ordonnanceur à capacité finie en dessous [8][9].
> - Une petite modification du MPS peut déplacer simultanément des ordres à plusieurs niveaux de nomenclature (« nervosité »). Le gel de l'horizon proche du programme et des règles de coût de modification l'atténuent mieux que des stocks de sécurité supplémentaires [10].
> - Le DDMRP remplace l'éclatement piloté par les prévisions, aux points de découplage choisis, par des tampons dimensionnés (rouge, jaune, vert) et une équation de flux net [11][12].
> - Mesurez le S&OP avec la précision des prévisions (WMAPE) *et* le biais, le taux d'atteinte du plan, la stabilité du programme et le taux de service. Une prévision précise à 94 % mais toujours surestimée de 2 % continue à créer des stocks.

## Table des matières

1. [Qu'est-ce que la planification des ventes et des opérations ? Définition et périmètre](#quest-ce-que-la-planification-des-ventes-et-des-opérations--définition-et-périmètre)
2. [La hiérarchie de la planification de production : S&OP, MPS, RCCP, MRP et ordonnancement](#la-hiérarchie-de-la-planification-de-production--sop-mps-rccp-mrp-et-ordonnancement)
3. [Historique : de la planification agrégée et d'Orlicky à l'IBP et au DDMRP](#historique--de-la-planification-agrégée-et-dorlicky-à-libp-et-au-ddmrp)
4. [Le processus S&OP : le cycle mensuel étape par étape](#le-processus-sop--le-cycle-mensuel-étape-par-étape)
5. [Stratégies d'approvisionnement : niveau, suivi de la demande ou hybride (exemple détaillé)](#stratégies-dapprovisionnement--niveau-poursuite-ou-hybride-exemple-chiffré)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [Modèles de maturité S&OP](#modèles-de-maturité-du-sop)
8. [Programme directeur de production (MPS) et disponible à la promesse (ATP)](#programme-directeur-de-production-mps-et-disponible-à-la-promesse-atp)
9. [Planification grossière des capacités (RCCP)](#planification-grossière-de-la-capacité-rccp)
10. [Planification des besoins en matières (MRP) : fonctionnement du calcul](#planification-des-besoins-en-composants-mrp--fonctionnement-du-calcul)
11. [MRP II, CRP et la boucle fermée](#mrp-ii-crp-et-la-boucle-fermée)
12. [Nervosité du MRP : pourquoi les plans sautent et comment les stabiliser](#nervosité-du-mrp--pourquoi-les-plans-sautent-et-comment-les-apaiser)
13. [MRP piloté par la demande (DDMRP)](#planification-des-besoins-en-matières-à-la-demande-ddmrp)
14. [Planification de production dans l'ERP : ce que font les systèmes et où ils s'arrêtent](#la-planification-de-production-dans-lerp--ce-que-font-les-systèmes-et-où-ils-sarrêtent)
15. [Modèles : calendrier S&OP, ordres du jour, plan de famille, enregistrements MPS et MRP](#modèles--calendrier-sop-ordres-du-jour-plan-par-famille-enregistrements-mps-et-mrp)
16. [Indicateurs S&OP et MRP avec exemples détaillés](#kpi-sop-et-mrp-avec-exemples-détaillés)
17. [Feuille de route de mise en œuvre : 12 mois vers un S&OP et un MRP opérationnels](#feuille-de-route-de-mise-en-œuvre--12-mois-pour-un-sop-et-un-mrp-opérationnels)
18. [Erreurs courantes](#erreurs-courantes)
19. [Limites du S&OP et du MRP](#limites-du-sop-et-du-mrp)
20. [IA et planification numérique : ce qui fonctionne aujourd'hui](#ia-et-planification-numérique--ce-qui-fonctionne-aujourdhui)
21. [Glossaire](#glossaire)
22. [FAQ : planification des ventes et des opérations et MRP](#faq--planification-des-ventes-et-des-opérations-et-mrp)
23. [Conclusion et premières étapes](#conclusion-et-premières-étapes)

## Qu'est-ce que la planification des ventes et des opérations ? Définition et périmètre

**La planification des ventes et des opérations (S&OP)** est un processus de décision récurrent qui intègre la prévision de la demande et la planification de l'approvisionnement dans un plan unique auquel les ventes, le marketing, les opérations, la chaîne d'approvisionnement et la finance se conforment [1]. La littérature académique la décrit comme un processus tactique dont l'horizon atteint environ 18 mois, généralement exécuté chaque mois ou déclenché par des événements [1]. Les sources des éditeurs et des praticiens évoquent souvent un horizon glissant de 18 à 36 mois [5][6]. Cette différence n'est pas une contradiction : les premiers mois sont planifiés plus finement, les mois éloignés seulement par familles et blocs de capacité.

Trois caractéristiques distinguent le S&OP d'une réunion de prévision commerciale ou d'une réunion de production :

- **Un seul jeu de chiffres.** La demande, l'approvisionnement, les stocks ou le carnet de commandes et la valeur financière du plan sont examinés ensemble, par famille de produits, en unités et en dollars.
- **Des décisions, pas des rapports.** Le résultat est un ensemble de décisions : approuver une hausse de capacité, accepter un taux de service inférieur pour une famille à faible rotation, reporter un lancement, produire par anticipation avant un arrêt.
- **Intégration plutôt que coordination.** Rogelio Oliva et Noel Watson ont montré dans une étude de cas que le S&OP apporte de la valeur lorsque les fonctions planifient *ensemble, selon des objectifs communs*, et non lorsqu'elles se contentent de coordonner des plans que chacune a établis seule [21].

Le corpus professionnel de référence pour le S&OP, l'ordonnancement directeur et le MRP aux États-Unis est maintenu par l'ASCM (Association for Supply Chain Management, anciennement APICS). Son programme CPIM (Certified in Planning and Inventory Management) couvre le S&OP, la demande, l'approvisionnement, les stocks et les ordonnancements détaillés comme modules distincts [24].

### Planification, pas ordonnancement

Le S&OP n'est pas le planning de production. Il travaille avec des familles de produits, des périodes mensuelles et des capacités agrégées, par exemple « heures de soudure » ou « équipes de la ligne 2 ». La question « quel ordre passe en premier demain sur la machine 14 » relève de l'ordonnancement détaillé, que le [guide sur l'ordonnancement de production et l'APS](https://www.m365.fm/en/learn/production-scheduling-aps/) traite en profondeur, y compris l'ordonnancement à capacité finie et la méthode drum-buffer-rope. Le présent article reste à un niveau supérieur et relie le S&OP au programme directeur de production et au MRP.

### À quoi sert le S&OP

Le tableau présente des décisions typiques que seul un S&OP transversal peut prendre, parce qu'aucune fonction unique ne porte à la fois le coût et le bénéfice.

| Décision | Qui en profite | Qui paie | Pourquoi le S&OP est nécessaire |
|---|---|---|---|
| Ajouter une deuxième équipe au soudage à partir de mars | Ventes (taux de service) | Opérations (coût de main-d'œuvre), RH (recrutement) | arbitrage entre chiffre d'affaires et coût |
| Préproduire 2 000 unités avant l'arrêt estival | Clients, ventes | Finance (fonds de roulement), entrepôt | l'investissement en stock doit être approuvé |
| Abandonner une variante à faible marge | Opérations (moins de changements de série) | Ventes (chiffre d'affaires perdu) | décision de portefeuille à impact sur la marge |
| Accepter une commande promotionnelle importante | Ventes, marketing | Opérations (heures supplémentaires), achats | faisabilité en capacité et en matières |
| Qualifier un second fournisseur pour une pièce critique | Chaîne d'approvisionnement (risque) | Achats, qualité (coût de qualification) | résilience face au coût unitaire, voir [résilience de la chaîne d'approvisionnement](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Qui y participe

La réunion de direction est présidée par le directeur général ou le président de l'unité d'activité. Les membres permanents typiques sont les responsables des ventes, du marketing, des opérations, de la chaîne d'approvisionnement, de la finance et, pour les produits d'ingénierie, de l'ingénierie ou de la gestion de produit. En dessous de la réunion de direction, le planificateur de la demande, l'ordonnanceur maître, le planificateur d'approvisionnement et un analyste financier effectuent l'essentiel du travail. La section 4 détaille les rôles étape par étape.

## La hiérarchie de la planification de production : S&OP, MPS, RCCP, MRP et ordonnancement

La planification et le contrôle de la fabrication (MPC) sont organisés en hiérarchie. Chaque niveau travaille sur un horizon plus long et avec des données plus agrégées que le niveau inférieur, et transmet ses décisions vers le bas sous forme d'objectifs. Le matériel de cours de Stanley Gershwin au MIT résume ainsi le MRP II : une hiérarchie de planification à long, moyen et court terme, avec la gestion de la demande, les prévisions, la planification des capacités et le contrôle d'atelier autour du noyau MRP [8].

| Niveau | Horizon typique | Période | Objet planifié | Question clé | Résultat | Outil typique |
|---|---|---|---|---|---|---|
| Stratégique et plan d'affaires | 3–5 ans | année | activité, usine, réseau | Quels marchés, quelles usines et quels investissements de capacité ? | budget, plan d'investissement | outils financiers, Excel |
| S&OP / IBP | 18–36 mois [5][6] | mois | famille de produits, ressource agrégée | Combien vendons-nous et fabriquons-nous, à quel stock et quel coût ? | plan de famille approuvé | logiciel S&OP, ERP, Excel |
| Programme directeur de production (MPS) | de quelques semaines à plusieurs mois, au moins le délai d'approvisionnement cumulé | semaine (jour à court terme) | article final ou article de planification | Quels articles finaux, en quelle quantité, à quelle semaine ? | MPS, ATP | ERP |
| Planification grossière des capacités (RCCP) | identique au MPS | semaine ou mois | ressources critiques | Le MPS est-il réalisable au goulot ? | charge vs capacité par ressource clé | ERP, Excel |
| Planification des besoins en composants (MRP) | identique au MPS | jour ou semaine | chaque composant et matière | Quelles pièces, en quelle quantité, quand commander ou lancer ? | ordres planifiés, demandes d'achat, messages d'exception | ERP |
| Planification des besoins en capacité (CRP) | semaines | jour ou semaine | chaque poste de travail | Y a-t-il assez de capacité pour tous les ordres planifiés et lancés ? | profils de charge détaillés | ERP |
| Ordonnancement détaillé et lancement | heures à quelques semaines | heure, équipe | opération sur une machine | Dans quelle séquence chaque opération est-elle exécutée ? | ordonnancement, liste de lancement | APS, MES |

Deux règles maintiennent la hiérarchie :

1. **La désagrégation doit être cohérente.** La somme du MPS de tous les articles finaux d'une famille doit correspondre au plan de famille S&OP du même mois, dans une tolérance convenue (par exemple plus ou moins 5 %). Sinon, la décision S&OP n'a aucun effet sur l'atelier.
2. **La faisabilité est vérifiée à chaque niveau.** Le S&OP vérifie la capacité agrégée (planification des ressources), le MPS est vérifié par la planification grossière des capacités, et les résultats du MRP sont vérifiés par la planification des besoins en capacité ou par un ordonnanceur à capacité finie. Le MRP lui-même ne vérifie pas la capacité [8][9].

### Où se situent ERP, APS et MES

La norme ANSI/ISA-95 sépare la planification d'entreprise et la logistique (niveau 4, généralement l'ERP) de la gestion des opérations de fabrication (niveau 3, généralement le MES et l'ordonnancement détaillé) [25]. Le S&OP, le MPS et le MRP sont des fonctions de niveau 4. Le [guide MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explique le côté niveau 3, et le [guide Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/) montre comment les données entre les niveaux peuvent être intégrées.

### Make-to-stock, assemble-to-order, make-to-order

L'environnement de production détermine où se situe le PDP dans la nomenclature :

| Environnement | Le client attend | PDP planifié à | Exemple | Axe S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | rien (expédié depuis le stock) | article final | biens de consommation, pompes standard | objectif de stock par famille |
| Assemble-to-order (ATO) | l'assemblage final | modules et options (nomenclature de planification) | bureaux configurables, camions, PC | répartition des modules, pourcentages d'options |
| Make-to-order (MTO) | la fabrication | article final ou sous-ensembles clés après commande | pièces de machines sur mesure | objectif de carnet de commandes, délai de livraison |
| Engineer-to-order (ETO) | la conception et la fabrication | jalons de projet, composants à long délai d'approvisionnement | machines spéciales, aménagements intérieurs d'avions | capacité d'ingénierie et d'essais, voir [planification de production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/) |

En MTS, le S&OP équilibre la demande et un objectif de stock. En MTO et ETO, il équilibre la demande et un objectif de carnet de commandes ou un délai de livraison annoncé. Mélanger ces logiques au sein d'une même famille est une cause fréquente de chiffres S&OP incohérents.

## Historique : de la planification agrégée et d'Orlicky à l'IBP et au DDMRP

### Planification agrégée et premiers systèmes MRP (années 1950–1960)

Le S&OP est né au début des années 1950 sous la forme de la planification agrégée de la production : ajuster un rythme de production agrégé à la demande prévue en arbitrant entre stocks, variations d'effectifs et heures supplémentaires [1]. À peu près à la même époque, les motoristes aéronautiques Rolls-Royce et General Electric informatisaient la planification des matières [3].

En 1964, Joseph Orlicky, ingénieur chez IBM, formalise la planification des besoins en composants (MRP) [4]. La première entreprise à le mettre en œuvre fut Black & Decker en 1964, avec Dick Alban comme chef de projet [3]. Le livre d'Orlicky *Material Requirements Planning* (McGraw-Hill, 1975) devient le texte de référence [13]. Sa troisième édition, une mise à jour de 2011 par Carol Ptak et Chad Smith, introduit la planification des besoins pilotée par la demande (DDMRP) [4].

L'adoption progresse rapidement : environ 700 entreprises utilisent le MRP en 1975 et environ 8 000 en 1981, selon les chiffres cités par Wikipédia [3]. En 1967, George Plossl et Oliver Wight, collègue d'Orlicky chez IBM, co-écrivent un ouvrage sur la gestion de la production et des stocks [4].

### MRP II, ERP et S&OP (années 1980–1990)

En 1983, Oliver Wight étend le MRP à la **planification des ressources de fabrication (MRP II)** en y ajoutant la planification directrice, la planification grossière des capacités, la planification des besoins en capacité, le S&OP et le lien avec la planification financière [3]. La société d'Oliver Wight décrit le S&OP comme développé par Oliver Wight dans les années 1980 [2] ; Wikipédia attribue le terme et son sens moderne à Richard (Dick) Ling, alors consultant chez Oliver Wight [1]. Gartner invente l'expression « progiciel de gestion intégré » (ERP) en 1990 [4]. Les ERP intègrent la finance, les ventes, les achats et les RH autour d'un noyau de planification qui reste celui du MRP II.

### IBP, DDMRP et planification concurrente (années 2000–aujourd'hui)

Au début des années 2000, Oliver Wight crée la **planification intégrée d'entreprise (IBP)**, qui étend le S&OP à l'ensemble de l'entreprise, y compris la planification du portefeuille et la planification financière, avec un horizon d'au moins 24 mois [2]. En 2011, Ptak et Smith publient la troisième édition du livre d'Orlicky avec le **DDMRP** [4], et des éditeurs d'ERP comme Microsoft ont depuis intégré le DDMRP à leurs moteurs de planification [11]. Les éditeurs de logiciels de planification promeuvent désormais une planification « concurrente » ou continue, qui recalcule les plans en quelques minutes plutôt que dans un traitement mensuel par lots [16] ; cette affirmation est un argument commercial de l'éditeur et est traitée dans la section consacrée à l'IA.

| Année | Jalon | Source |
|---|---|---|
| début des années 1950 | planification agrégée de la production ; Rolls-Royce et GE informatisent la planification des matières | [1][3] |
| 1964 | Orlicky formalise le MRP chez IBM ; Black & Decker en est le premier utilisateur | [3][4] |
| 1967 | Plossl et Wight publient sur la gestion de la production et des stocks | [4] |
| 1975 | *Material Requirements Planning* d'Orlicky ; environ 700 utilisateurs de MRP | [3][13] |
| 1981 | environ 8 000 utilisateurs de MRP | [3] |
| 1983 | Oliver Wight définit le MRP II | [3] |
| années 1980 | S&OP développé par Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner invente le terme « ERP » | [4] |
| début des années 2000 | Oliver Wight crée le terme IBP | [2] |
| 2011 | troisième édition du livre d'Orlicky par Ptak et Smith, introduisant le DDMRP | [4] |

## Le processus S&OP : le cycle mensuel étape par étape

La description universitaire la plus citée du processus S&OP comporte cinq étapes : collecte des données, planification de la demande, planification de l'offre, réunion préparatoire et réunion de direction [1][20]. Certains auteurs ajoutent une revue des événements ou des produits au début et une étape de révision à la fin [1] ; Anaplan, éditeur de logiciels de planification, décrit six revues : produit, demande, offre, finance, pré-S&OP et S&OP de direction [15]. Kinaxis décrit un cycle mensuel traditionnel en cinq étapes [16]. Les différences tiennent surtout aux intitulés : les cycles couvrent les mêmes sujets, dans à peu près le même ordre.

Le calendrier suivant suppose que le mois se clôture le dernier jour ouvré et que la réunion de direction a lieu pendant la troisième semaine.

| Jour ouvré | Étape | Responsable | Entrées | Sorties | Durée de la réunion |
|---|---|---|---|---|---|
| 1–3 | 1. Collecte des données et mise à jour du portefeuille | planificateur de la demande, gestion produit | réalisés du mois précédent (expéditions, commandes, production, stocks), nouveaux produits et dates d'abandon | historique mis à jour, pack d'indicateurs KPI, modifications produit | aucune (travail de bureau) |
| 4–6 | 2. Revue de la demande | VP ventes ou marketing ; planificateur de la demande prépare | prévision statistique, apport des ventes, événements marketing, plans des grands clients | plan de demande consensuel non contraint par famille, en unités et en dollars, avec hypothèses et risques | 60–90 minutes |
| 7–9 | 3. Revue de l'offre | VP opérations ou chaîne d'approvisionnement ; planificateur maître et planificateur de l'offre préparent | demande consensuelle, objectifs de stock ou de carnet de commandes, capacité par ressource clé, contraintes fournisseurs | plan d'offre contraint, problèmes de capacité et options avec coûts | 60–90 minutes |
| 10–12 | 4. Réunion pré-S&OP (réconciliation) | responsable du processus S&OP ; analyste financier | plans de demande et d'offre, écarts, plan financier | plan réconcilié en unités et en dollars, décisions préparées avec options, points ouverts | 90–120 minutes |
| 13–15 | 5. Réunion de direction S&OP | directeur général | recommandations pré-S&OP, KPI | plan approuvé, décisions, escalades clôturées | 60–120 minutes |
| 16–20 | Déploiement | planificateur maître, planificateurs | plan famille approuvé | MPS mis à jour, calcul MRP, actions d'achat et de capacité | aucune |

### Étape 1 : Collecte des données et mise à jour du portefeuille

Le cycle démarre dès la clôture du mois. Le planificateur de la demande extrait les expéditions, les commandes entrantes, la production, les stocks et le carnet de commandes par famille et par SKU, nettoie l'historique des événements ponctuels (un incendie chez un client, un appel d'offres unique) et lance la prévision statistique. La gestion produit met à jour les dates de lancement et d'abandon. Une prévision qui ignore qu'une variante sera abandonnée au mois 4 continuera de commander ses pièces.

**Liste de contrôle, étape 1**

| Élément | Terminé lorsque |
|---|---|
| Réalisés chargés | expéditions, commandes, production et stocks se réconcilient avec la clôture financière dans la tolérance convenue |
| Historique nettoyé | valeurs aberrantes signalées avec motif, et non supprimées |
| Prévision statistique lancée | modèle et paramètres documentés par famille |
| Modifications du portefeuille | lancements, abandons, modifications techniques avec dates et responsables |
| Pack d'indicateurs KPI | précision et biais de la prévision, atteinte du plan, service, stocks par rapport à l'objectif |

### Étape 2 : Revue de la demande

La revue de la demande produit le **plan de demande consensuel non contraint** : ce que les clients voudront si l'offre était illimitée. Les ventes et le marketing ajustent la prévision statistique avec des informations que l'historique ne contient pas : changements de prix, promotions, perte d'un client, nouveau distributeur. Chaque ajustement est consigné avec son responsable et son hypothèse. Cet enregistrement permet ensuite de savoir si les corrections manuelles ont amélioré ou dégradé la précision.

Les erreurs typiques à cette étape sont de prévoir uniquement en chiffre d'affaires (les opérations ne peuvent pas fabriquer des dollars), de prévoir au niveau SKU sur 24 mois (trop de bruit) et de confondre objectif commercial et prévision. Un objectif est ce que l'entreprise souhaite ; une prévision est ce qu'elle attend. L'écart entre les deux est un sujet business pour la réunion de direction, et non un chiffre à dissimuler dans la prévision.

**Ordre du jour de la revue de la demande (60–90 minutes)**

| Temps | Sujet | Responsable |
|---|---|---|
| 10 min | mois écoulé : précision et biais de la prévision par famille, principaux écarts avec cause racine | planificateur de la demande |
| 20 min | base statistique par rapport au dernier consensus, changements au-delà du seuil | planificateur de la demande |
| 30 min | apports des ventes et du marketing par famille : événements, clients, tarification | ventes, marketing |
| 15 min | risques et opportunités avec probabilité et quantité | VP ventes |
| 5 min | consensus par famille, points ouverts, responsables | planificateur de la demande |

### Étape 3 : Revue d'approvisionnement

La revue d'approvisionnement confronte la demande consensuelle à la capacité, aux matières et aux objectifs de stock. Les planificateurs traduisent les volumes par famille en charge sur les **ressources clés** (postes de travail goulots, fournisseurs critiques, groupes de main-d'œuvre qualifiée) à l'aide d'une nomenclature de ressources : heures par unité et par ressource. Lorsque la charge dépasse la capacité, ils élaborent des options chiffrées : heures supplémentaires, équipe supplémentaire, sous-traitance, préproduction, report de la date de livraison ou acceptation d'un niveau de service inférieur. La revue d'approvisionnement ne tranche pas entre les options à impact financier significatif ; elle les prépare pour la réunion de pré-S&OP. La section 5 montre comment ces options sont comparées.

**Ordre du jour de la revue d'approvisionnement (60 à 90 minutes)**

| Heure | Sujet | Responsable |
|---|---|---|
| 10 min | mois écoulé : atteinte du plan, respect du MPS, performance des fournisseurs | responsable du programme directeur |
| 25 min | charge vs capacité par ressource clé et par mois (planification grossière de capacité) | planificateur approvisionnement |
| 20 min | projection des stocks et des carnets de commandes vs objectifs par famille | responsable du programme directeur |
| 20 min | contraintes et options avec coût et risque | directeur des opérations |
| 5 min | plan d'approvisionnement contraint, points à traiter en pré-S&OP | responsable du programme directeur |

### Étape 4 : Réunion de pré-S&OP (réconciliation)

La réunion de pré-S&OP réunit la demande, l'approvisionnement et la finance. La finance valorise le plan contraint au coût standard et au prix de vente, et le compare au budget ou à la dernière prévision financière. L'équipe résout ce qu'elle peut dans le cadre des droits de décision convenus et prépare le reste sous forme de notes de décision : deux ou trois options, chacune avec son impact sur les volumes, le service, les coûts et le besoin en fonds de roulement, ainsi qu'une recommandation. Une bonne note de décision tient sur une page.

### Étape 5 : Réunion S&OP de direction

La réunion de direction examine les indicateurs clés, approuve le plan et tranche les décisions préparées. Ce n'est pas le lieu pour retravailler les chiffres. Ordre du jour type :

| Heure | Sujet |
|---|---|
| 10 min | revue des indicateurs clés : service, précision et biais des prévisions, stocks et carnets de commandes vs objectifs, atteinte du plan |
| 15 min | vue d'ensemble par famille : plan de demande vs budget, plan d'approvisionnement vs demande |
| 45 min | décisions : une note de décision à la fois, options, recommandation, décision consignée |
| 10 min | risques pour les 3 à 6 prochains mois, statut des nouveaux produits |
| 10 min | revue du journal des décisions, des responsables et des échéances |

### Déploiement : du plan approuvé au MPS

Dans les quelques jours suivant la réunion de direction, le responsable du programme directeur désagrège le plan approuvé par famille en MPS par article final et par semaine (section 8), le vérifie avec la planification grossière de capacité (section 9) et lance le MRP (section 10). Les achats reçoivent les ordres planifiés nouveaux ou modifiés, et les décisions de capacité (deuxième équipe, heures supplémentaires) sont mises en œuvre avec les RH et l'usine. Sans ce déploiement, le S&OP se réduit à un diaporama mensuel sans effet sur l'atelier.

### Rôles et droits de décision

| Rôle | Responsabilités |
|---|---|
| Sponsor exécutif (directeur général ou président) | préside la réunion de direction, porte les décisions finales, veille à la présence et à la discipline décisionnelle |
| Responsable du processus S&OP | gère le calendrier, prépare le pré-S&OP, tient les journaux de décisions et d'hypothèses |
| Planificateur de la demande | prévision statistique, processus de consensus, indicateurs de prévision |
| Responsables ventes et marketing | intelligence de marché, responsabilité du chiffre de demande consensuel |
| Responsable du programme directeur | MPS, règles d'ATP, planification grossière de capacité, désagrégation |
| Planificateurs approvisionnement et matières | exceptions MRP, capacité fournisseurs, bons de commande |
| Responsable usine ou opérations | plan de capacité, main-d'œuvre, décisions d'heures supplémentaires et d'équipes |
| Partenaire financier | valorisation en dollars, réconciliation avec le budget, besoin en fonds de roulement |
| Gestion produit ou ingénierie | lancements, retraits de produits, modifications techniques |

Les droits de décision doivent être formalisés par écrit. Exemple : la revue d'approvisionnement peut approuver des heures supplémentaires jusqu'à 10 % de la capacité d'un poste de travail ; au-delà, ainsi que toute modification des objectifs de stock, la décision revient à la réunion de direction.

## Stratégies d'approvisionnement : niveau, poursuite ou hybride (exemple chiffré)

La planification agrégée propose trois stratégies d'approvisionnement classiques, que les guides S&OP citent mais calculent rarement [6] :

- **Niveau :** produire à cadence constante et laisser le stock absorber les variations de la demande.
- **Poursuite (chase) :** modifier la cadence de production chaque mois pour suivre la demande, avec heures supplémentaires, main-d'œuvre temporaire ou équipes supplémentaires, et maintenir un stock constant.
- **Hybride (mixte) :** modifier la cadence quelques fois et accepter une certaine accumulation de stock.

**Exemple chiffré (valeurs illustratives).** Un fabricant de bureaux planifie la famille « bureaux à structure en acier » sur six mois. Le stock initial est de 800 unités, le stock final visé est de 800 unités, et un minimum de 500 unités doit être disponible à la fin de chaque mois (stock de sécurité). La cadence de production précédente était de 3 000 unités par mois. Le soudage est le goulot d'étranglement : 5 cellules de soudage × 2 équipes × 8 heures × 20 jours = 1 600 heures par mois ; chaque bureau nécessite 0,4 heure de soudage, donc la cadence maximale est de 1 600 / 0,4 = **4 000 bureaux par mois**. Coûts : 4 $ par unité et par mois pour le stock final ; chaque unité de variation de la cadence mensuelle (embauche, formation, mise en place des heures supplémentaires ou licenciement) coûte 5 $.

| Mois | Demande | Niveau : production | Niveau : stock final | Poursuite : production | Poursuite : stock final | Hybride : production | Hybride : stock final |
|---|---|---|---|---|---|---|---|
| Janv. | 3 000 | 3 800 | 1 600 | 3 000 | 800 | 3 500 | 1 300 |
| Févr. | 3 200 | 3 800 | 2 200 | 3 200 | 800 | 3 500 | 1 600 |
| Mars | 4 200 | 3 800 | 1 800 | **4 200** | 800 | 4 000 | 1 400 |
| Avr. | 4 800 | 3 800 | 800 | **4 800** | 800 | 4 000 | 600 |
| Mai | 4 000 | 3 800 | 600 | 4 000 | 800 | 4 000 | 600 |
| Juin | 2 800 | 3 800 | 1 600 | 2 800 | 800 | 3 000 | 800 |
| **Total** | **22 000** | **22 800** | **8 600 unités-mois** | **22 000** | **4 800 unités-mois** | **22 000** | **6 300 unités-mois** |

Pourquoi la cadence de niveau est de 3 800 : la demande cumulée jusqu'en mai est de 19 200 unités ; avec 500 unités requises en fin de mai et 800 disponibles en début de période, la production jusqu'en mai doit être d'au moins 19 200 + 500 − 800 = 18 900, soit 3 780 par mois. Arrondi à 3 800, le plan de niveau termine juin avec 1 600 unités, soit 800 au-dessus de l'objectif.

| Élément de coût | Niveau | Poursuite | Hybride |
|---|---|---|---|
| Changements de cadence (unités × 5 $) | 3 000 → 3 800 : 800 → 4 000 $ | +200, +1 000, +600, −800, −1 200 = 3 800 → 19 000 $ | +500, +500, −1 000 = 2 000 → 10 000 $ |
| Possession (unités-mois × 4 $) | 8 600 → 34 400 $ | 4 800 → 19 200 $ | 6 300 → 25 200 $ |
| **Total** | **38 400 $** | **38 200 $** | **35 200 $** |
| Réalisable au goulot de soudage (≤ 4 000/mois) ? | oui | **non** (mars 4 200, avril 4 800) | oui |
| Stock final par rapport à la cible de 800 | +800 | conforme à la cible | conforme à la cible |

Sur le papier, le plan de poursuite paraît presque aussi peu coûteux que le plan de niveau, mais il n'est pas réalisable : mars et avril dépassent la capacité de soudage, sauf si l'entreprise ajoute une troisième équipe, ce qui entraîne son propre coût. Le plan hybride est le moins cher parmi les options réalisables et fait tourner le soudage à 100 % exactement pendant trois mois, ce qui ne laisse aucune capacité de protection. Les changements de cadence ne représentent pas seulement une ligne de coût. Un plan de poursuite implique des embauches, de la main-d'œuvre intérimaire, des licenciements ou des heures supplémentaires soutenues ; les conventions collectives, les règles de préavis pour les heures supplémentaires et la fatigue limitent la vitesse à laquelle une usine peut changer sa cadence, et les opérateurs supportent le coût de chaque variation. La revue d'approvisionnement doit demander à la production et aux RH ce qui est réaliste avant de modéliser ce scénario. La finance ajoutera un second effet : en coût standard, les mois de faible production absorbent moins de frais fixes, donc un plan de poursuite crée des écarts d'imputation que le plan de niveau évite.

C'est la décision que la revue d'approvisionnement doit soumettre au comité de direction : approuver le plan hybride, et décider s'il faut qualifier un sous-traitant en soudage pour 200 à 400 bureaux par mois comme assurance. Faire fonctionner un goulot à pleine utilisation fait fortement grimper les files d'attente et les délais, comme le montrent la [section du guide APS consacrée à la physique de l'usine](https://www.m365.fm/en/learn/production-scheduling-aps/) avec la loi de Little et les courbes de fonctionnement, et le [guide de la théorie des contraintes](https://www.m365.fm/en/learn/theory-of-constraints/) explique comment protéger le tambour.

## S&OP vs. IBP vs. S&OE

Les trois termes décrivent des périmètres et des horizons différents.

| Aspect | S&OP | Integrated business planning (IBP) | Sales and operations execution (S&OE) |
|---|---|---|---|
| Question | La demande et l'offre correspondent-elles par famille ? | L'ensemble du plan d'entreprise (portefeuille, demande, offre, finances, stratégie) tient-il la route ? | Que modifions-nous cette semaine pour exécuter le plan ? |
| Horizon | Oliver Wight : généralement 6 à 12 mois ; SAP et d'autres : 18 à 36 mois glissants [2][5] | au moins 24 mois [2] | 0 à 3 mois (semaines) [unverified: horizon tel qu'il est couramment utilisé par les praticiens] |
| Cadence | mensuelle | mensuelle | hebdomadaire |
| Unités | unités et dollars par famille | principalement des dollars, plus des unités | unités par SKU et par client |
| Président | directeur général des opérations ou VP opérations | PDG ou président de l'unité commerciale | responsable supply chain ou planification |
| Origine | Oliver Wight, années 1980 [1][2] | Oliver Wight, début des années 2000 [2] | terme de praticiens, aucune origine unique vérifiée |

Oliver Wight décrit le S&OP comme centré sur les arbitrages de la supply chain, et l'IBP comme mettant l'entreprise entière en perspective à travers le portefeuille, la demande, l'offre et les finances [2]. Beaucoup d'entreprises utilisent les termes de manière interchangeable. L'étiquette importe moins que deux faits : la finance et le portefeuille font-ils partie du processus, et l'équipe de direction prend-elle des décisions dans ce cadre ? Le S&OE est le pont hebdomadaire entre le plan approuvé et le MPS : il traite les changements de demande à court terme, les perturbations d'approvisionnement et l'allocation à l'intérieur des zones gelée et pâteuse du MPS (section 8).

**Ordre du jour hebdomadaire du S&OE (30 à 45 minutes, à titre indicatif)**

| Durée | Sujet | Responsable |
|---|---|---|
| 5 min | semaine écoulée : respect du MPS, expéditions vs plan, trois principaux écarts | planificateur directeur (master scheduler) |
| 10 min | changements de demande dans la fenêtre de temps de planification : nouvelles commandes importantes, annulations, allocation d'une offre insuffisante | planificateur de la demande, service client |
| 10 min | problèmes d'approvisionnement : retards fournisseurs, pannes machines, blocages qualité, pénuries de matières issues des exceptions MRP | planificateur de l'offre, usine |
| 10 min | décisions dans les règles du MPS ; tout ce qui sort des règles est remonté à l'étape S&OP suivante | responsable supply chain |
| 5 min | actions, responsables, échéances | planificateur directeur (master scheduler) |

## Modèles de maturité du S&OP

Les modèles de maturité aident une entreprise à situer son niveau et à identifier l'étape suivante. Trois sont largement utilisés.

**Gartner.** Gartner publie une feuille de route de maturité du S&OP à cinq niveaux [17]. Sa page de présentation publique ne donne pas les noms des niveaux ; des sources secondaires décrivent les niveaux approximativement comme suit, du niveau 1 (aucun objectif commun, planification sur tableur et non coordonnée) à un niveau 5 dans lequel le S&OP fait partie de la planification globale de l'entreprise et où les décisions reposent sur des scénarios, en passant par la planification commerciale opérationnelle, l'équilibrage demande-offre sur toute la supply chain et un mix produit orienté demande et rentable [18]. [unverified: noms de niveaux propres à Gartner ; les descriptions ci-dessus reprennent le résumé de Jedox, un éditeur de logiciels de planification.]

**Grimson et Pyke (2007).** J. Andrew Grimson et David Pyke ont proposé un cadre à cinq dimensions et cinq stades : absence de processus S&OP, réactif, standard, avancé et proactif [1][19].

**Wagner, Ullrich et Transchel (2014).** Stephan Wagner et ses collègues décrivent quatre dimensions et six stades, du stade non développé au stade proactif, ainsi que le processus en cinq étapes utilisé à la section 4 [1][20].

Une auto-évaluation simple, dérivée des dimensions communes à ces modèles (réunions et collaboration, organisation, mesure, technologies de l'information, intégration des plans) :

| Dimension | Stade 1 : aucun ou réactif | Stade 2 : standard | Stade 3 : avancé | Stade 4 : proactif |
|---|---|---|---|---|
| Réunions | gestion des urgences au coup par coup | cycle mensuel, le directeur y assiste parfois | cycle complet en cinq étapes, le directeur préside chaque mois | le cycle intègre des scénarios et la stratégie, les dirigeants décident entre des options |
| Organisation | aucun responsable | coordinateur à temps partiel | responsable de processus dédié, droits de décision écrits | le S&OP est la manière dont l'entreprise est dirigée |
| Mesure | aucune | service et stocks | exactitude et biais des prévisions, atteinte du plan | KPI liés aux résultats financiers et aux primes |
| IT | tableurs séparés | tableur partagé ou rapports ERP | outil de planification intégré, rapprochement famille/SKU | planification par scénarios, flux de données automatisé |
| Intégration des plans | plans commercial et de production divergents | un plan de volumes unique | plan de volumes réconcilié avec le plan financier | un plan unique alimente le budget, le MPS et les investissements |

Les données de recherche sur les effets du S&OP sont favorables, mais elles ne sont pas uniformes. Une revue de la littérature d'Antônio Márcio Tavares Thomé et de ses coauteurs, publiée dans l'*International Journal of Production Economics*, a fait la synthèse des travaux sur le S&OP jusqu'en 2012 [22], et une étude complémentaire a établi un lien entre le S&OP et la performance des entreprises [23]. Des travaux plus récents soulignent que la bonne conception du S&OP dépend du contexte, comme la taille de l'entreprise, la complexité des produits et l'incertitude de la chaîne d'approvisionnement [34]. Les affirmations de gains en pourcentage fixes attribués au S&OP sur les pages des éditeurs doivent être lues comme des affirmations des éditeurs.

## Programme directeur de production (MPS) et disponible à la promesse (ATP)

Le **programme directeur de production** énonce ce que l'entreprise prévoit de produire, sur la base du plan tactique et des contraintes budgétaires, comme le présente la documentation JD Edwards d'Oracle [7]. Il se situe entre le S&OP et le MRP : il est suffisamment précis (produit fini, semaine) pour piloter la planification des matières et des capacités, et suffisamment stable pour protéger l'usine du bruit quotidien. Le MRP calcule ensuite les besoins nets phasés dans le temps pour chaque composant afin de soutenir le MPS [7].

### Désagrégation : de la famille au produit fini

Le plan S&OP approuvé pour les « bureaux à structure en acier » en avril est de 4 000 unités. Le planificateur maître le répartit par produit fini en fonction de la composition actuelle et des commandes connues : 55 % D100 (2 200), 30 % D120 (1 200) et 15 % D140 (600), puis par semaine. Les nomenclatures de planification sont utilisées lorsque les options sont planifiées en pourcentages, par exemple 60 % de structures noires et 40 % de structures blanches.

### Barrières temporelles

Le MPS est divisé en zones soumises à des règles de modification différentes. Noms de zones et règles typiques (les définitions exactes et la durée des zones diffèrent selon l'entreprise et l'ERP) :

| Zone | Étendue typique | Ce qui peut changer | Qui approuve |
|---|---|---|---|
| Gelée | d'aujourd'hui à la barrière de la demande (par exemple le délai d'assemblage final) | rien, sauf urgences | directeur d'usine ou réunion S&OE |
| Semi-gelée | de la barrière de la demande à la barrière de planification (par exemple le délai cumulé des pièces achetées à long délai) | mix au sein de la famille ; quantités dans la tolérance convenue | planificateur maître |
| Libre | au-delà de la barrière de planification | tout ce qui est compatible avec le S&OP | système de planification et planificateur maître |

La zone gelée correspond à ce que désignent les diapositives du MIT de Gershwin lorsqu'elles parlent de figer le calendrier à court terme : cela réduit la nervosité au prix d'une perte de flexibilité [8]. La section 12 quantifie cet arbitrage.

### Enregistrement MPS avec solde disponible projeté et ATP

**Exemple détaillé (chiffres illustratifs).** Produit fini D100, stock disponible de 60 unités, taille de lot MPS de 200, stock de sécurité nul, barrière de la demande à la fin de la semaine 2. À l'intérieur de la barrière de la demande, la demande projetée ne comprend que les commandes clients ; au-delà, elle correspond au plus élevé entre la prévision et les commandes clients.

| Semaine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Prévision | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Commandes clients | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Demande projetée | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (achèvements) | 200 | | | 200 | | 200 | | 200 |
| Solde disponible projeté (PAB), départ 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| ATP discret | 60 | | | 170 | | 200 | | 200 |
| ATP cumulé | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Comment les chiffres s'obtiennent :

- **PAB, semaine 1 :** 60 + 200 − 90 = 170. Semaine 2 : 170 − 70 = 100. Semaine 3 : 100 − 100 = 0. La semaine 4 descendrait à −100, donc le MPS planifie un lot de 200 : 0 + 200 − 100 = 100. Et ainsi de suite.
- **L'ATP discret** n'est calculé que pour les semaines comportant une réception MPS : stock disponible (première période uniquement) plus la quantité MPS moins l'ensemble des commandes clients jusqu'à la réception MPS suivante. Semaine 1 : 60 + 200 − (90 + 70 + 40) = 60. Semaine 4 : 200 − (20 + 10) = 170. Semaines 6 et 8 : 200 − 0 = 200.
- **L'ATP cumulé** additionne l'ATP discret dans le temps : 60, puis 60 + 170 = 230, puis 430, puis 630.
- Certains systèmes ERP utilisent une variante à horizon glissant : si les commandes clients d'une période ultérieure dépassent la réception MPS de cette période, le déficit est déduit de l'ATP des périodes antérieures afin que les mêmes unités ne soient pas promises deux fois. Dans cet exemple, aucune période n'est survendue, donc les deux méthodes donnent le même résultat.

Ce que les ventes peuvent promettre : un client qui veut 100 bureaux en semaine 2 peut en obtenir au maximum 60 avec le plan actuel ; les 100 sont disponibles à partir de la semaine 4 (ATP cumulé de 230). Le PAB de 0 en semaine 3 ne pose pas de problème pour les promesses, car l'ATP s'appuie sur les commandes clients et non sur les prévisions. C'est en revanche un signal pour le planificateur maître : le plan n'a aucune marge si les commandes de la semaine 3 dépassent les prévisions. Les systèmes ERP tels que JD Edwards présentent l'ATP et l'ATP cumulé comme des sorties standard du MPS [7].

### Règles du MPS qui garantissent la crédibilité du planning

| Règle | Pourquoi |
|---|---|
| La somme du MPS par famille reste dans une tolérance de ±5 % du plan S&OP (tolérance donnée à titre d'exemple) | sinon les décisions S&OP n'atteignent pas l'atelier |
| Pas de surcharge : charge RCCP ≤ capacité démontrée sur les ressources clés | un MPS surestimé rend fictives les dates de l'ATP et du MRP |
| Toute modification dans la zone gelée exige une approbation nominative | protège les matières et la capacité déjà engagées |
| Ordres planifiés fermes pour le court terme | le calcul MRP ne peut pas les déplacer automatiquement |
| L'ATP est vérifié avant chaque promesse de commande | évite de promettre deux fois la même capacité |
| Revue hebdomadaire du MPS lors de la réunion S&OE | détecte les écarts avant qu'ils ne deviennent des commandes en retard |

## Planification grossière de la capacité (RCCP)

La planification grossière de la capacité vérifie le MPS par rapport à quelques **ressources critiques** avant que le MRP ne l'éclate. Elle est « grossière » parce qu'elle s'appuie sur une nomenclature de ressources (heures par article final à chaque ressource clé) et non sur les gammes complètes, et qu'elle ignore la plupart des décalages de délai.

**Exemple détaillé (chiffres illustratifs).** MPS hebdomadaire pour les trois modèles de bureaux et leur nomenclature de ressources sur trois ressources clés :

| Modèle | MPS semaine 14 | Soudage (h/unité) | Thermolaquage (h/unité) | Assemblage final (h/unité) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Ressource | Calcul de la charge | Charge (h) | Capacité hebdomadaire (h) | Taux d'utilisation |
|---|---|---|---|---|
| Soudage | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111 %** |
| Thermolaquage | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71 % |
| Assemblage final | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90 % |

Le soudage est en surcharge de 45 heures. Options : déplacer 75 bureaux D140 (75 × 0,60 = 45 h) en semaine 15 si celle-ci dispose de marge et si les dates clients le permettent, planifier 45 heures supplémentaires, ou confier une partie des cadres D100 au sous-traitant prévu lors de la revue d'approvisionnement. La capacité hebdomadaire de soudage de 400 heures correspond aux 1 600 heures par mois utilisées dans le S&OP (section 5), et c'est là l'essentiel : la RCCP utilise les mêmes définitions de ressources que la revue d'approvisionnement S&OP, ce qui permet de réconcilier les niveaux.

Trois techniques de RCCP sont courantes dans la littérature et les systèmes ERP : la planification de capacité à l'aide de coefficients globaux (pourcentages historiques des heures totales par poste de travail), les bills of capacity ou nomenclatures de ressources (heures par unité et par ressource, comme ci-dessus) et les profils de ressources qui ajoutent des décalages temporels. Plus la méthode est détaillée, plus elle se rapproche de la planification des besoins en capacité (section 11).

## Planification des besoins en composants (MRP) : fonctionnement du calcul

**La planification des besoins en composants (MRP, Material Requirements Planning)** utilise la nomenclature et les données de stock pour calculer les besoins nets échelonnés dans le temps de chaque composant et sous-ensemble, et propose un plan de réapprovisionnement qui soutient le MPS [7]. Sa logique repose sur une idée d'Orlicky : la demande en composants est *dépendante* de la demande du produit fini ; elle doit donc être calculée et non prévue [13]. Si l'usine fabrique 150 bureaux en semaine 3 et que chaque bureau comporte quatre pieds, il faut 600 pieds avant la semaine 3, quelle que soit la prévision statistique pour les pieds.

### Les données d'entrée

| Donnée d'entrée | Contenu | Problème de qualité de données courant |
|---|---|---|
| Programme directeur de production | produits finis, quantités, dates | MPS non réconcilié avec le S&OP, ou surchargé |
| Nomenclature (BOM) | relations parent-composant, quantité par unité, taux de rebut, dates d'effectivité | nomenclature d'ingénierie utilisée à la place de la nomenclature de fabrication ; sous-ensembles fictifs (phantom) manquants ; obsolète après des modifications d'ingénierie |
| Fiches de stock | stock physique, alloué, stock de sécurité | inventaires inexacts ; rebuts et consommations non enregistrés |
| Ordres ouverts (réceptions programmées) | ordres de fabrication et d'achat lancés avec dates d'échéance | dates d'échéance non tenues à jour ; ordres clôturés en retard |
| Données de planification de la fiche article | délai d'obtention, règle de dimensionnement de lot, multiples de commande, minimums, rendement | délais d'obtention fixés il y a des années et jamais revus |

Les diapositives du MIT de Gershwin énumèrent les mêmes éléments de base : besoins bruts, réceptions programmées, stock projeté, besoins nets, réceptions d'ordres planifiés et lancements d'ordres planifiés, décalés du délai d'obtention [8].

### Les cinq étapes pour chaque article

1. **Besoins bruts :** le MPS pour les produits finis, ou les lancements d'ordres planifiés de tous les parents multipliés par la quantité par unité, pour les composants.
2. **Calcul net (netting) :** stock projeté = stock physique précédent + réceptions programmées − besoins bruts. Lorsque ce stock tomberait sous le stock de sécurité, le manque est le **besoin net**.
3. **Dimensionnement de lot :** le besoin net devient une **réception d'ordre planifié** selon la règle de dimensionnement de lot (lot pour lot, quantité fixe de commande, multiples, quantité de commande par période).
4. **Décalage (offsetting) :** la réception d'ordre planifié est décalée vers l'arrière du délai d'obtention de l'article pour donner le **lancement d'ordre planifié**.
5. **Éclatement (explosion) :** les lancements d'ordres planifiés deviennent les besoins bruts du niveau suivant de la nomenclature.

Les articles sont traités niveau par niveau selon l'ordre des **codes de bas niveau** : chaque article reçoit un code égal au niveau le plus bas auquel il apparaît dans une nomenclature quelconque, de sorte que tous les besoins bruts de tous les parents soient rassemblés avant le calcul net de l'article [8]. L'exemple détaillé montre pourquoi cela compte.

### Exemple détaillé : éclatement MRP et calcul net sur deux niveaux de nomenclature

**Structure du produit (illustrative).** Le bureau D100 se compose d'un plateau T-20, d'un cadre de pied F-10 et de 1 mètre de tube d'acier S-5 pour une entretoise. Chaque cadre de pied F-10 est soudé à partir de 4 mètres de tube d'acier S-5. S-5 apparaît donc au niveau 1 (directement dans D100) et au niveau 2 (dans F-10) ; son code de bas niveau est 2.

```
D100 Bureau (niveau 0)
├── T-20 Plateau, qté 1 (niveau 1, fabriqué en interne, délai d'obtention 1 semaine)
├── F-10 Cadre de pied, qté 1 (niveau 1, soudé en interne, délai d'obtention 2 semaines)
│   └── S-5 Tube d'acier, 4 m (niveau 2, acheté, délai d'obtention 2 semaines)
└── S-5 Tube d'acier, 1 m (niveau 1, entretoise)
```

Pour garder les tableaux lisibles, la ligne MPS indique la semaine de démarrage de l'assemblage final de D100 ; les composants doivent être disponibles au début de cette semaine.

**MPS pour D100 (démarrage de l'assemblage final) :**

| Semaine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| Démarrages d'assemblage D100 | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Article T-20 Plateau.** Lot pour lot, délai d'obtention 1 semaine, stock physique 30, réception programmée de 100 en semaine 1, stock de sécurité 0.

| Semaine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Besoins bruts | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Réceptions programmées | 100 | | | | | | | |
| Stock projeté (départ 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Besoins nets | | | 140 | 100 | | 150 | 100 | 120 |
| Réceptions d'ordres planifiés | | | 140 | 100 | | 150 | 100 | 120 |
| Lancements d'ordres planifiés | | 140 | 100 | | 150 | 100 | 120 | |

Semaine 1 : 30 + 100 − 120 = 10. Semaine 3 : 10 − 150 = −140, donc 140 sont nécessaires et lancés une semaine plus tôt, en semaine 2.

**Article F-10 Cadre de pied.** Quantité de commande fixe 200 (un lot de soudage), délai d'obtention 2 semaines, stock physique 120, aucune réception programmée, stock de sécurité 0.

| Semaine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Besoins bruts | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Stock prévisionnel en fin de période (départ 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Besoins nets | | | 150 | 50 | | | 100 | 20 |
| Réceptions de commandes planifiées | | | 200 | 200 | | | 200 | 200 |
| Lancements de commandes planifiées | 200 | 200 | | | 200 | 200 | | |

Semaine 3 : 0 − 150 = −150, donc un lot de 200 arrive, laissant 50. Semaine 4 : 50 − 100 = −50, un autre lot de 200 arrive, laissant 150. La semaine 6 consomme exactement les 150 restants. Les lancements sont décalés de deux semaines.

**Article S-5 Tube en acier (code de niveau bas 2).** Acheté, délai de 2 semaines, commandé par multiples de 500 m, stock de 1 400 m, réception programmée de 500 m en semaine 1, stock de sécurité de 100 m. Les besoins bruts combinent les deux parents :

| Semaine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Issus des lancements F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Issus des départs D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Besoins bruts** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Réceptions programmées | 500 | | | | | | | |
| Stock prévisionnel en fin de période (départ 1 400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Besoins nets | | | 70 | | 470 | 920 | 20 | |
| Réceptions de commandes planifiées | | | 500 | | 500 | 1 000 | 500 | |
| Lancements de commandes planifiées | 500 | | 500 | 1 000 | 500 | | | |

Semaine 3 : 180 − 150 = 30, inférieur au stock de sécurité de 100, donc le besoin net est de 70 et un multiple de 500 est commandé (stock prévisionnel 530). Semaine 6 : 130 − 950 = −820 ; pour terminer au minimum à 100, le besoin net est de 920, arrondi à 1 000.

**Ce que montre l'exemple**

- **La demande dépendante est irrégulière.** La demande de bureaux est assez régulière (100 à 150 par semaine), mais la demande de tube passe de 100 à 950 m par semaine, car les lots de soudage de 200 cadres consomment 800 m d'un coup. Une prévision statistique de la consommation de tube manquerait ces pics ; l'éclatement de la nomenclature, lui, les détecte.
- **Le codage par niveau bas prévient les ruptures.** Si S-5 avait été calculé au niveau 1 (avec seulement la demande de traverses de 120 à 150 m par semaine), la MRP n'aurait vu aucun besoin avant la semaine 7, et les cadres auraient manqué de tube dès la semaine 2.
- **Les tailles de lots se multiplient.** Deux règles de dimensionnement de lots (200 cadres, multiples de 500 m) ont transformé 740 bureaux en 2 500 m de commandes de tube sur cinq semaines. Le [guide de dimensionnement des lots](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) explique comment choisir ces règles ; le [guide de gestion des stocks industriels](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) traite du stock de sécurité.
- **La sortie de l'ERP est une liste d'actions :** lancer 200 cadres et acheter 500 m de tube cette semaine ; lancer 140 plateaux la semaine prochaine. Le planificateur traite ces éléments sous forme de **messages d'exception** (lancer, avancer, reporter, annuler) plutôt que de lire les tableaux complets.

### Imputation et messages d'exception

L'**imputation** relie chaque besoin à sa source : le besoin de tube de 950 m de la semaine 6 s'impute au lancement F-10 de la semaine 6 (800 m) et au départ D100 de la semaine 6 (150 m). Grâce à l'imputation, un planificateur qui ne peut pas obtenir 1 000 m de tube en semaine 6 voit quels bureaux et quelles commandes clients sont menacés.

Messages d'exception MRP typiques et actions à mener :

| Message | Signification | Action habituelle |
|---|---|---|
| Lancer la commande | l'ordre planifié se situe dans sa fenêtre de lancement | convertir en ordre de fabrication ou d'achat après vérification de la capacité et des matières |
| Avancer la réception (accélérer) | une commande ouverte est due plus tard que nécessaire | demander au fournisseur ou à l'usine de l'avancer ; si c'est impossible, remonter pour modifier le PDP |
| Reporter la réception (ralentir) | une commande ouverte est due plus tôt que nécessaire | la reporter pour réduire les stocks et libérer de la capacité |
| Annuler | une commande ouverte n'est plus nécessaire | annuler ou réduire ; vérifier les conditions d'annulation |
| En retard | la date de lancement ou la date d'échéance est déjà dépassée | le plan n'est pas réalisable tel quel : corriger le PDP, pas seulement la commande |
| Sous le stock de sécurité | stock prévisionnel inférieur au niveau de sécurité | vérifier si le stock de sécurité est correct avant d'accélérer |

Une usine qui affiche des centaines d'ordres planifiés en retard après chaque calcul MRP n'a pas un problème de MRP. Elle a un PDP non réalisable, ou des délais et des tailles de lots qui ne reflètent pas la réalité.

### MRP vs. point de commande et kanban

Le MRP n'est pas la seule façon de réapprovisionner les pièces. Les systèmes à point de commande et le kanban déclenchent le réapprovisionnement lorsque le stock tombe à un niveau de déclenchement ; ils fonctionnent bien pour les articles à demande stable et à haute fréquence. Le MRP convient mieux à la demande dépendante irrégulière, aux délais d'approvisionnement longs, aux faibles volumes et aux produits conçus sur mesure. De nombreuses usines utilisent les deux : le kanban pour les fixations et les pièces à rotation rapide sur la ligne, le MRP pour les pièces à long délai et coûteuses. Le [guide kanban et système tiré](https://www.m365.fm/en/learn/kanban-pull-system/) et le [guide de la fabrication allégée](https://www.m365.fm/en/learn/lean-manufacturing/) expliquent le côté tiré.

## MRP II, CRP et la boucle fermée

**La planification des ressources de fabrication (MRP II)** referme la boucle autour du MRP : le S&OP et le MPS au-dessus, la planification des besoins en capacité (CRP) et le pilotage d'atelier en dessous, ainsi que le lien avec la planification financière [3][8]. Oliver Wight l'a décrite en 1983 [3].

**La planification des besoins en capacité (CRP)** prend tous les ordres planifiés et lancés issus du MRP, applique les gammes complètes (temps de réglage et temps d'exécution par opération et par poste de travail) et calcule la charge par poste de travail et par période. Elle met en évidence les surcharges sans les résoudre : le CRP, comme le MRP, repose sur l'hypothèse d'une capacité infinie [8]. Wallace Hopp et Mark Spearman soutiennent dans *Factory Physics* que le modèle MRP de base suppose des délais qui ne dépendent pas de la charge, ce qui n'est possible qu'avec une capacité illimitée [9]. Le guide APS présente un exemple détaillé de la surcharge que le MRP ne voit pas et explique le **syndrome du délai** : les planificateurs allongent les délais planifiés pour couvrir les ordres en retard, ce qui lance le travail plus tôt, augmente les en-cours et rallonge encore les délais [26]. Plutôt que de répéter ces sections, ce guide renvoie à elles : voir [les faiblesses de la logique MRP classique](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Élément de la boucle fermée | Vérifie | Retour en cas d'échec |
|---|---|---|
| Planification des ressources dans le S&OP | capacité agrégée par mois | modifier le plan par famille, décision de capacité |
| RCCP | ressources clés par semaine | modifier le MPS |
| CRP | chaque poste de travail par jour ou par semaine | heures supplémentaires, gamme alternative, modifier le MPS |
| Contrôle des entrées/sorties et ordonnancement à capacité finie | files d'attente et séquence réelles | reprogrammer, contrôle des lancements, remonter au MPS |
| Retour d'atelier (MES) | fins de fabrication, rebuts, arrêts réels | mettre à jour les ordres ouverts et les stocks pour le prochain calcul MRP |

## Nervosité du MRP : pourquoi les plans sautent et comment les apaiser

La **nervosité** désigne le fait que de petites modifications du MPS ou des stocks provoquent des changements importants ou fréquents dans les ordres planifiés aux niveaux inférieurs. Les diapositives de Gershwin décrivent ce phénomène comme de petits écarts entraînant de fortes modifications du calendrier [8]. Les causes sont l'interaction entre le dimensionnement des lots, les décalages dus aux délais d'approvisionnement et l'horizon de planification glissant, auxquels s'ajoutent le bruit dans les données de demande, d'approvisionnement et d'inventaire.

### Exemple détaillé : 30 bureaux de plus en semaine 4

Les ventes acceptent une commande supplémentaire : le lancement de l'assemblage D100 en semaine 4 passe de 100 à 130, soit une variation de 4 % du volume sur huit semaines (30 sur 740). En relançant l'exemple ci-dessus, on obtient :

| Article | Avant | Après | Variation |
|---|---|---|---|
| T-20 Plateau de bureau, lancements planifiés | sem. 2 : 140, sem. 3 : 100, sem. 5 : 150, sem. 6 : 100, sem. 7 : 120 | sem. 2 : 140, sem. 3 : **130**, sem. 5 : 150, sem. 6 : 100, sem. 7 : 120 | quantité +30 |
| F-10 Pied de table, lancements planifiés | sem. 1, 2, **5**, 6 (200 chacun) | sem. 1, 2, **4**, 6 (200 chacun) | un lot de soudure avancé d'une semaine |
| S-5 Tube d'acier, lancements planifiés | sem. 1 : 500, **sem. 3 : 500**, sem. 4 : 1 000, sem. 5 : 500 | sem. 1 : 500, **sem. 2 : 500**, sem. 4 : 1 000, sem. 5 : 500 | une commande d'achat avancée d'une semaine, à libérer désormais la semaine prochaine |

Les 30 unités supplémentaires n'ont modifié aucune quantité de tube ni de pieds. Elles ont modifié des **dates** à deux niveaux inférieurs, car le lot fixe de 200 pieds s'épuise désormais une semaine plus tôt. Dans une nomenclature réelle comptant des centaines de composants, une poignée de changements de ce type chaque jour produit des milliers de messages de replanification, et les planificateurs cessent de faire confiance au système. C'est là la nervosité.

### Remèdes

Joseph Blackburn, Dean Kropp et Robert Millen ont comparé cinq stratégies d'atténuation de la nervosité dans une étude de simulation publiée dans *Management Science* en 1986 : le gel du calendrier à l'intérieur de l'horizon de planification, le lot-pour-lot en dessous du produit fini, le stock de sécurité, la prévision au-delà de l'horizon de planification et une procédure fondée sur le coût de changement [10]. Pour la nervosité causée par l'horizon glissant et le dimensionnement des lots, le stock de sécurité et le lot-pour-lot ne se sont pas révélés rentables, tandis que les stratégies de coût de changement et de gel ont généralement donné les meilleurs résultats [10]. L'étude ne couvrait pas la nervosité causée par l'incertitude sur la demande, l'approvisionnement ou le délai d'approvisionnement [10].

| Remède | Principe de fonctionnement | Compromis |
|---|---|---|
| Zone gelée et barrières temporelles | aucune modification automatique à l'intérieur de la zone gelée | moindre réactivité aux changements réels |
| Ordres planifiés fermes | le planificateur fige certains ordres ; le MRP ne les déplace pas | le planificateur doit les maintenir |
| Règles de coût de changement ou d'« amortissement » | le MRP ne propose une replanification que si l'écart de date dépasse un seuil (par exemple 3 jours) ou si le coût du changement en vaut la peine | de petits décalages subsistent |
| Lot-pour-lot aux niveaux inférieurs | supprime l'interaction du dimensionnement des lots | plus de lancements et d'ordres ; Blackburn et al. ont constaté qu'il n'était pas rentable pour la nervosité liée à l'horizon [10] |
| Stock de sécurité | absorbe les petits changements | coût de stockage ; également non rentable dans cette étude [10] |
| Données exactes | moins de changements artificiels dus à des erreurs d'inventaire ou de nomenclatures | exige des inventaires tournants et une rigueur dans la gestion des modifications techniques |
| Découplage par des tampons (DDMRP) | rompt la chaîne de dépendances en des points choisis | stock tampon, nouvelle méthode à apprendre |

## Planification des besoins en matières à la demande (DDMRP)

La **planification des besoins en matières à la demande (DDMRP, *Demand Driven Material Requirements Planning*)** conserve la logique de nomenclature de la MRP, mais interrompt l'éclatement des besoins issus des prévisions aux **points de découplage** sélectionnés, où elle place des stocks tampons dimensionnés et gérés activement. Les ordres d'approvisionnement sont générés à partir de la demande réelle et de l'état du stock tampon, et non de la seule prévision. La méthode provient des consultants Carol Ptak et Chad Smith : leur mise à jour de 2011 du livre de Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, ajoute des recommandations pour planifier à partir des commandes clients réelles plutôt que des prévisions, sous l'appellation DDMRP [4]. TechTarget note que certains praticiens considèrent cette approche comme controversée [4]. Ptak et Smith ont également fondé le Demand Driven Institute en 2011 ; celui-ci évalue et certifie gratuitement, pour les éditeurs, les logiciels conformes au DDMRP, et délivre aux personnes physiques des certificats d'approbation professionnelle [35].

### Les cinq composantes

La documentation de Microsoft pour Dynamics 365 Supply Chain Management énumère les cinq composantes du DDMRP [11] :

1. **Positionnement stratégique des stocks :** identifier, dans la chaîne d'approvisionnement, les points de découplage où un stock tampon est détenu, surveillé et réapprovisionné.
2. **Profils et niveaux des tampons :** dimensionner chaque tampon (minimum, maximum, point de commande) ainsi que la quantité de réapprovisionnement.
3. **Ajustements dynamiques des tampons :** adapter les niveaux de tampon en fonction de paramètres d'exploitation ou d'événements planifiés changeants.
4. **Planification à la demande :** générer les ordres d'approvisionnement (fabrication, achat, transfert) au fur et à mesure des besoins.
5. **Exécution hautement collaborative et visible :** exécuter les ordres d'approvisionnement selon une priorité visuelle, généralement par couleur de tampon.

### Dimensionnement des tampons : exemple détaillé

Chaque tampon comporte trois zones, calculées à partir de la consommation quotidienne moyenne (ADU, *average daily usage*), du délai de découplage (DLT, *decoupled lead time*), d'un facteur de délai et d'un facteur de variabilité, comme documenté par Microsoft [12] :

| Zone | Formule [12] |
|---|---|
| Jaune | ADU × DLT |
| Rouge de base | ADU × DLT × facteur de délai |
| Rouge de sécurité | rouge de base × facteur de variabilité |
| Rouge | rouge de base + rouge de sécurité |
| Verte | la plus grande des valeurs : quantité minimale de commande ; ADU × cycle de commande ; ADU × DLT × facteur de délai |

Microsoft recommande des facteurs de délai de 0,20 à 0,40 pour les délais longs, de 0,41 à 0,60 pour les délais moyens et de 0,61 à 1,00 pour les délais courts, ainsi que des facteurs de variabilité de 0,20 à 0,40 pour une variabilité faible, de 0,41 à 0,60 pour une variabilité moyenne et de 0,61 à 1,00 pour une variabilité élevée [12]. Le **délai de découplage** est le temps nécessaire pour produire ou recevoir un article lorsque les points de découplage amont sont en stock ; il est généralement bien inférieur au délai cumulé [12].

**Exemple (chiffres illustratifs).** Une équerre achetée B-7 : ADU de 40 pièces, délai de découplage de 10 jours, facteur de délai de 0,5 (moyen), facteur de variabilité de 0,5 (moyen), quantité minimale de commande de 300, cycle de commande de 7 jours.

| Zone | Calcul | Taille | Cumul (haut de zone) |
|---|---|---|---|
| Rouge de base | 40 × 10 × 0,5 | 200 | |
| Rouge de sécurité | 200 × 0,5 | 100 | |
| Rouge | 200 + 100 | 300 | 300 |
| Jaune | 40 × 10 | 400 | 700 |
| Verte | max(300 ; 40 × 7 = 280 ; 200) | 300 | 1 000 |

### L'équation du flux net

Le DDMRP décide du réapprovisionnement à l'aide de la **position de flux net** : stock disponible + commandes en cours − demande qualifiée des commandes clients [14]. La demande qualifiée comprend généralement les commandes dues aujourd'hui, les commandes en retard et les pics qualifiés dans un horizon défini. Si la position de flux net passe sous le haut de la zone jaune, un ordre d'approvisionnement est créé pour la ramener au haut de la zone verte [14].

Suite de l'exemple : stock disponible de 350, commandes en cours de 400, demande qualifiée de 90. Position de flux net = 350 + 400 − 90 = **660**. Elle est inférieure au haut de la zone jaune (700) : le DDMRP propose donc un ordre de 1 000 − 660 = **340** pièces. L'ordre dépasse la quantité minimale de commande de 300 et est donc maintenu. La priorité d'exécution est ensuite fixée par l'état du stock : un stock disponible de 350 est juste au-dessus du haut de la zone rouge (300), ce qu'un planificateur considérerait comme urgent.

### Quand le DDMRP convient et quand il ne convient pas

| Situation | Adéquation DDMRP | Raison |
|---|---|---|
| Délais cumulés longs, clients attendant des délais courts | bonne | le découplage réduit le délai perçu par le client |
| Nombreux composants partagés, forte variabilité, « nervosité » fréquente du MRP | bonne | les stocks tampons absorbent la variabilité au lieu de la transmettre dans la nomenclature |
| Demande stable et prévisible, nomenclatures courtes | limitée | le MRP classique ou le kanban peuvent être plus simples |
| Projets ponctuels en ingénierie sur commande | limitée | peu d'articles répétitifs à tamponner ; la planification de projet domine |
| Exactitude des stocks et données de référence faibles | faible | des tampons dimensionnés sur un ADU ou des délais erronés protègent les mauvais articles |

Le DDMRP ne remplace pas le S&OP. Les politiques de tampons, la capacité et les investissements en stock exigent toujours une décision mensuelle transversale, et l'ERP a toujours besoin du MPS pour les produits finis non tamponnés. Dans Dynamics 365, le DDMRP fait partie du module de planification directrice, utilise son propre code de couverture, ne donne pas lieu à des frais de licence supplémentaires et nécessite le complément Planning Optimization ; Microsoft souligne qu'il ne remplace pas les fonctionnalités de planification existantes [11]. SAP cite le DDMRP parmi les thèmes de son matériel sur le MRP [27], et IFS documente le DDMRP dans IFS Cloud [14]. Les preuves indépendantes et évaluées par des pairs sur les résultats du DDMRP restent moins abondantes que les études de cas des éditeurs et des cabinets de conseil ; considérez les pourcentages d'amélioration annoncés par les éditeurs de DDMRP comme des affirmations commerciales.

## La planification de production dans l'ERP : ce que font les systèmes et où ils s'arrêtent

Presque tous les ERP de fabrication contiennent un moteur MPS et un moteur MRP. Le S&OP est traité de trois façons : dans l'ERP lui-même, dans une plateforme S&OP ou IBP dédiée connectée à l'ERP, ou dans des tableurs autour de l'ERP.

### Fonctions de planification typiques des ERP

| Fonction | Points à vérifier |
|---|---|
| Gestion de la demande et prévision | modèles statistiques, consommation des prévisions par les commandes, prévision au niveau famille et référence |
| MPS | fenêtres temporelles, ordres planifiés fermes, nomenclatures de planification pour les options, ATP et ATP cumulé [7] |
| RCCP | nomenclatures de ressources pour les ressources clés, rapports charge vs capacité |
| MRP | exécutions en variation nette et régénératives, codes de niveau bas, règles de taille de lot, pegging, messages d'exception |
| CRP | charge par poste de travail à partir des gammes |
| DDMRP | points de découplage, profils de tampons, flux net (lorsque pris en charge) [11] |
| Intégration | vers l'outil S&OP, l'APS, le MES, les portails fournisseurs, la BI |

### Options du marché (exemples, sans classement)

| Catégorie | Exemples vérifiés pour ce guide | Remarques |
|---|---|---|
| ERP avec MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7] ; Microsoft Dynamics 365 Supply Chain Management (planification directrice avec Planning Optimization, DDMRP) [11] ; SAP S/4HANA (MRP ; le matériel SAP couvre le MRP prédictif et le DDMRP) [27] ; IFS Cloud (DDMRP) [14] | de nombreux autres éditeurs d'ERP proposent un MRP ; vérifiez la profondeur de planification lors d'une démonstration scénarisée |
| S&OP et IBP adjacents à l'ERP | SAP Integrated Business Planning [5] ; Oracle Fusion Cloud Sales and Operations Planning [33] | plus efficaces lorsque l'ERP provient du même éditeur |
| Plateformes S&OP / IBP autonomes | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (liste de fournisseurs selon le guide d'achat 2026 de Board, rédigé par l'un des fournisseurs) [29][15] | les classements établis par les éditeurs eux-mêmes ne sont pas indépendants ; utilisez les rapports d'analystes dont la méthodologie est précisée |
| Tableurs | Excel avec extraits de l'ERP ; Power BI pour le reporting des KPI | suffisants pour un premier cycle S&OP avec peu de familles ; fragiles à grande échelle |

Pour les entreprises centrées sur Microsoft, une configuration pratique consiste à exécuter le MPS et le MRP dans l'ERP, à préparer le S&OP dans Excel ou dans un outil de planification, et à publier le tableau de bord des KPI et le journal des décisions via Power BI et Teams. Microsoft présente Dynamics 365, Microsoft 365 et Azure ensemble sous le nom « Microsoft for Manufacturing » [31], et les données Dataverse peuvent être mises à disposition dans Microsoft Fabric sans pipeline ETL séparé [32]. Le [guide Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/) décrit l'architecture.

### Comment l'ERP exécute le MRP

La plupart des systèmes ERP proposent deux modes d'exécution : un calcul **régénératif**, qui recalcule tous les articles depuis le début, souvent chaque nuit ou chaque semaine, et un calcul **de variation nette**, qui ne recalcule que les articles dont la demande, l'approvisionnement ou les données de référence ont changé. Dans les deux cas, le plan n'est aussi à jour que les données que voit le calcul : si le MES enregistre les terminaisons et les rebuts une fois par poste alors que le MRP tourne à 2 h du matin, la liste d'exceptions du matin reflète la production de la veille. Alignez l'heure du calcul MRP sur le cycle d'enregistrement du MES et des stocks, et stabilisez le PDP pendant le calcul afin que les planificateurs et le système ne travaillent pas à contresens. Le [guide MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) décrit les échanges de données entre le niveau 3 et le niveau 4.

### Là où la planification ERP s'arrête

- **Capacité finie.** Le MRP et le CRP de l'ERP planifient sur une capacité infinie [8]. Lorsqu'un goulot d'étranglement détermine les dates de livraison, un ordonnancement à capacité finie ou un APS est nécessaire ; voir le [guide APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Scénarios.** Comparer trois options d'approvisionnement avec tous les effets sur les matières et la capacité est lent dans la plupart des calculs MRP d'ERP. Les plateformes de planification annoncent un recalcul rapide des scénarios ; Kinaxis, par exemple, décrit une planification concurrente qui réduit les cycles de plusieurs semaines à quelques heures (affirmation du fournisseur) [16].
- **Réaction aux perturbations.** Dans une enquête IDC commandée par Kinaxis (1 800 répondants dans neuf pays, réalisée en décembre 2023), 83 % des chaînes d'approvisionnement n'étaient pas en mesure de réagir aux perturbations dans un délai de 24 heures (étude commandée par le fournisseur) [30].
- **Exécution.** La mise en production, les confirmations et les en-cours en temps réel relèvent du MES (ISA-95 niveau 3) [25].

### Liste de contrôle pour le choix d'un logiciel S&OP et de planification

| Question | Pourquoi c'est important |
|---|---|
| Peut-il réconcilier automatiquement les plans par familles avec le PDP au niveau SKU ? | l'effort manuel le plus fréquent en S&OP |
| Affiche-t-il les plans en unités et en dollars côte à côte ? | la finance doit faire partie du processus |
| Combien de temps faut-il pour calculer un scénario complet (variation de la demande + capacité + matières) ? | détermine si les scénarios sont utilisés en réunion |
| Quelles intégrations ERP sont standard, et qui les maintient ? | l'intégration coûte souvent plus cher que les licences |
| Les planificateurs peuvent-ils modifier les données de référence (délais, tailles de lot) avec une piste d'audit ? | la qualité des données est le principal facteur de la qualité du plan |
| Mesure-t-on la valeur ajoutée des prévisions (correction manuelle ou statistique) ? | indique si les ajustements de consensus apportent un gain |
| Quel est le délai réaliste avant le premier cycle S&OP en production ? | Anaplan, par exemple, conseille de compter sur une valeur démontrable dans un délai de 8 à 12 semaines (recommandation du fournisseur) [15] |
| Coût total sur 5 ans, y compris le personnel interne | les redevances de licence sont généralement la plus petite part [unverified: aucune étude de coût indépendante vérifiée] |

## Modèles : calendrier S&OP, ordres du jour, plan par famille, enregistrements MPS et MRP

Les tableaux ci-dessous peuvent être copiés dans Excel ou dans une liste SharePoint comme point de départ. Les ordres du jour de la revue de la demande, de la revue de l'offre et de la réunion de direction figurent à la section 4.

### Modèle 1 : plan par famille de produits (une feuille par famille, MTS)

| Ligne | Réel M-1 | M1 | M2 | M3 | M4–M6 (trimestre) | M7–M12 (semestre) | M13–M18 | Remarques |
|---|---|---|---|---|---|---|---|---|
| Budget / plan financier (unités) | | | | | | | | issu de la finance |
| Prévision statistique (unités) | | | | | | | | modèle, version |
| Plan de demande consensuel (unités) | | | | | | | | responsable : DG ventes |
| Consensus du mois précédent (unités) | | | | | | | | évolution visible |
| Plan d'approvisionnement (unités) | | | | | | | | responsable : DG opérations |
| Stock final (unités) | | | | | | | | |
| Objectif de stock (unités ou jours de couverture) | | | | | | | | politique |
| Charge des ressources clés (% de la capacité) | | | | | | | | ex. soudage |
| Chiffre d'affaires au prix standard ($) | | | | | | | | finance |
| Coût des ventes au coût standard ($) | | | | | | | | finance |
| Hypothèses et risques | | | | | | | | lien vers le journal |

Pour les familles en commande ferme (MTO), remplacer les lignes de stock par le **carnet de commandes** et l'**objectif de carnet de commandes (semaines)**. Carnet final = carnet initial + commandes reçues − expéditions.

### Modèle 2 : journal des hypothèses

| ID | Famille | Hypothèse | Responsable | Date d'ajout | Impact si erroné (unités, $) | Statut / date de revue |
|---|---|---|---|---|---|---|
| A-031 | bureaux | la hausse de prix du concurrent en avril se maintient | DG ventes | 6 janv. | −400 unités/mois | revue le 3 févr. |
| A-032 | bureaux | sous-traitant de soudage qualifié d'ici mars | chaîne d'approvisionnement | 8 janv. | −300 unités en avril | en cours |

### Modèle 3 : journal des décisions

| ID | Réunion / date | Décision | Options examinées | Responsable | Échéance | Effet sur le plan | Statut |
|---|---|---|---|---|---|---|---|
| D-014 | S&OP direction, 15 janv. | adopter le plan hybride, cadences 3 500 / 4 000 / 3 000 | niveau, suivi de la demande, hybride | DG opérations | 31 janv. | +2 000 unités de changement de cadence, 35 200 $ | ouverte |
| D-015 | S&OP direction, 15 janv. | qualifier un sous-traitant de soudage pour 200–400 unités/mois | aucun / qualifier / troisième équipe | chaîne d'approvisionnement | 1er mars | réduction du risque pour mars–mai | ouverte |

### Modèle 4 : enregistrement MPS

| Article | Semaine | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Prévision | | | | |
| | Commandes clients | | | | |
| | Demande projetée (règle par fenêtre temporelle) | | | | |
| | MPS (ferme / planifié) | | | | |
| | Solde disponible projeté | | | | |
| | ATP / ATP cumulé | | | | |
| | Zone de fenêtre temporelle | gelée | gelée | semi-gelée | libre |

### Modèle 5 : enregistrement MRP (par article)

| Article, LLC, délai, règle de lot, stock de sécurité, stock disponible | Semaine | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Besoins bruts | | | | |
| | Réceptions programmées | | | | |
| | Stock disponible projeté | | | | |
| | Besoins nets | | | | |
| | Réceptions d'ordres planifiées | | | | |
| | Lancements d'ordres planifiés | | | | |

### Modèle 6 : liste de contrôle de préparation S&OP avant le premier cycle

| Élément | Prêt lorsque |
|---|---|
| Familles de produits définies | 5 à 15 familles par unité opérationnelle, chacune avec des ressources et des moteurs de demande similaires |
| Ressources clés définies | 3 à 8 ressources qui limitent la production, avec une capacité démontrée par mois |
| Nomenclature des ressources | heures par unité par ressource clé, par famille |
| Sources de données | expéditions, commandes, stocks, production par famille disponibles les jours ouvrés 1 à 2 |
| Politique de stock ou de carnet de commandes | objectif par famille approuvé par la finance |
| Calendrier | 12 mois de dates réservées pour les cinq étapes |
| Droits de décision | seuils écrits pour la revue de l'offre, le pré-S&OP et la réunion de direction |
| Sponsor exécutif | nommé, assiste en personne aux trois premiers cycles |

## KPI S&OP et MRP avec exemples détaillés

Un bon jeu de KPI S&OP est court : une dizaine d'indicateurs, chacun avec une définition, un responsable et une cible. Le [guide des KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) couvre les indicateurs au niveau de l'usine, comme le TRS et la livraison à temps ; cette section porte sur les indicateurs de planification.

### Précision des prévisions, biais et MAPE : un seul jeu de données, cinq indicateurs

**Données (à titre illustratif).** Prévision mensuelle (F, établie un mois à l'avance) et demande réelle (A) pour la famille de bureaux :

| Mois | Prévision F | Réel A | Erreur e = F − A | Erreur absolue \|e\| | Erreur absolue en pourcentage \|e\| / A |
|---|---|---|---|---|---|
| Jan | 3 000 | 2 850 | +150 | 150 | 5,26 % |
| Fév | 3 200 | 3 350 | −150 | 150 | 4,48 % |
| Mar | 4 200 | 3 900 | +300 | 300 | 7,69 % |
| Avr | 4 800 | 5 100 | −300 | 300 | 5,88 % |
| Mai | 4 000 | 3 700 | +300 | 300 | 8,11 % |
| Juin | 2 800 | 2 650 | +150 | 150 | 5,66 % |
| **Somme** | **22 000** | **21 550** | **+450** | **1 350** | **37,08 %** |

| Indicateur | Formule | Calcul | Résultat |
|---|---|---|---|
| MAPE (erreur absolue moyenne en pourcentage) | moyenne de \|e\| / A | 37,08 % / 6 | **6,18 %** |
| WMAPE (MAPE pondérée) | Σ\|e\| / ΣA | 1 350 / 21 550 | **6,26 %** |
| Précision des prévisions | 1 − WMAPE | 1 − 0,0626 | **93,7 %** |
| Biais | Σe / ΣA | +450 / 21 550 | **+2,1 % (surprévision)** |
| MAD (écart absolu moyen) | Σ\|e\| / n | 1 350 / 6 | **225 unités** |
| Signal de suivi | Σe / MAD | 450 / 225 | **+2,0** |

Comment les lire :

- **La précision et le biais répondent à des questions différentes.** Une précision de 93,7 % semble bonne. Mais quatre mois sur six sont surprévus, et l'erreur cumulée atteint +450 unités. Si l'approvisionnement suit la prévision, le stock augmente d'environ 450 unités en six mois. Le biais est l'indicateur qui révèle un optimisme ou un pessimisme systématique.
- **MAPE contre WMAPE.** La MAPE pondère chaque mois de manière égale ; la WMAPE pondère par le volume. Au niveau des références (SKU), la MAPE explose pour les petits articles : une référence avec une prévision de 10 et un réel de 2 présente une erreur de 400 %. Utilisez la WMAPE (ou le MAD/moyenne) pour le reporting au niveau des références et réservez la MAPE aux séries stables à fort volume.
- **Signal de suivi.** Le cumul des erreurs divisé par le MAD. Une valeur qui s'éloigne régulièrement de zéro indique un biais ; une règle empirique considère que le modèle fonctionne correctement tant que le signal de suivi reste entre −4 et +4 [36].
- **L'agrégation masque l'erreur.** Deux références avec des prévisions de 1 000 chacune et des réels de 1 200 et 800 donnent une erreur familiale de 0, mais une WMAPE au niveau des références de 400 / 2 000 = 20 %. Présentez la précision au niveau où les décisions sont prises : famille pour le S&OP, référence et emplacement pour le PDP et le réapprovisionnement.
- **Le délai compte.** Mesurez la prévision figée au délai d'approvisionnement pertinent (par exemple, la prévision établie trois mois avant le mois concerné pour une pièce ayant un délai de trois mois), et non la mise à jour de dernière minute.

### Valeur ajoutée de la prévision

La valeur ajoutée de la prévision (FVA) compare l'erreur de chaque étape du processus de prévision à celle de l'étape précédente. Si la prévision statistique présentait une WMAPE de 7,5 % et que la prévision consensuelle après ajustements commerciaux atteint 6,3 %, le processus consensuel a ajouté 1,2 point de précision. Si elle atteignait 8,5 %, la réunion a dégradé la prévision. La FVA transforme la revue de la demande, d'un concours d'opinions, en un processus mesuré.

### Ensemble d'indicateurs de performance (KPI) pour S&OP et MRP

| KPI | Définition | Objectif indicatif (à titre d'exemple) | Responsable |
|---|---|---|---|
| Précision des prévisions (1 − WMAPE), famille, décalage 1–3 | voir ci-dessus | ≥ 90 % | planificateur de la demande |
| Biais de prévision, famille | Σ(F − A) / ΣA sur 3–6 mois | dans la plage de ±3 % | directeur commercial |
| Atteinte du plan d'approvisionnement | production réelle / production planifiée par famille et par mois | 95–105 % | directeur des opérations |
| Respect du MPS | lignes du MPS terminées dans la semaine planifiée / total des lignes du MPS | ≥ 95 % | ordonnanceur maître |
| Stabilité du planning | modifications du MPS dans la zone gelée par semaine | tendance à la baisse | ordonnanceur maître |
| Service client | livraison à temps et complète (OTIF) ou taux de service par famille | selon le segment | directeur commercial / chaîne d'approvisionnement |
| Stock par rapport à la cible | stock final / cible, ou jours de couverture | 90–110 % | chaîne d'approvisionnement |
| Exactitude des enregistrements de stock | articles dans la tolérance d'inventaire / articles inventoriés | fin des années 90 % | entrepôt |
| Exactitude des nomenclatures (BOM) | BOM vérifiées correctes / BOM auditées | fin des années 90 % | ingénierie |
| Charge d'exceptions MRP | messages d'exception par planificateur et par semaine | tendance à la baisse | responsable des matières |
| Ordres planifiés en retard | nombre après chaque exécution du MRP | proche de zéro | responsable des matières |
| Clôture du journal des décisions | décisions clôturées à la date prévue / décisions échues | ≥ 90 % | responsable du processus S&OP |

Certains guides MRP citent les références « Classe A » d'Oliver Wight, comme une exactitude des enregistrements de stock de 95 % et une exactitude des nomenclatures de 98 % [28]. Les mêmes seuils figurent dans la littérature sur la planification directrice : exactitude des enregistrements de stock de 95 % comme seuil d'acceptabilité (98 % pour un niveau robuste) et exactitude des nomenclatures d'au moins 98 % (plus de 99 % pour un bon niveau) [37]. La liste de contrôle actuelle d'Oliver Wight n'était pas accessible pour ce guide ; l'attribution à Oliver Wight reste [unverified: liste de contrôle actuelle non consultée]. Fixez vos propres objectifs à partir d'une base de référence mesurée.

### Vue financière : ce que le S&OP apporte au fonds de roulement

La direction financière pose généralement deux questions : quel niveau de stock le plan porte-t-il, et quel en est le coût ? Avec le plan hybride de la section 5, le stock moyen en fin de mois est de 6 300 / 6 = 1 050 bureaux. À un coût standard de 180 $ par bureau (à titre d'exemple), cela représente 189 000 $ immobilisés en moyenne. Le plan à charge lissée porte 8 600 / 6 = 1 433 bureaux, soit 258 000 $. Avec un taux de coût de possession de 20 % par an (à titre d'exemple ; utilisez le taux de votre entreprise), l'écart de 69 000 $ de stock moyen coûte environ 13 800 $ par an. Ces chiffres doivent figurer dans la note de décision préalable au S&OP, à côté des effets sur le service et la capacité.

## Feuille de route de mise en œuvre : 12 mois pour un S&OP et un MRP opérationnels

| Phase | Mois | Activités principales | Critères de sortie |
|---|---|---|---|
| 0. Évaluer | 0–1 | auto-évaluation de maturité (Section 7), inventaire des données, entretiens, engagement du sponsor | sponsor désigné, périmètre convenu, KPI de référence mesurés |
| 1. Concevoir | 1–2 | familles de produits, ressources clés, nomenclature des ressources, calendrier, droits de décision, définitions des KPI, modèles | document de conception validé par le sponsor |
| 2. Fondations de données | 1–4 (en parallèle) | exactitude des stocks (comptage cyclique), audit des nomenclatures (BOM) y compris date d'effectivité des modifications d'ingénierie, revue des délais d'approvisionnement, règles du PDP et fenêtres de figement dans l'ERP | exactitude des stocks et des nomenclatures mesurée et en amélioration ; délais revus pour les 80 % de la valeur les plus élevés |
| 3. Premiers cycles | 3–5 | exécuter le cycle en cinq étapes avec des tableurs ; trois cycles consécutifs avec la présence de la direction | trois cycles terminés à temps, journal des décisions utilisé |
| 4. Relier au PDP et au MRP | 4–7 | règles de désagrégation, PDP réconcilié avec le S&OP, RCCP sur les ressources clés, discipline de gestion des exceptions MRP | PDP dans la tolérance du S&OP ; ordres planifiés en retard en diminution |
| 5. Mesurer et améliorer | 6–9 | exactitude et biais des prévisions, FVA, taux de réalisation du plan ; causes profondes des écarts ; règles de nervosité | KPI rapportés mensuellement ; au moins un changement de processus issu des résultats FVA |
| 6. Étendre | 9–12 | intégration finance (orientation IBP), scénarios, réunion hebdomadaire S&OE, évaluation d'outils si les tableurs limitent le processus | plan en unités et en dollars ; S&OE opérationnel ; décision sur l'outil prise sur la base de preuves |

**Remarques pratiques**

- **Commencer avec des tableurs.** Un outil ne peut pas corriger un processus qui n'existe pas encore. La plupart des entreprises ne savent ce dont elles ont besoin en matière de logiciel qu'après trois à six cycles.
- **Piloter une unité commerciale ou une usine.** Un S&OP couvrant cinq usines et vingt familles dès le premier jour survit rarement au deuxième mois.
- **Le travail sur les données se fait en parallèle.** Les décisions S&OP ne valent que ce que valent le PDP et le MRP situés en dessous ; l'exactitude des stocks et des nomenclatures détermine si les résultats du MRP sont fiables.
- **Maîtrise de la qualité et de la configuration.** Dans les environnements réglementés ou certifiés (aérospatiale, automobile, médical), les modifications de nomenclature relèvent aussi du système qualité : une modification d'ingénierie doit atteindre la nomenclature du MRP avec la bonne date d'effectivité, faute de quoi le MRP commandera des pièces pour une révision obsolète. Associez le responsable qualité à l'audit des nomenclatures ; le [guide de planification de production aérospatiale](https://www.m365.fm/en/learn/aerospace-production-planning/) traite de la gestion de configuration.
- **Gestion du changement.** Les équipes commerciales craignent d'être tenues à une prévision ; les usines craignent d'être blâmées pour une capacité qu'elles n'ont jamais eue. Rendez le biais visible sans désigner de coupables, et valorisez les décisions prises tôt.
- **Formation.** Les planificateurs et les ordonnanceurs maîtres gagnent à suivre une formation structurée sur les fondamentaux de la MPC ; le programme ASCM CPIM est la certification américaine de référence [24].

## Erreurs courantes

| Erreur | Symptôme | Correction |
|---|---|---|
| S&OP conçu comme une réunion de reporting | 40 diapositives, aucune décision | notes de décision avec options ; journal des décisions |
| Les dirigeants sèchent la réunion | les délégués ne peuvent pas décider ; les sujets sont reportés | présence du sponsor comme règle ; ordre du jour plus court et centré sur les décisions |
| Prévision = objectif commercial | sur-prévision systématique, stocks en hausse | séparer objectif et prévision ; mesurer le biais |
| S&OP au niveau SKU | des centaines de lignes, pas de temps pour décider | familles pour le S&OP, SKU pour le MPS |
| Aucun financier dans la salle | le plan en unités ne correspond pas au budget | partenaire finance dans le pré-S&OP ; plan en unités et en dollars |
| MPS non réconcilié avec le S&OP | l'atelier suit un autre plan | règle de désagrégation et contrôle de tolérance chaque mois |
| MPS surchargé | commandes en retard après chaque calcul MRP | RCCP sur les ressources clés ; MPS à la capacité démontrée |
| Délais de fabrication planifiés jamais revus | lancements en avance ou en retard, en-cours gonflés | revue trimestrielle des délais ; voir le syndrome des délais [26] |
| Données de stock et de nomenclature erronées | expédition urgente, ruptures malgré un stock « disponible » | inventaire tournant, audits de nomenclature, processus de modification technique |
| Réagir à chaque message d'exception | nervosité, épuisement des planificateurs | fenêtres de figement, ordres planifiés fermes, seuils d'amortissement [10] |
| Acheter d'abord le logiciel | outil coûteux, mêmes discussions | trois à six cycles manuels d'abord |
| Ignorer le goulot | plan réalisable en moyenne, irréalisable en pics de charge | charge de la ressource clé dans chaque revue d'approvisionnement ; voir la [théorie des contraintes](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Limites du S&OP et du MRP

**Le S&OP est un processus mensuel dans un monde qui change chaque semaine.** Un plan approuvé le 15 peut être dépassé le 25. Le S&OE et le S&OP piloté par les événements répondent à ce problème, mais ils exigent de la discipline pour éviter de tout replanifier chaque semaine.

**L'agrégation masque les problèmes.** Un plan par famille peut être réalisable alors qu'une variante précise manque d'un composant précis. C'est pourquoi le MPS et le MRP situés sous le S&OP comptent, et pourquoi les définitions de familles doivent regrouper les articles qui partagent les mêmes ressources.

**Le MRP est déterministe ; la réalité ne l'est pas.** Le MRP traite les prévisions, les délais de fabrication et les rendements comme des valeurs fixes [8]. Le stock de sécurité et le délai de sécurité couvrent une partie de la variabilité, mais le MRP ne peut pas représenter explicitement l'incertitude. Le DDMRP, les modèles stochastiques et la simulation (voir la [simulation de production](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) abordent ce point sous des angles différents.

**Le MRP planifie à capacité infinie.** Le MRP et le CRP signalent les surcharges sans les résoudre [8][9]. La planification finie et l'APS comblent ce manque au niveau opérationnel.

**Le MRP fixe des délais de fabrication qui dépendent en réalité de la charge.** Les délais planifiés sont des données d'entrée du MRP, mais aussi le résultat de la charge de l'atelier. Le syndrome des délais montre ce qui se produit lorsque les planificateurs les traitent comme des leviers [26].

**Dépendance aux données.** Le MRP amplifie les erreurs de données : une mauvaise quantité par unité dans une nomenclature de niveau 2 se propage à chaque parent. Aucun algorithme ne compense des enregistrements de stock faux.

**Culture.** La littérature académique classe parmi les principales causes d'échec des initiatives S&OP les barrières organisationnelles, comme les silos fonctionnels et l'absence d'engagement de la direction [1]. Le logiciel ne les supprime pas.

**Toutes les entreprises n'ont pas besoin de la pile complète.** Un atelier à la commande avec des délais courts et des commandes majoritairement spécifiques au client peut avoir davantage besoin d'une bonne prise de commandes et d'un ordonnancement fini que d'un S&OP à 24 mois. Un distributeur peut avoir davantage besoin du DRP que du MRP. Adaptez la méthode à l'activité.

## IA et planification numérique : ce qui fonctionne aujourd'hui

Les logiciels de planification et les éditeurs d'ERP commercialisent désormais la prévision par apprentissage automatique, la « détection de la demande » (demand sensing), les agents de planification et les copilotes. Pour une usine, les questions utiles sont de savoir quelle décision de planification s'améliore et comment cette amélioration est mesurée.

| Application | Ce qu'elle fait | Où elle aide | Points à vérifier |
|---|---|---|---|
| Prévision par apprentissage automatique | exploite de nombreux facteurs (prix, promotions, météo, commandes) au-delà de l'historique | nombreuses références avec des facteurs de demande connus | mesurer la FVA par rapport à une base statistique simple ; le ML bat souvent cette base pour certaines familles, pas pour d'autres |
| Détection de la demande à court terme | ajuste la prévision proche avec les commandes récentes et les données de point de vente | biens de consommation, distribution | utile seulement si le PDP et le S&OE peuvent réagir aux variations hebdomadaires |
| Planification de scénarios et recalcul rapide | recalcule les effets d'une décision sur la demande, la capacité et les matières | revue d'approvisionnement, pré-S&OP | temps de calcul, latence des données, qui peut lancer des scénarios [16] |
| Ajustement des paramètres | propose délais, stocks de sécurité, tailles de lot, facteurs de tampon DDMRP à partir des données réelles | maintenance des données de base MRP | revue par le planificateur avant toute modification ; piste d'audit |
| Tri des exceptions | classe les messages d'exception MRP selon leur impact sur les commandes clients | planification des matières | taux d'acceptation des recommandations ; temps gagné |
| Assistants d'IA générative | résument les dossiers S&OP, rédigent les notes de décision, répondent à « pourquoi le plan a-t-il changé ? » à partir des données de planification | préparation des réunions | les réponses doivent citer les données utilisées ; aucune modification autonome du plan sans approbation |
| Jumeau numérique et simulation | testent les options de capacité, de tampon et d'implantation avant décision | revue d'approvisionnement pour les investissements de capacité | validation du modèle par rapport à la performance réelle ; voir le [guide du jumeau numérique](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Quatre règles permettent à l'IA de rester utile dans la planification :

1. **Corriger d'abord le processus.** Une prévision d'IA injectée dans un processus sans revue de la demande, sans mesure du biais et sans droits de décision produit une confusion plus rapide.
2. **Mesurer la valeur ajoutée.** Traiter chaque modèle comme toute autre étape de prévision et suivre sa FVA (section 16).
3. **Garder des décideurs humains responsables.** Les décisions S&OP engagent de l'argent, des personnes et des clients. Les outils peuvent préparer des options ; le comité de direction décide.
4. **Une base de données avant les modèles.** La plupart des projets de planification par IA échouent sur la qualité de l'historique, les données de base et l'intégration, et non sur les algorithmes. Dans les environnements Microsoft, les choix de plateforme comme Fabric et Power BI sont traités dans le [guide Azure pour l'industrie manufacturière](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Une configuration réaliste de Microsoft 365 pour le S&OP

| Élément | Outil | Remarques |
|---|---|---|
| Agenda et réunions | Outlook, Teams | séries récurrentes pour les cinq étapes, réservées 12 mois à l'avance |
| Dossier d'indicateurs | rapport Power BI issu des données ERP et de planification | une page par famille ; même mise en page chaque mois |
| Plans de familles et scénarios | Excel (premiers cycles), puis un outil de planification | gestion des versions : un fichier par cycle, en lecture seule après approbation |
| Hypothèses et journaux de décision | Microsoft Lists ou une liste SharePoint | responsable, échéance, statut ; liés à l'ordre du jour du comité de direction |
| Notes de décision | Word ou pages Loop, une page par décision | options, impact, recommandation |
| Aide à la préparation | synthèses Copilot du dossier d'indicateurs et des journaux | relues par le responsable du processus avant diffusion |

## Glossaire

| Terme | Définition |
|---|---|
| Planification agrégée | planification des cadences de production, des effectifs et des stocks par familles de produits à moyen terme ; à l'origine du S&OP [1] |
| Disponible à la promesse (ATP) | la part non engagée de l'approvisionnement planifié qui peut être promise à de nouvelles commandes clients (Section 8) |
| Nomenclature (BOM) | liste des composants, quantités et structure nécessaires à la fabrication d'un article parent |
| Gamme de ressources | heures par unité d'un produit ou d'une famille à chaque ressource clé ; utilisée dans la planification des ressources S&OP et le RCCP |
| Planification des besoins en capacité (CRP) | calcul détaillé de la charge par poste de travail à partir des ordres MRP et des gammes, à capacité infinie [8] |
| Délai cumulé | le plus long chemin de délais dans la nomenclature, depuis l'achat du premier matériau jusqu'à la finition de l'article final |
| Point de découplage | position dans la nomenclature ou dans la chaîne d'approvisionnement où un stock tampon DDMRP sépare l'approvisionnement de la variabilité de la demande [11] |
| Horizon de consommation de la demande | limite dans le MPS à l'intérieur de laquelle seules les commandes clients, et non les prévisions, comptent comme demande |
| Demande dépendante | demande calculée à partir de la demande d'un article parent, par opposition à la demande indépendante (prévision) [13] |
| DDMRP | planification des besoins en matières pilotée par la demande : stocks tampons aux points de découplage, dimensionnés par zones et réapprovisionnés par l'équation de flux net [11][12] |
| Message d'exception | recommandation MRP de lancer, replanifier ou annuler un ordre |
| Ordre planifié ferme | ordre planifié figé par le planificateur afin que le MRP ne le modifie pas automatiquement |
| Biais de prévision | surprévision ou sous-prévision systématique ; Σ(F − A) / ΣA |
| Valeur ajoutée de la prévision (FVA) | variation de l'erreur de prévision provoquée par une étape du processus de prévision |
| Besoins bruts | demande totale pour un article sur une période avant compensation |
| Planification intégrée d'entreprise (IBP) | terme d'Oliver Wight désignant une extension à l'échelle de l'entreprise du S&OP incluant le portefeuille et les aspects financiers, sur un horizon d'au moins 24 mois [2] |
| Code de niveau bas | le plus bas niveau de nomenclature auquel un article apparaît ; détermine l'ordre de traitement du MRP [8] |
| Lot pour lot | règle de dimensionnement des lots qui commande exactement le besoin net de chaque période [8] |
| MAPE / WMAPE | erreur moyenne absolue en pourcentage / MAPE pondérée (Section 16) |
| Programme directeur de production (MPS) | énoncé de ce que l'entreprise prévoit de produire par article final et par période, établi à partir du plan tactique [7] |
| MRP | planification des besoins en matières : calcul échelonné dans le temps des besoins nets de tous les composants à partir du MPS, de la nomenclature et des stocks [7] |
| MRP II | planification des ressources de fabrication : MRP plus S&OP, MPS, RCCP, CRP, gestion de l'atelier et intégration financière [3] |
| Position de flux net | DDMRP : stock disponible + commandes en cours − demande qualifiée [14] |
| Nervosité | changements fréquents ou importants des ordres planifiés provoqués par de petites variations des données d'entrée [8][10] |
| Besoins nets | besoins bruts moins stock disponible et réceptions programmées, plus stock de sécurité le cas échéant |
| Imputation | lien entre un besoin et la demande qui l'a généré |
| Lancement d'ordre planifié | date et quantité auxquelles un ordre planifié doit être lancé, décalées du délai d'approvisionnement par rapport à sa réception |
| Horizon de planification ferme | limite au-delà de laquelle le système de planification peut créer ou modifier automatiquement des ordres |
| Solde disponible projeté (PAB) | stock attendu en fin de période dans le MPS |
| Planification grossière des capacités (RCCP) | vérification du MPS par rapport aux ressources clés à l'aide des gammes de ressources |
| S&OE | exécution du plan ventes et opérations : processus hebdomadaire pour exécuter le plan S&OP à court terme |
| Planification des ventes et des opérations (S&OP) | processus mensuel transversal visant à intégrer les plans de demande et d'approvisionnement par famille, en unités et en dollars [1] |
| Réception programmée | ordre de production ou d'achat ouvert avec une date d'échéance |
| Signal de suivi | erreur de prévision cumulée divisée par l'écart absolu moyen (MAD) ; indique un biais |

## FAQ : planification des ventes et des opérations et MRP

### Qu'est-ce que la planification des ventes et des opérations, en termes simples ?

Le S&OP est un cycle de réunions mensuel au cours duquel les ventes, les opérations, la chaîne d'approvisionnement et la finance s'accordent sur un seul plan définissant ce que l'entreprise vendra, fabriquera et stockera au cours des 18 à 36 prochains mois, par famille de produits [1][5]. L'équipe de direction s'en sert pour arbitrer, par exemple pour ajouter une équipe ou constituer des stocks avant un arrêt.

### Quelles sont les étapes du processus S&OP ?

Les cinq étapes courantes sont la collecte des données, la revue de la demande, la revue de l'offre, le pré-S&OP (réconciliation) et la réunion S&OP de direction [1][20]. Certaines entreprises ajoutent une revue produit ou portefeuille en amont ; Anaplan, par exemple, énumère les revues produit, demande, offre, finance, pré-S&OP et direction [15].

### À quelle fréquence faut-il réaliser le S&OP ?

Mensuellement, selon un calendrier fixe [1][5] ; Anaplan, par exemple, décrit des cycles mensuels avec des points hebdomadaires pour les principaux participants [15]. Une réunion S&OE hebdomadaire traite les changements à court terme entre les cycles, et les événements majeurs (une grande commande, un arrêt d'usine) peuvent déclencher une revue supplémentaire.

### Qui doit participer à la réunion S&OP de direction ?

Le directeur général ou le président de l'unité d'affaires en tant que président, ainsi que les responsables des ventes, du marketing, des opérations, de la chaîne d'approvisionnement et de la finance, et la gestion de produits ou l'ingénierie lorsque des décisions de portefeuille figurent à l'ordre du jour. Le responsable du processus S&OP le prépare et le documente.

### Quelle est la différence entre S&OP et IBP ?

L'IBP étend le S&OP de l'équilibrage demande-offre à l'ensemble du plan d'affaires, y compris le portefeuille, la stratégie et les aspects financiers, avec un horizon d'au moins 24 mois [2]. Oliver Wight a développé le S&OP dans les années 1980 et a inventé le terme IBP au début des années 2000 [2].

### Quelle est la différence entre S&OP et MRP ?

Le S&OP détermine les volumes par famille de produits et par mois, à l'échelle de toutes les fonctions. Le MRP calcule, pour chaque composant, combien acheter ou fabriquer et quand, à partir du programme directeur de production, des nomenclatures et des stocks [7]. Le S&OP fixe le cadre ; le MRP l'exécute au niveau de la référence.

### Quelle est la différence entre MPS et MRP ?

Le MPS planifie les produits finis (ou les articles de planification) par semaine ; le MRP éclate le MPS à travers les nomenclatures pour planifier les composants et les matières [7]. Les deux utilisent la même logique de compensation, mais le MPS est fixé par un planificateur directeur tandis que le MRP est calculé par le système.

### Comment fonctionne le MRP ?

Pour chaque article, niveau par niveau : prendre les besoins bruts, soustraire le stock disponible et les réceptions planifiées, appliquer le stock de sécurité pour obtenir les besoins nets, dimensionner les lots, décaler de la durée d'approvisionnement pour obtenir les dates de lancement des ordres planifiés, et les transmettre en besoins bruts aux composants [8]. La section 10 présente un exemple complet détaillé.

### Quelles sont les entrées du MRP ?

Le programme directeur de production, les nomenclatures, les données de stock (stock disponible, stock de sécurité), les commandes ouvertes (réceptions planifiées) et les données de planification des articles (délais d'approvisionnement, règles de dimensionnement des lots) [7][8].

### Quelle est la différence entre MRP et MRP II ?

Le MRP calcule les besoins en matières. Le MRP II, défini par Oliver Wight en 1983, ajoute le S&OP, la programmation directrice, la planification des capacités à la charge globale et détaillée, la gestion de l'atelier et le lien avec la planification financière [3].

### Quelle est la différence entre MRP et ERP ?

Le MRP est une méthode de planification et un module d'ERP. L'ERP est un système intégré couvrant la finance, les ventes, les achats, les ressources humaines et la fabrication, le MRP en constituant le noyau de planification des matières. Gartner a introduit le terme ERP en 1990 [4].

### Qu'est-ce que le DDMRP ?

Le MRP piloté par la demande place des tampons de stock à des points de découplage choisis, les dimensionne en zones rouge, jaune et verte à partir de la consommation quotidienne moyenne et du délai d'approvisionnement, et les réapprovisionne selon l'équation de flux net (stock disponible + commandé − demande qualifiée) [11][12][14]. Il est conçu pour réduire la dépendance aux prévisions et l'instabilité du MRP classique ; les preuves indépendantes sur ses résultats restent limitées.

### Qu'est-ce que le disponible à la promesse ?

L'ATP est la part de l'approvisionnement planifié qui n'est pas encore affectée à des commandes clients et peut être promise à de nouvelles commandes. Dans l'exemple de la section 8, un client demandant 100 unités en semaine 2 peut en obtenir 60 immédiatement et le reste à partir de la semaine 4.

### Quels indicateurs mesurent le succès du S&OP ?

La précision des prévisions (1 − WMAPE) et le biais au niveau de la famille, l'atteinte du plan d'approvisionnement, le respect du MPS, le service client (OTIF ou taux de service), les stocks ou le carnet de commandes par rapport à la cible, et le taux de clôture des décisions. La section 16 présente les formules et un exemple détaillé.

### Comment calcule-t-on la précision des prévisions ?

Une formule courante est 1 − WMAPE, où WMAPE = Σ|prévision − réel| / Σ réel. Avec des erreurs absolues de 1 350 unités pour une demande réelle de 21 550, le WMAPE est de 6,26 % et la précision des prévisions de 93,7 %. Indiquez toujours le biais en complément.

### Pourquoi les processus S&OP échouent-ils ?

Les raisons habituelles sont l'absence de participation de la direction générale, une prévision qui n'est en réalité qu'un objectif commercial, l'absence de la finance, un niveau de détail excessif (références plutôt que familles), l'absence de lien avec le MPS et l'achat de logiciels avant que le processus ne fonctionne. La section 18 présente les correctifs.

### Un petit fabricant peut-il mener un S&OP sans logiciel spécialisé ?

Oui. Une entreprise disposant de quelques familles de produits peut conduire un S&OP à partir d'extractions de l'ERP, d'Excel et d'un journal de décisions partagé. Un logiciel devient utile lorsque la réconciliation entre familles et références, les scénarios ou la préparation des données prennent plus de temps que les décisions elles-mêmes.

### Qu'est-ce que la nervosité du MRP ?

La nervosité désigne la tendance des plans MRP à changer fréquemment lorsque les données d'entrée varient légèrement. Dans l'exemple de la section 12, 30 bureaux supplémentaires ont modifié les ordres à deux niveaux inférieurs de la nomenclature. Les fenêtres temporelles, les ordres de fabrication fermes et les règles de coût de changement permettent de la réduire [10].

### Quels sont les avantages du S&OP ?

Le S&OP remplace les chiffres distincts des ventes, de la production et de la finance par un plan unique et validé pour chaque famille de produits. Les décisions qui déplacent un coût d'une fonction à une autre, comme un deuxième poste, une préfabrication ou la suppression d'une variante, sont prises par les personnes qui assument à la fois le coût et le bénéfice (section 1). Le MPS et le MRP reçoivent un plan déjà vérifié par rapport à la capacité, si bien que moins d'ordres doivent être accélérés par la suite. La finance voit l'effet sur le fonds de roulement avant qu'il ne se produise : dans l'exemple illustratif de la section 16, le plan hybride comporte en moyenne environ 380 bureaux de moins que le plan à charge constante, soit une économie d'environ 13 800 $ par an en coût de possession. Les pourcentages de bénéfices publiés par les éditeurs et les enquêtes varient fortement ; mesurez donc votre propre référence avant le premier cycle.

### Quelles sont les sorties du MRP ?

Pour chaque article fabriqué et acheté, le MRP produit des réceptions d'ordres planifiés et des lancements d'ordres planifiés, datés et décalés selon le délai d'approvisionnement [8]. Il produit également des messages d'exception pour les ordres ouverts (lancement, avancement, report, annulation, retard, sous le stock de sécurité) ainsi que le pegging, qui relie chaque besoin à son article parent et à la commande client. La section 10 présente les trois avec un exemple détaillé.

### Quelle est la différence entre MRP et JIT ?

Le MRP est un calcul de planification : il éclate le programme directeur de production à travers les nomenclatures et crée des ordres datés avant que le besoin n'apparaisse. Le juste-à-temps (JIT) est une approche de production lean qui réapprovisionne en fonction de la consommation réelle, généralement grâce à des signaux kanban, et vise de petits lots et un stock faible. Les deux ne s'excluent pas. De nombreuses usines utilisent le MRP pour les articles à long délai, coûteux ou à demande irrégulière, et le kanban pour les articles à rotation rapide sur la ligne (section 10). Le [guide sur le kanban et le système tiré](https://www.m365.fm/en/learn/kanban-pull-system/) couvre le côté tiré.

## Conclusion et premières étapes

La planification commerciale et opérationnelle (S&OP) et le MRP résolvent le même problème à deux niveaux. Le S&OP permet à l'équipe de direction de décider, une fois par mois, combien vendre, fabriquer et stocker par famille, et ce que cela coûte. Le plan directeur de production (MPS) transforme cette décision en produits finis par semaine, la planification de capacité à charge grossière (RCCP) la vérifie par rapport au goulot d'étranglement, et le MRP calcule ce dont chaque composant a besoin, et quand. Chaque niveau a besoin que celui qui le précède soit réaliste et que celui qui le suit soit exécuté. L'ordonnancement détaillé et l'atelier complètent la chaîne.

Les méthodes sont anciennes (Orlicky a formalisé le MRP en 1964, Oliver Wight a façonné le S&OP dans les années 1980) et restent l'épine dorsale de la planification ERP [2][3][4]. Leurs faiblesses sont connues : capacité infinie, délais de fabrication fixes, nervosité et dépendance à la qualité des données. Les fenêtres temporelles (time fences), la RCCP, les tampons DDMRP et l'ordonnancement à capacité finie les traitent. Les outils d'IA peuvent accélérer les prévisions et les analyses de scénarios, mais uniquement là où le processus, les données et les droits de décision sont déjà en place.

**Vos premières étapes dans les 30 prochains jours**

- [ ] Définir 5 à 15 familles de produits et 3 à 8 ressources clés avec leur capacité mensuelle démontrée
- [ ] Extraire 24 mois d'expéditions et de commandes par famille et mesurer la précision de prévision (1 − WMAPE) et le biais sur les 6 derniers mois
- [ ] Vérifier si la somme de votre MPS par famille correspond à votre plan actuel de ventes et de production
- [ ] Lancer votre MRP et compter les ordres planifiés en retard et les messages d'exception par planificateur ; c'est votre référence de nervosité
- [ ] Auditer l'exactitude des stocks pour les 50 premiers articles en valeur et l'exactitude des nomenclatures (BOM) pour les 10 premiers produits finis
- [ ] Réserver le calendrier S&OP en cinq étapes pour les 12 prochains mois et désigner un sponsor exécutif et un responsable de processus
- [ ] Mener le premier cycle dans des tableurs avec les modèles de la section 15, et ouvrir le journal des décisions lors de la première réunion de direction

---

## Pour aller plus loin sur m365.fm

**Guides de ce parcours d'apprentissage**
- [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/) : ordonnancement détaillé, faiblesses du MRP, syndrome du délai de fabrication, capacité finie
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) : flux tiré, heijunka, kanban comme alternative à la planification en poussée
- [Indicateurs de fabrication (KPI)](https://www.m365.fm/en/learn/manufacturing-kpis/) : TRS, respect des délais de livraison, mesures de stock
- [Jumeau numérique en fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/) : test de scénarios pour les décisions de capacité
- [Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/) : intégration ERP, MES et plateforme de données
- [Planification de production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/) : planification en environnement d'ingénierie à la commande et à long délai
- [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/)
- [Cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Théorie des contraintes](https://www.m365.fm/en/learn/theory-of-constraints/) : goulots d'étranglement et drum-buffer-rope
- [Kanban et systèmes en flux tiré](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Approfondissements**
- [Dimensionnement des lots : EOQ, EPQ et règles de lot du MRP](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestion des stocks en fabrication et stock de sécurité](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Logistique interne et flux de matières dans l'usine](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Résilience de la chaîne d'approvisionnement](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Simulation de fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la production au plus juste, la planification de la production et la transformation numérique de l'industrie, en mettant l'accent sur la façon dont les processus de planification, les modèles de chaîne de valeur, la simulation et l'analyse des KPI fonctionnent ensemble en pratique.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked "via sibling pillar" were opened and verified on the same date for the m365.fm guide on production scheduling and APS or the Azure for manufacturing guide and are reused with their verified bibliographic data.

1. Sales and operations planning (history incl. aggregate production planning and Richard "Dick" Ling; definitions; five process steps after Wagner et al. 2014; tactical horizon up to 18 months; maturity models after Grimson and Pyke 2007 and Wagner et al. 2014; enablers and barriers). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce and GE in the early 1950s; Orlicky 1964; Black & Decker 1964 with Dick Alban; about 700 users by 1975 and about 8,000 by 1981; Oliver Wight's MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), definition and history (Harris 1913; Orlicky at IBM 1964; Plossl and Wight 1967; Orlicky's book 1975; Wight's MRP II 1983; Gartner coins ERP 1990; third edition by Ptak and Smith 2011 with DDMRP; re-checked in review round 3). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monthly cadence, rolling 18–36 month horizon; page within SAP's Integrated Business Planning section). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning and https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (18–36 month horizon; level, chase and mixed strategies). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (definitions of MPS and MRP; ATP and cumulative ATP as outputs). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, lecture slides, MIT 2.854 Introduction to Manufacturing Systems, Fall 2016 (based on Hopp and Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337 (via sibling pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, pp. 413–429. DOI: 10.1287/mnsc.32.4.413. Record: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP zone formulas, lead time and variability factor ranges, worked example). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (via sibling pillar; original not consulted)
14. The five steps of DDMRP (net flow equation, buffer zones). IFS blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in IFS Cloud documentation: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (six reviews; deployment guidance of 8–12 weeks). Anaplan (vendor), July 24, 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditional monthly cycle with five stages; concurrent planning, vendor claim). Kinaxis (vendor), published January 6, 2023, modified December 3, 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (five levels of S&OP maturity). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (secondary description of the Gartner S&OP maturity model). Jedox (planning software vendor). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, pp. 322–346. DOI: 10.1108/09574090710835093 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, pp. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, pp. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliographic data confirmed via Crossref, November 20, 2026; key finding via Wikipedia [1]; full text not consulted)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, pp. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (DOI resolution to Elsevier record S0925527311004907 confirmed; bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, pp. 359–381. DOI: 10.1108/17410401211212643 (bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (via sibling pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, preview. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (via sibling pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (via sibling pillar)
27. What is material requirements planning (MRP)? (MRP vs. ERP; FAQ topics incl. MRP II, MPS, DDMRP, predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (cites Oliver Wight/APICS Class A benchmarks without link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (vendor list; written by Board, one of the listed vendors). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (via sibling pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (via sibling pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (via sibling pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (existence of the product confirmed from the documentation title in search results; page content not fetched)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, pp. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (founded in 2011 by Carol Ptak and Chad Smith; software compliance certification free of charge to vendors; professional endorsement certificates). Demand Driven Institute. https://demanddriveninstitute.com/about-us (accessed November 20, 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (tracking signal rule of thumb: between −4 and 4). Supply Chain Resource Cooperative, NC State University, January 25, 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (accessed November 20, 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, section "Data accuracy" (inventory record accuracy 95% acceptable, 98% robust; BOM accuracy 98% minimum, 99+% good). Excerpt on GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (accessed November 20, 2026; author and publisher not shown on the excerpt page)
