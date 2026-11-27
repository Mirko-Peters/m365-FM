# SEO metadata

| Field | Value |
|---|---|
| Meta title | Kanban en production : système tiré lean, dimensionnement, règles |
| Meta description | Le kanban en production expliqué : fonctionnement d'un système tiré lean, types de cartes, formule de dimensionnement, e-kanban, CONWIP, déploiement et KPI. |
| Slug | `kanban-pull-system` |

# Système Kanban en fabrication : fonctionnement des systèmes tirés, dimensionnement et cas d'emploi d'une autre solution

> **Réponse courte :** Un système kanban est une méthode de pilotage de la production et des flux de matières fondée sur le tirage, dans laquelle un signal (une carte, un bac vide ou un message électronique) autorise un processus amont à fabriquer ou déplacer une quantité fixe, uniquement après que le processus aval l'a consommée. Le nombre de signaux dans une boucle plafonne le stock. Le Lean Enterprise Institute définit un kanban comme « un dispositif de signalisation qui donne l'autorisation et les instructions de production ou de prélèvement (transfert) d'articles dans un système en tirage » [1] ; la méthode a été développée chez Toyota sous la direction de Taiichi Ohno [7][10].

> **Points clés**
> - Un système en tirage se définit par une seule propriété : il limite explicitement le travail en cours (WIP) [2]. Le kanban est le système en tirage le plus connu, mais CONWIP, POLCA et drum-buffer-rope y répondent également.
> - Le kanban de fabrication (cartes, bacs, supermarchés) n'est pas la même chose qu'un tableau Kanban logiciel, bien que la méthode du tableau en soit issue [22].
> - Types principaux : kanban de production, kanban de retrait (transfert), kanban de signal (triangle) et kanban fournisseur [1]. Le système à deux bacs et le e-kanban sont des formes physique et numérique de la même logique.
> - Dimensionnement de base : nombre de kanbans = demande × délai de réapprovisionnement × (1 + facteur de sécurité) ÷ quantité par conteneur, arrondi à l'entier supérieur. Les boucles réelles nécessitent aussi des kanbans pour les intervalles de collecte et les tailles de lot amont [12][13][15].
> - Le kanban exige une demande stable et répétitive par référence, des changements de série courts et des processus fiables. Pour la production à forte variété et faibles volumes, CONWIP ou POLCA conviennent généralement mieux [3][20].
> - ERP/MRP et kanban ne sont pas concurrents : le MRP planifie la capacité et les matières à long délai d'approvisionnement, le kanban exécute le réapprovisionnement quotidien. La plupart des ERP disposent d'un module kanban avec sa propre formule de dimensionnement [15][16].
> - Le kanban élimine les stocks excédentaires ; les stocks tampons stratégiques contre les perturbations relèvent d'une décision distincte de gestion des risques. Toyota lui-même maintient un tampon délibéré de semi-conducteurs depuis un plan de continuité introduit après 2011 [26].

## Table des matières

1. [Qu'est-ce qu'un système kanban ?](#quest-ce-quun-système-kanban-)
2. [Kanban de fabrication et tableaux Kanban : lever la confusion des recherches](#kanban-de-production-vs-tableaux-kanban--lever-la-confusion-dans-les-recherches)
3. [Poussée contre tirage : ce qu'est réellement un système en tirage](#push-vs-pull--ce-quest-réellement-un-système-pull)
4. [Historique : de l'atelier d'usinage de Toyota à la pratique mondiale](#historique--de-latelier-dusinage-de-toyota-à-la-pratique-mondiale)
5. [Fonctionnement d'une boucle kanban, étape par étape](#fonctionnement-dune-boucle-kanban-étape-par-étape)
6. [Types de kanban](#types-de-kanban)
7. [Les six règles du kanban de Toyota](#les-six-règles-du-kanban-de-toyota)
8. [Comment calculer le nombre de kanbans : formules et exemples chiffrés](#comment-calculer-le-nombre-de-kanbans--formules-et-exemples-chiffrés)
9. [Supermarchés, lignes FIFO et processus pilote](#supermarchés-files-fifo-et-processus-pacemaker)
10. [Heijunka : lisser le planning dont dépend le kanban](#heijunka--niveler-le-programme-dont-dépend-le-kanban)
11. [Au-delà du kanban : CONWIP, POLCA et drum-buffer-rope](#au-delà-du-kanban--conwip-polca-et-drum-buffer-rope)
12. [E-kanban et articulation ERP/MRP](#e-kanban-et-interaction-avec-lerpmrp)
13. [Modèles : carte, feuille de dimensionnement, liste de contrôle des supermarchés, audit](#modèles--carte-feuille-de-dimensionnement-checklist-de-supermarché-audit)
14. [Mise en œuvre du kanban en fabrication : une feuille de route sur 26 semaines](#comment-mettre-en-œuvre-le-kanban-en-fabrication--une-feuille-de-route-sur-26-semaines)
15. [Indicateurs de performance du kanban et vision financière](#indicateurs-kanban-et-vision-financière)
16. [Erreurs courantes avec le kanban et comment les corriger](#erreurs-courantes-avec-le-kanban-et-comment-les-corriger)
17. [Limites : quand le kanban est le mauvais outil](#limites--quand-le-kanban-est-le-mauvais-outil)
18. [Glossaire du kanban](#glossaire-kanban)
19. [FAQ : questions sur le système kanban et le système en tirage](#faq--questions-sur-le-système-kanban-et-le-système-pull)
20. [Conclusion et premières étapes](#conclusion-et-premières-étapes)

## Qu'est-ce qu'un système kanban ?

Un système kanban est un ensemble de règles et de signaux qui lie la production et le mouvement des matières à la consommation réelle. Lorsqu'un processus aval utilise un conteneur de pièces, le conteneur vide ou sa carte retourne en amont. Ce signal est la seule autorisation de fabriquer ou de déplacer un remplacement. Pas de signal, pas de production. Le mot japonais kanban signifie « signal » ou « panneau d'affichage » [1]. Dans la pratique, le kanban est un système visuel. Un bac vide ou une carte placée à un poste constitue un signal visuel, l'un des plus simples de l'atelier : chacun peut le lire sans rapport ni écran.

Trois éléments font fonctionner un système kanban :

1. **Un nombre fixe de signaux par boucle.** Chaque carte ou bac représente un conteneur d'une quantité fixe. Le nombre de cartes en circulation correspond à l'inventaire maximal que cette boucle peut contenir.
2. **Un point de stockage défini.** Les pièces attendent dans un supermarché ou au point d'utilisation, à une adresse imprimée sur la carte [1].
3. **Des règles que tout le monde respecte.** Rien n'est fabriqué sans kanban, la carte reste avec les pièces, les défauts ne sont pas transmis [10][11].

Une carte kanban indique généralement le nom de la pièce, le numéro de pièce, le fournisseur externe ou le processus interne qui approvisionne, la quantité de conditionnement, l'adresse de stockage et l'adresse du processus consommateur [1]. Les kanbans peuvent être des cartes en papier, des plaques métalliques, des conteneurs vides, des billes colorées ou des messages électroniques ; le support compte moins que la discipline.

### Kanban, flux tiré et juste-à-temps : comment les termes se rapportent

Les trois termes sont souvent utilisés comme synonymes. Ce n'est pas le cas :

| Terme | Ce que c'est | Relation |
|---|---|---|
| Juste-à-temps (JAT) | Un principe de production : ne fabriquer que ce qui est nécessaire, au moment où il est nécessaire, en la quantité nécessaire [8] | L'un des deux piliers du Système de production Toyota, à côté du jidoka [8] |
| Système à flux tiré | Une logique de pilotage qui limite explicitement les en-cours, de sorte que le travail ne démarre que s'il y a de la place ou de la demande en aval [2] | Le mécanisme qui rend le JAT possible |
| Kanban | Un dispositif de signalisation spécifique et un ensemble de règles qui mettent en œuvre le flux tiré [1] | Une façon de construire un système à flux tiré ; d'autres sont le CONWIP, le POLCA et le drum-buffer-rope |

Toyota décrit en termes simples la boucle de réapprovisionnement qui sous-tend le JAT : un minimum de pièces se trouve à la ligne, et les processus amont réapprovisionnent ce que les processus aval prélèvent, de sorte que seul ce qui se vend est fabriqué (paraphrasé à partir de la page TPS de Toyota) [8]. Le kanban est le système d'instructions qui porte cette boucle. C'est pourquoi le kanban est l'un des outils centraux de la fabrication allégée : il transforme le principe lean du flux tiré en routine quotidienne. Le kanban n'élimine pas le gaspillage à lui seul, mais il plafonne la surproduction, l'un des sept gaspillages d'Ohno, et rend visible le gaspillage restant.

### Avantages d'un système kanban en fabrication

Les avantages du kanban découlent du plafonnement des en-cours, et non des cartes elles-mêmes :

- **Inventaire plus faible et prévisible.** La boucle ne peut pas contenir plus de cartes × quantité par conteneur, ce qui limite le stock excédentaire, l'espace de stockage et les coûts d'inventaire.
- **Délai de traversée plus court.** Selon la loi de Little, le délai moyen est égal aux en-cours moyens divisés par le débit [6]. Plafonner les en-cours plafonne le délai.
- **Problèmes visibles.** Lorsqu'une boucle manque de cartes, tout le monde le voit. C'est là tout l'intérêt de la règle de Toyota consistant à réduire les kanbans étape par étape [10].
- **Moins d'efforts de planification.** Seul un processus, le pacemaker, reçoit un programme ; les processus amont suivent les signaux.
- **Moins d'urgences de désorganisation.** Le réapprovisionnement devient une routine au lieu d'une exception.

Ces avantages sont conditionnels. De nombreuses pages web citent des réductions de 25 % de l'inventaire ou de 50 % du délai sans préciser l'usine, la référence de départ ou la méthode. Ce guide ne reprend pas de tels chiffres. Ce qui est mesurable dans votre propre usine figure dans la section sur les KPI, avec les formules.

## Kanban de production vs. tableaux Kanban : lever la confusion dans les recherches

Si vous avez recherché « système kanban » en espérant trouver des notes adhésives sur un tableau blanc ou un outil de gestion de projet, vous êtes tombé sur la branche industrielle d'un même arbre généalogique. Le sens logiciel, souvent écrit avec une majuscule sous la forme « la méthode Kanban », est décrit sur Wikipédia comme « une méthode lean pour gérer et améliorer le travail dans les systèmes humains » ; le livre de David J. Anderson, *Kanban: Successful Evolutionary Change for Your Technology Business* (2010), a décrit son évolution à partir de projets menés chez Microsoft et Corbis, et la méthode trouve ses racines dans la production en flux tendu de Toyota [22].

Les deux partagent l'idée de limiter la quantité de travail en cours (WIP). Elles diffèrent sur presque tout le reste :

| Aspect | Kanban de production | Tableau Kanban (travail intellectuel) |
|---|---|---|
| Ce qui circule | Pièces physiques dans des conteneurs standard | Tâches, tickets, user stories |
| Le signal | Carte, bac vide ou message électronique qui autorise une quantité fixe | Une carte représentant un élément de travail ; limites de WIP par colonne |
| Qui tire | Le processus aval prélève des pièces ; l'amont remplace exactement cette quantité | Un membre de l'équipe prend l'élément suivant dès qu'une capacité se libère |
| Dimensionnement | Formule basée sur la demande, le délai de réapprovisionnement, la taille du conteneur et la sécurité | Limites de WIP fixées par le jugement de l'équipe et les indicateurs de flux |
| Défaillance typique | Ruptures de stock, supermarchés débordants, cartes perdues | Colonnes surchargées, travail caché |
| Principaux textes de référence | Livre de Ohno sur le TPS, lexique LEI, manuels Toyota [1][9][11] | Anderson (2010) et la littérature ultérieure sur la méthode Kanban [22] |

Certaines pages web mélangent les deux sens, par exemple en comparant le kanban et Scrum dans une page sur la gestion des stocks industriels. Cela égare les lecteurs issus de l'usine. Le reste de ce guide porte sur le système kanban de production : pièces, conteneurs, boucles, formules. Si vous devez créer un tableau Kanban pour une équipe d'ingénierie ou de bureau, ou pour un flux de travail logiciel agile, les principes de limites de WIP et de flux de travail visible restent valables, mais les formules de dimensionnement ci-dessous ne s'appliquent pas.

## Push vs. pull : ce qu'est réellement un système pull

L'explication courante est « le push produit sur prévision, le pull produit sur la demande ». C'est proche, mais pas assez précis pour concevoir un système. Wallace Hopp et Mark Spearman ont proposé une définition plus nette : « Un système de production pull est un système qui limite explicitement la quantité de travail en cours pouvant se trouver dans le système » [2]. Leur article soutient que les écrits de praticiens ont trop simplifié le pull et le lean, et que le pull repose au fond sur un plafonnement du WIP [2].

Cette définition a des conséquences pratiques :

- **Une ligne en production sur stock avec kanban relève du pull,** car les cartes plafonnent le WIP et le stock de produits finis.
- **Une ligne en production sur commande peut aussi être en pull,** si les commandes n'entrent que lorsqu'un plafond de WIP le permet (CONWIP, POLCA).
- **Une usine qui « produit sur commandes clients » mais lance chaque commande en atelier dès sa prise est en push,** même si la demande est réelle. Le WIP croît avec le carnet de commandes.

L'approche traditionnelle de la fabrication est le push. Un système de planification, généralement la planification des besoins en composants (MRP) au sein d'un progiciel de gestion intégré (ERP), utilise des prévisions et des données historiques pour déterminer le volume de production et lance des ordres de fabrication avant réception d'une commande client. Dans un système pull, les activités de production ne démarrent que lorsque la consommation aval ou une commande client libère de la place sous le plafond de WIP. En bref, un système pull est une méthode de pilotage de la production guidée par la demande réelle ; les deux systèmes diffèrent moins par leurs données que par ce qui déclenche le travail.

### La loi de Little : pourquoi plafonner le WIP plafonne le délai

John Little a publié la démonstration de la formule de files d'attente L = λW en 1961 [6]. Traduite en termes d'usine : WIP moyen = débit × délai moyen, ou délai = WIP ÷ débit.

**Exemple chiffré.** Une cellule d'usinage expédie 400 pièces par jour. Un comptage au sol relève 3 200 pièces de WIP entre la scie et le contrôle final. Délai moyen = 3 200 ÷ 400 = 8 jours. Si un système pull plafonne le WIP à 1 200 pièces et que le débit reste à 400 par jour, le délai moyen tombe à 1 200 ÷ 400 = 3 jours. Les machines n'ont pas accéléré. Les pièces attendent simplement moins.

La loi de Little vaut pour les moyennes de long terme dans un système stable [6]. Elle ne dit pas de combien on peut réduire le WIP avant que le débit ne souffre. Cela dépend de la variabilité, raison pour laquelle les systèmes pull ont besoin d'un tampon et pour laquelle les formules de dimensionnement incluent des termes de sécurité.

### Push vs. pull : différences clés et hybrides

| Critère | Push (lancement piloté par MRP) | Pull (kanban, CONWIP, POLCA) |
|---|---|---|
| Déclencheur de la production | Lancement d'ordre planifié à partir des prévisions ou des commandes | Consommation ou autorisation de WIP libre |
| En-cours (WIP) | Non plafonné ; suit le plan et ses erreurs | Plafonné par le nombre de cartes ou d'autorisations [2] |
| Délai de traversée | Variable, augmente souvent avec la charge | Stable tant que le plafond de WIP est respecté (loi de Little) [6] |
| Réaction à l'erreur de prévision | Surproduction ou rupture | Autocorrection dans la plage de la boucle |
| Besoins en données | Nomenclatures, gammes, délais et stocks exacts | Comptage précis des conteneurs, discipline des cartes |
| Convient à | Délais longs, nomenclatures complexes, faible volume par article | Demande répétitive, délais de réapprovisionnement courts |

La plupart des usines fonctionnent en mode hybride. Un article d'IndustryWeek rédigé par un fournisseur soutient qu'une combinaison de push et de pull peut être la meilleure solution lorsque la demande est volatile [25]. Dans la pratique, cela signifie généralement que le MRP planifie la capacité et les achats à long délai, tandis que le kanban ou le CONWIP pilote le lancement quotidien. La section ERP ci-dessous montre comment. Le choix entre push et pull n'est donc que rarement une décision unique pour toute l'usine ; il se fait par référence et par étape de processus.

## Historique : de l'atelier d'usinage de Toyota à la pratique mondiale

Le kanban est né du Système de production Toyota. Toyota attribue à Kiichiro Toyoda (1894–1952) le concept du juste-à-temps et indique qu'il a introduit le convoyeur à chaîne dans l'assemblage de métiers à tisser dès 1927, puis dans la ligne d'assemblage des carrosseries de l'usine de Koromo en 1938 [8]. Une légende de photo sur la page TPS de Toyota crédite Taiichi Ohno (1912–1990) d'avoir « créé le cadre de base de la méthode Just-in-Time » [8].

Selon l'article kanban de Wikipédia, Toyota a appliqué la logique kanban dans son atelier d'usinage principal en 1953 [10]. Le même article indique que Toyota a étudié les supermarchés à la fin des années 1940, dans l'idée d'appliquer aux ateliers les techniques de réapprovisionnement des rayons ; cette phrase n'est pas sourcée dans l'article, il faut donc considérer cette date comme [unverified: phrase sans citation dans l'article source]. L'analogie avec le supermarché est si centrale que « supermarché » est devenu le terme lean désignant un point de stockage maîtrisé.

La première description académique en langue anglaise est venue d'ingénieurs de Toyota. Sugimori et trois coauteurs ont publié « Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system » dans l'*International Journal of Production Research* en 1977 [7]. L'article présente deux caractéristiques : la production juste-à-temps, où seuls les produits nécessaires sont fabriqués au moment, en quantité et en nombre nécessaires, et un système de « respect de l'humain » dans lequel les opérateurs exploitent pleinement leurs capacités en participant à la conduite et à l'amélioration de leur atelier [7]. Le livre d'Ohno lui-même, *Toyota Production System: Beyond Large-Scale Production*, a paru en anglais en 1988 [9].

À partir des années 1980, les chercheurs occidentaux ont commencé à analyser et à faire varier la méthode. Spearman, Woodruff et Hopp ont introduit le CONWIP en 1990 comme « une alternative pull au kanban » [3]. Co et Moosa ont examiné en 1997 la formule kanban de Toyota elle-même [14]. Rajan Suri, fondateur et directeur du Center for Quick Response Manufacturing de l'Université du Wisconsin–Madison de 1993 à 2007, a créé le POLCA pour les ateliers à forte diversité et faible volume [20][21]. Une revue de littérature de 2010 signée Lage Junior et Godinho Filho a recensé 32 variantes publiées du système kanban et constaté un large écart entre les propositions théoriques et les propositions pratiques [17]. La logique centrale de la boucle des années 1950 a survécu à toutes ces variantes.

## Fonctionnement d'une boucle kanban, étape par étape

La conception Toyota classique utilise deux types de cartes : les kanbans de prélèvement, qui déplacent les pièces d'un magasin-supermarché vers le consommateur, et les kanbans de production, qui indiquent au processus amont de fabriquer les remplacements [1]. Voici un cycle complet entre une ligne d'assemblage et une cellule d'emboutissage et de soudage qui alimente les équerres.

| Étape | Lieu | Ce qui se passe | Signal |
|---|---|---|---|
| 1 | Ligne d'assemblage, point d'utilisation | L'opérateur prend la dernière équerre dans un conteneur ; le conteneur vide part vers le rack de retour | Le kanban de prélèvement est détaché et placé dans le poste kanban |
| 2 | Poste kanban | Un manutentionnaire collecte les kanbans de prélèvement selon un parcours fixe, par exemple toutes les 30 ou 60 minutes | Kanbans de prélèvement collectés |
| 3 | Supermarché après la cellule d'équerres | Le manutentionnaire prend un conteneur plein par kanban de prélèvement ; le kanban de production fixé sur ce conteneur est retiré et placé dans le poste des kanbans de production | Le kanban de prélèvement est posé sur le conteneur plein ; le kanban de production part vers la cellule |
| 4 | Ligne d'assemblage | Le conteneur plein arrive à son adresse de point d'utilisation | Le kanban de prélèvement voyage avec les pièces |
| 5 | Cellule d'équerres | Les kanbans de production sont alignés dans l'ordre, souvent sur un tableau heijunka ou un simple rail | Chaque kanban de production autorise un conteneur |
| 6 | Cellule d'équerres | La cellule fabrique exactement la quantité indiquée sur la carte et remet le conteneur plein, avec le kanban de production fixé, dans le supermarché | Kanban de production de retour sur le conteneur |

Deux caractéristiques sont faciles à négliger :

- **Le supermarché est le tampon, pas la ligne.** La ligne ne détient que ce qu'elle consomme entre deux livraisons. Le supermarché absorbe l'écart entre le rythme par lots de la cellule et la consommation régulière de la ligne.
- **Les cartes mesurent le stock.** Si 12 kanbans de production existent pour l'équerre B-200 et que 3 attendent à la cellule, 9 conteneurs sont soit pleins dans le supermarché, soit en transit, soit à la ligne. Un comptage rapide permet de voir si des cartes ont été perdues ou si des conteneurs sont accumulés.

Une variante plus simple, à carte unique, supprime le kanban de prélèvement : le consommateur prend un conteneur dans un stock proche, et le conteneur vide ou une carte de production retourne directement au processus amont. Elle est plus simple et fonctionne bien lorsque le fournisseur et le consommateur sont proches l'un de l'autre.

## Types de kanban

Le Lean Enterprise Institute distingue deux grandes familles : le kanban de production et le kanban de retrait, le kanban de signal étant un kanban de production particulier et le kanban fournisseur un kanban de retrait particulier [1]. Les fournisseurs de logiciels et les manuels ajoutent d'autres appellations, c'est pourquoi les listes des différents types de kanban varient d'une page à l'autre. Le tableau les classe selon ce qu'ils autorisent.

| Type | Autorise | Usage typique | Remarques |
|---|---|---|---|
| Kanban de production | Le processus amont à fabriquer le type et la quantité indiqués sur la carte pour un processus aval [1] | Cellules et machines à changements de série courts, capables de produire un conteneur à la fois | Une carte = un conteneur |
| Kanban de signal (kanban triangle) | La production d'un lot lorsque le stock tombe au point de déclenchement, « lorsqu'un nombre minimal de conteneurs est atteint » [1] | Presses, moulage, traitement thermique, peinture : processus à longs changements de série devant tourner par lots | Accroché au point de réapprovisionnement dans la pile de conteneurs ; souvent des plaques métalliques triangulaires |
| Kanban de retrait (kanban de transport) | Le transport des pièces vers un processus aval [1] | Entre le supermarché et la ligne | Kanban interne ou interprocessus [1] |
| Kanban fournisseur | Le prélèvement chez un fournisseur externe [1] | Pièces achetées à consommation régulière | Le LEI note que les kanbans fournisseurs pour les fournisseurs éloignés ont généralement pris une forme électronique [1] |
| Système à deux bacs (et à trois bacs) | Le réapprovisionnement d'un bac lorsqu'il est vide, pendant que le second bac couvre la consommation | Visserie, consommables, pièces C à faible coût | Le bac vide est le signal ; Wikipédia décrit le système à deux bacs comme l'origine la plus simple du kanban et décrit aussi une variante à trois bacs (ligne, magasin d'usine, fournisseur) [10] |
| Kanban d'urgence ou express | Un réapprovisionnement supplémentaire ponctuel après une rupture ou un défaut | Rattrapage après rebut ou livraison manquée | À retirer après usage ; sinon la boucle grossit silencieusement |
| Kanban ponctuel (événementiel, à usage unique) | Pièces supplémentaires pour une demande exceptionnelle connue | Promotions, une commande de service, la fabrication d'un prototype | Microsoft Dynamics 365 gère ces kanbans comme des kanbans à usage unique signalés selon une règle de quantité fixe, ainsi que des kanbans événementiels pour une demande exceptionnelle au-delà d'une quantité définie [15] |
| Kanban traversant (tunnel) | Production et retrait combinés sur une même carte | Deux processus étroitement liés fonctionnant comme un seul, par exemple forgeage et traitement thermique | Cité par Cin7 parmi ses six types ; la terminologie varie selon les sources |
| Carte CONWIP | Lancement de n'importe quel travail dans une ligne ; la carte revient au début de la ligne lorsqu'un travail se termine [5] | Lignes à nombreuses références partageant un même cheminement | Non spécifique à une pièce, voir la section CONWIP |
| E-kanban | L'un quelconque des types ci-dessus sous forme de message électronique | Fournisseurs éloignés, grandes boucles, réapprovisionnement intégré à l'ERP | Supprime les erreurs de cartes perdues et de saisie manuelle [10] |

### Quel type de kanban pour quelle boucle

| Situation | Type recommandé | Pourquoi |
|---|---|---|
| Cellule fournisseur à côté de la ligne, changement de série inférieur à 10 minutes | Kanban de production, carte unique | Peut produire conteneur par conteneur |
| Atelier de presses avec changements de série de 45 minutes alimentant plusieurs lignes | Kanban de signal avec un supermarché | La taille des lots est dictée par l'économie des changements de série, et non par la taille du conteneur |
| Entrepôt central alimentant plusieurs cellules | Kanban de retrait plus une tournée (milk run) | Sépare le transport de la fabrication |
| Pièces standard achetées, consommation régulière, fournisseur à 800 km | E-kanban fournisseur | Les cartes papier circulent trop lentement |
| Vis, rondelles, étiquettes, gants | Deux bacs | Signal le moins coûteux possible, sans comptage |
| Nombreuses variantes sur un même cheminement, demande irrégulière par variante | Cartes CONWIP | Des cartes spécifiques à chaque pièce rempliraient l'atelier de stocks à rotation lente |
| Atelier à l'unité avec de nombreux cheminements | Cartes POLCA | Contrôle le flux entre paires de cellules |

## Les six règles du kanban de Toyota

Presque toutes les pages web énumèrent « six règles ». Deux versions circulent, et il est utile de connaître les deux.

**Version 1, telle que résumée sur Wikipédia** (citant Toyota) [10] :

1. Chaque processus émet des demandes (kanban) auprès de ses fournisseurs lorsqu'il consomme ses approvisionnements.
2. Chaque processus produit selon la quantité et la séquence des demandes reçues.
3. Aucun article n'est fabriqué ni transporté sans demande.
4. La demande associée à un article est toujours attachée à celui-ci.
5. Les processus ne doivent pas transmettre d'articles défectueux, afin de garantir que les produits finis soient exempts de défauts.
6. Limiter le nombre de demandes en attente rend le processus plus sensible et révèle les inefficacités.

**Version 2, d'après le *Toyota Production System Handbook* (1973, traduit par Mark Warren), telle que présentée par Christoph Roser** [11] :

1. Ne pas envoyer de produits défectueux au processus de production suivant.
2. Le processus de production suivant vient prélever.
3. Ne produire que la quantité prélevée par le processus suivant.
4. Réduire les fluctuations.
5. Le kanban est un moyen de réglage fin.
6. Stabiliser et rationaliser le processus de production.

Roser note qu'« il existe différentes versions des règles du kanban de Toyota » et ajoute une règle qu'il a apprise chez Toyota, absente des deux listes : toute matière présente dans le système doit porter une carte kanban [11]. Il souligne également que la version du manuel mêle des prérequis (absence de défauts, processus stables) et des règles de fonctionnement [11].

### Ce que signifient les règles sur le terrain

| Règle (combinée) | Comportement sur le terrain | Violation typique | Conséquence |
|---|---|---|---|
| L'aval tire | Le consommateur ou le manutentionnaire vient chercher ; le fournisseur ne livre pas sans demande | La cellule amont « aide » en poussant des conteneurs supplémentaires | Les supermarchés débordent, les cartes ne reflètent plus le stock réel |
| Ne produire que ce qui a été pris | Les kanbans de production fixent la quantité et la séquence | Produire tout un poste « pendant le changement de série » | Surproduction cachée, l'un des sept gaspillages d'Ohno |
| Aucune pièce sans carte | Chaque conteneur plein porte sa carte | Conteneurs non étiquetés dans un coin, « stock de sécurité » | Stock en boucle inconnu ; le comptage des cartes est faux |
| La carte reste avec les pièces | Ne la détacher qu'au moment défini | Cartes dans des poches, sur des bureaux, dans des tiroirs | Cartes perdues = réapprovisionnement perdu = rupture |
| Aucun défaut en aval | Les pièces défectueuses sont arrêtées et signalées à la source | Pièces défectueuses mêlées à un conteneur plein | Le consommateur manque de pièces avec un conteneur « plein » |
| Réduire les cartes progressivement | Retirer une carte, observer, résoudre, recommencer | Retirer la moitié des cartes d'un coup | Arrêt de ligne, perte de confiance, retour à la production poussée |
| Niveler et stabiliser | La demande au pacemaker est lissée ; les processus sont capables | Fortes variations quotidiennes en assemblage final | Le kanban amplifie les variations en amont (voir heijunka) |

La règle 6 de la version 1 est celle que les usines occidentales appliquent le plus souvent de travers. Roser soutient, dans une réponse à des lecteurs, que Toyota « a a) beaucoup moins de problèmes et b) beaucoup plus de main-d'œuvre pour les résoudre », si bien que les usines ne disposant pas de cette capacité de résolution de problèmes devraient conserver suffisamment de kanbans plutôt que d'en supprimer pour provoquer des problèmes qu'elles ne savent pas encore résoudre [12]. Retirer une carte est une expérience. Ne la mener que lorsque quelqu'un est prêt à corriger ce qu'elle met au jour.

## Comment calculer le nombre de kanbans : formules et exemples chiffrés

C'est la question que se posent la plupart des internautes et que la plupart des pages éludent. Les sections ci-dessous partent de la formule de base, montrent comment la pratique professionnelle l'affine, comparent les formules utilisées par les éditeurs d'ERP et d'autres guides sur les mêmes données, puis traitent six cas. Les six exemples de kanbans sont illustratifs : ils reposent sur des données typiques d'usine et non sur des cas réels d'une entreprise nommée, afin que vous puissiez suivre chaque étape et remplacer les chiffres par les vôtres.

Un avertissement d'abord, selon les mots de Roser : « Le calcul du kanban n'est rien d'autre qu'une estimation très grossière reposant sur de nombreuses hypothèses » [12]. La formule fournit un point de départ. La boucle est ensuite ajustée en l'observant.

### La formule de base

> **Nombre de kanbans N = (D × L × (1 + α)) ÷ C**, arrondi à l'entier supérieur
>
> D = demande moyenne par unité de temps (par exemple pièces par jour)
> L = délai de réapprovisionnement dans la même unité de temps : depuis le moment où un conteneur est vidé (ou sa carte libérée) jusqu'au retour du conteneur plein à son point de stockage
> α = coefficient de sécurité (par exemple 0,10 pour 10 pour cent)
> C = quantité par conteneur (pièces par kanban)

Cette structure, demande pendant le délai de réapprovisionnement plus une marge de sécurité, divisée par la quantité par conteneur, est la base utilisée par Microsoft Dynamics 365 Supply Chain Management, avec un « +1 » ajouté dans ses variantes principales [15]. Smartsheet utilise une variante où le stock de sécurité est exprimé en jours : C = [D × (L + SSD)] ÷ S, où SSD représente les jours de stock de sécurité et S la quantité par bac [23]. La pratique propre à Toyota, telle qu'analysée par Co et Moosa, fixe le nombre de kanbans à partir de la demande moyenne pendant un cycle de commande, multipliée par un facteur constant de surplanification [14].

**Exemple chiffré 1 : boucle de base.** La ligne d'assemblage final utilise le support B-200. Demande quotidienne D = 960 pièces sur deux équipes. Délai de réapprovisionnement depuis la cellule de supports L = 0,25 jour. Coefficient de sécurité α = 0,10. Quantité par conteneur C = 40.

N = 960 × 0,25 × 1,10 ÷ 40 = 264 ÷ 40 = 6,6, arrondi à **7 kanbans**.

La boucle ne peut jamais contenir plus de 7 × 40 = 280 supports, soit 280 ÷ 960 = 0,29 jour de demande. Selon la loi de Little, le temps moyen qu'un support passe dans la boucle est au plus d'environ 0,29 jour, soit environ 4,4 heures de travail sur une journée de 15 heures [6].

### D'où vient réellement L : décomposition du temps de réapprovisionnement

La formule de base masque l'entrée la plus difficile. L n'est pas le temps de cycle de la machine qui alimente la boucle. Roser décompose le temps de réapprovisionnement en délai du flux matière plus retards d'information : temps d'attente du kanban jusqu'à la collecte de la carte, attente jusqu'à ce que suffisamment de kanbans se soient accumulés pour former un lot, temps de file derrière d'autres références, changements de série, et transport [12]. Il ajoute ensuite des kanbans supplémentaires pour la formation des lots, pour l'attente derrière d'autres lots, pour le regroupement client et pour les pointes de demande, ainsi qu'une marge de sécurité facultative [13].

| Composante du temps de réapprovisionnement | Comment la mesurer | Angle mort typique |
|---|---|---|
| Temps d'attente de la carte au poste kanban | Intervalle de collecte de la tournée ; utiliser l'intervalle complet pour une estimation prudente | Supposer que les cartes circulent instantanément |
| Attente de constitution d'un lot | Si la cellule traite des lots de n conteneurs, jusqu'à n – 1 cartes attendent | Ignorer les tailles de lot chez le fournisseur |
| File derrière d'autres références | Observer la séquence de la cellule ; compter les autres lots en amont | Supposer que la cellule est libre à l'arrivée de la carte |
| Changement de série | Étude de temps ou référence SMED | Omettre les changements de série parce qu'ils sont « courts » |
| Temps de traitement d'un lot | Temps de cycle × quantité du lot | Utiliser une pièce au lieu du lot entier |
| Transport et mise en place | Durée du trajet jusqu'au supermarché | Oublier les attentes de chariot élévateur et les pauses d'équipe |

**Exemple chiffré 2 : le même support avec le temps de réapprovisionnement complet.** Deux équipes donnent 900 minutes de temps disponible, donc takt = 900 ÷ 960 = 0,9375 minute (56,25 secondes) par support.

- Collecte des cartes toutes les 60 minutes : par prudence, 60 minutes d'attente
- File à la cellule de supports derrière d'autres références : 90 minutes
- Traitement d'un conteneur : 40 pièces × 30 secondes = 20 minutes
- Transport et mise en place : 15 minutes
- Temps de réapprovisionnement sans effets de lot : 60 + 90 + 20 + 15 = 185 minutes

Pièces consommées pendant ce temps : 185 ÷ 0,9375 = 197,3 pièces, soit 197,3 ÷ 40 = 4,93 kanbans.

La cellule effectue des lots par quatre conteneurs pour limiter les changements de série. Jusqu'à trois cartes peuvent attendre que le lot se forme, donc on ajoute 3 kanbans : 4,93 + 3 = 7,93. On ajoute une marge de sécurité de 10 % sur la partie liée au temps (0,49) : 8,42, arrondi au supérieur à **9 kanbans**.

La formule de base donnait 7. L'écart de deux cartes vient presque entièrement de la taille du lot dans la cellule amont. C'est pourquoi le SMED, qui permet des lots plus petits, est le levier habituel pour réduire le nombre de kanbans, et non des règles plus strictes. Pour en savoir plus sur les changements de série, consultez le [guide SMED et réduction des temps de changement](https://www.m365.fm/en/learn/smed-changeover-reduction/).

### Mêmes données, formules différentes

Les sites débattent souvent de la « bonne » formule alors qu'ils divergent en réalité sur les données d'entrée. Ce tableau applique les formules publiées aux données de l'exemple 1 (D = 960 par jour, L = 0,25 jour, α = 0,10, C = 40). Pour la formule de Smartsheet, le facteur de sécurité de 10 % est converti en jours de sécurité : 0,1 × 0,25 = 0,025 jour.

| Source | Formule telle que publiée | Calcul | Résultat |
|---|---|---|---|
| Forme de base des manuels | D × L × (1 + α) ÷ C | 960 × 0,25 × 1,1 ÷ 40 = 6,6 | 7 |
| Smartsheet [23] | D × (L + SSD) ÷ S | 960 × (0,25 + 0,025) ÷ 40 = 6,6 | 7 |
| Microsoft Dynamics 365 SCM, sans stock de sécurité [15] | (demande moyenne × délai d'approvisionnement × (facteur de sécurité + 1)) ÷ quantité par unité de manutention + 1, arrondi au supérieur | 6,6 + 1 = 7,6 | 8 |
| Oracle JD Edwards, équation 1 [16] | taille du kanban = demande quotidienne haute × (délai de livraison en jours + écart de scan en jours) + stock de sécurité ; cartes = taille du kanban ÷ taille du conteneur | avec demande quotidienne haute 1 100, délai 0,25 jour, écart de scan 0, stock de sécurité 40 : (1 100 × 0,25 + 40) ÷ 40 = 7,9 | 8 |
| Méthode par étapes de Roser [12][13] | temps de réapprovisionnement ÷ takt ÷ pièces par kanban + kanbans supplémentaires + sécurité | voir l'exemple 2 | 9 |

Les résultats vont de 7 à 9. L'écart provient de trois choix : ajouter ou non une carte supplémentaire pour le conteneur en cours de consommation (le +1 de Dynamics 365), utiliser la demande de pointe ou la demande moyenne (JD Edwards utilise la demande la plus élevée sur la période dans la fenêtre MRP [16]), et prendre ou non en compte les effets de taille de lot (Roser [13]). Tranchez ces trois points une fois, consignez-les dans votre standard kanban et appliquez-les à chaque boucle.

### Exemple détaillé 3 : kanban fournisseur

Pour les pièces achetées, le temps de réapprovisionnement comprend l'intervalle de commande (fréquence d'envoi des cartes ou des signaux), le délai d'approvisionnement du fournisseur et le temps de transport. Une forme courante est :

> **N = D × (intervalle de commande + délai fournisseur + temps de sécurité) ÷ C**

Un boîtier est consommé à raison de 300 pièces par jour. Les signaux sont envoyés au fournisseur une fois par jour (intervalle de commande 1 jour), le fournisseur a besoin de 3 jours entre le signal et la livraison, et le site souhaite 1 jour de temps de sécurité. Les conteneurs contiennent 100 pièces.

N = 300 × (1 + 3 + 1) ÷ 100 = 1 500 ÷ 100 = **15 kanbans**. L'en-cours maximal de la boucle est de 1 500 pièces, soit 5 jours de consommation, dont la majeure partie se trouve dans le pipeline chez le fournisseur ou sur le camion, et non dans l'usine.

Si le site passe de signaux quotidiens à des signaux deux fois par jour (intervalle de commande 0,5 jour), N = 300 × 4,5 ÷ 100 = 13,5, soit 14 kanbans. Si le délai fournisseur passe de 3 à 2 jours, N = 300 × 4 ÷ 100 = 12. Le délai fournisseur est généralement le levier le plus important.

### Exemple détaillé 4 : kanban de signal pour un procédé par lots

Les kanbans de signal se dimensionnent différemment, car le procédé amont fabrique un lot bien plus grand qu'un conteneur. Deux valeurs sont nécessaires : le point de déclenchement (quand lancer un lot) et la taille du lot (quantité à produire).

Une presse d'emboutissage alimente la pièce P-17, parmi d'autres pièces. La demande est de 1 200 pièces par jour sur 900 minutes disponibles, soit 1,333 pièce par minute. Les conteneurs contiennent 60 pièces, la ligne consomme donc 20 conteneurs par jour. Comme la presse a besoin de 40 minutes pour changer de série, la planification a fixé un lot de 10 conteneurs (600 pièces).

- Attente de la presse (autres pièces en amont) : jusqu'à 120 minutes
- Changement de série : 40 minutes
- Production de 600 pièces à 3 secondes chacune : 30 minutes
- Transfert vers le supermarché : 10 minutes
- Temps de réapprovisionnement : 200 minutes

Consommation pendant le réapprovisionnement = 200 × 1,333 = 267 pièces = 4,44 conteneurs. Avec un conteneur de sécurité, le point de déclenchement est de 5,44, arrondi au supérieur à 6 conteneurs. Le kanban triangle est accroché au sixième conteneur depuis le bas de la pile. Lorsque la ligne l'atteint, la presse reçoit son signal.

Stock maximal = point de déclenchement + lot = 6 + 10 = 16 conteneurs = 960 pièces, soit environ 0,8 jour de demande. Si le SMED ramène le changement de série à 10 minutes et si la planification réduit le lot à 4 conteneurs, le stock maximal tombe à environ 6 + 4 = 10 conteneurs, en supposant que la file d'attente de la presse reste identique. La logique de dimensionnement des lots elle-même est traitée dans le [guide sur le dimensionnement des lots](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

### Exemple travaillé 5 : système à deux bacs pour les pièces de type C

Les vis M6 sont consommées à raison d'environ 1 500 pièces par semaine sur un poste de travail. Le distributeur réapprovisionne un bac vide dans la semaine qui suit la mise du bac vide sur l'étagère de prélèvement. Chaque bac doit couvrir la demande pendant le réapprovisionnement, plus une marge.

Taille de bac = 1 500 × 1 semaine × 1,2 = 1 800 vis. Deux bacs de 1 800 contiennent 3 600 vis au total. Lorsque le premier bac est vide, l'opérateur passe au second et place le bac vide, avec son étiquette, sur l'étagère. Personne ne compte les vis. Si le second bac se vide régulièrement avant le retour du premier, la taille du bac ou le délai de réapprovisionnement est mal calibré ; la solution consiste à mesurer les deux, et non à ajouter informellement un troisième bac.

### Exemple travaillé 6 : quelle sensibilité pour la boucle ?

En prenant l'exemple 1 comme cas de base (D = 960, L = 0,25 jour, α = 0,10, C = 40), le tableau montre le nombre de kanbans donné par la formule de base lorsqu'une donnée change.

| Modification | N (non arrondi) | Kanbans | Stock maximal de la boucle |
|---|---|---|---|
| Cas de base | 6,6 | 7 | 280 |
| Délai de réapprovisionnement réduit de moitié, à 0,125 jour | 3,3 | 4 | 160 |
| Délai de réapprovisionnement doublé, à 0,5 jour | 13,2 | 14 | 560 |
| Quantité par conteneur réduite de moitié, à 20 | 13,2 | 14 | 280 |
| Quantité par conteneur doublée, à 80 | 3,3 | 4 | 320 |
| Demande en hausse de 25 %, à 1 200 | 8,25 | 9 | 360 |
| Coefficient de sécurité de 0,25 au lieu de 0,10 | 7,5 | 8 | 320 |

Deux enseignements en découlent. Premièrement, le délai de réapprovisionnement a l'effet le plus fort sur le stock : le réduire de moitié ramène le stock maximal de 280 à 160. Deuxièmement, des conteneurs plus petits ne réduisent pas beaucoup le stock maximal à eux seuls (14 × 20 = 280) ; ils lissent surtout le flux et font apparaître les problèmes plus tôt, tandis que doubler les conteneurs à 80 augmente le stock, car l'arrondi gaspille davantage.

### Arrondi, minimums et recalcul

- **Arrondir au supérieur, puis juger.** Arrondir 6,6 à 7 est évident. Roser arrondirait à la baisse un résultat de 61,2 kanbans dans une grande boucle, mais arrondirait à la hausse 61,9 [13]. Dans les petites boucles, arrondissez toujours au supérieur.
- **Minimum de deux kanbans.** Une boucle avec une seule carte arrête le consommateur chaque fois que la carte est en transit. Deux est le minimum pratique ; certaines usines fixent trois comme règle interne.
- **Recalculer selon un calendrier.** La demande évolue. Recalculez la taille des boucles chaque mois ou lorsque la prévision de demande varie au-delà d'un seuil convenu (par exemple 15 %). Les modules kanban des ERP peuvent le faire à partir des périodes de demande [15].
- **Ajouter et retirer les cartes formellement.** Chaque modification passe par la personne qui tient la liste de référence des kanbans, avec une date. Sinon, les cartes se multiplient.
- **Planifier explicitement les pics.** Pour les pics saisonniers, ajoutez des cartes temporaires d'une couleur différente avec une date de fin, ou utilisez des kanbans ponctuels [15].

## Supermarchés, files FIFO et processus pacemaker

Les cartes Kanban sont la partie visible d'un système tiré. Sa structure est définie plus en amont, sur la cartographie de la chaîne de valeur à l'état futur : où placer les supermarchés, où relier les processus par des files FIFO, et quel processus unique reçoit le planning. Si vous n'avez pas encore dessiné cette cartographie, commencez par le [guide de cartographie de la chaîne de valeur](https://www.m365.fm/en/learn/value-stream-mapping/) ; les symboles Kanban (kanban de production, kanban de retrait, kanban de signal, boîte à kanban) y sont expliqués.

### Types de systèmes tirés : trois formes de base

| Forme | Fonctionnement | Convient à | Stock conservé |
|---|---|---|---|
| Tirage par supermarché (tirage de réapprovisionnement) | Chaque processus détient un supermarché de ses sorties ; l'aval prélève, l'amont remplace ce qui a été pris | Nombreuses références récurrentes à demande stable | Chaque référence active est stockée |
| Tirage séquentiel | Les ordres sont lancés en début de chaîne dans l'ordre de fabrication ; les processus sont reliés par des files FIFO à quantité maximale | Nombreuses variantes, faible volume par variante, délai court et prévisible | Peu ou pas de stock de produits finis ; en-cours plafonné par la taille des files |
| Tirage mixte | Gros volumes en supermarchés, faibles volumes fabriqués à la commande en séquence | La plupart des usines réelles | Stock uniquement pour les gros volumes |

### Segmenter les références avant de concevoir les boucles

Toutes les références n'ont pas leur place dans un supermarché. Une répartition pratique s'appuie sur le volume et la régularité de la demande, souvent appelée runners, repeaters et strangers.

| Segment | Profil (seuils indicatifs, à fixer par vos soins) | Méthode de pilotage |
|---|---|---|
| Runners | Demande quotidienne, faible variation (par exemple coefficient de variation inférieur à 0,5) | Supermarché avec kanban de production ou kanban de signal |
| Repeaters | Demande la plupart des semaines, variation modérée | Supermarché avec moins de cartes, ou fabrication à la commande avec une petite file FIFO tampon |
| Strangers | Sporadiques, spécifiques à un client ou nouvelles | Fabrication à la commande, lancée par autorisation CONWIP ou POLCA, ou planifiée par MRP |

Le coefficient de variation est l'écart type de la demande journalière (ou hebdomadaire) divisé par sa moyenne. Une référence avec une moyenne de 100 par jour et un écart type de 30 a CV = 0,3. Une référence avec une moyenne de 10 par jour et un écart type de 15 a CV = 1,5 et constitue un mauvais candidat au kanban : sa boucle devrait contenir assez de stock pour les rares pics, si bien que la plupart du temps les conteneurs resteraient immobiles.

### Concevoir un supermarché

| Point de conception | Règle empirique | Pourquoi |
|---|---|---|
| Emplacement | À côté du processus fournisseur, et non du consommateur | Le fournisseur voit son propre stock et le remplace ; le manutentionnaire vient le chercher |
| Adressage | Chaque référence a une adresse fixe unique (allée, rack, niveau, emplacement) imprimée sur la carte [1] | Les conteneurs égarés deviennent visibles ; le réapprovisionnement est rapide |
| Capacité | Emplacements physiques pour exactement le nombre maximal de conteneurs de la boucle, pas davantage | La surproduction n'a nulle part où aller ; elle devient visible |
| Sens de flux | Charger par l'arrière, prélever par l'avant (racks à flux gravitaire) | Premier entré, premier sorti par conception |
| Max/min visuel | Repères colorés ou position du kanban de signal sur le rack | Chacun peut voir l'état sans système |
| Standard de conteneur | Conteneur convenu par référence, à quantité fixe ; poids ergonomique | Compter par conteneurs plutôt que par pièces |
| Sécurité et ergonomie | Garder les conteneurs lourds entre hauteur de genou et hauteur d'épaule ; vérifier le levage et l'atteinte selon les recommandations ergonomiques de l'OSHA [28] | Les manutentionnaires répètent ces gestes des centaines de fois par poste |

### Files FIFO : dimensionner la file d'attente

Une file FIFO est une file d'attente à quantité maximale entre deux processus. Lorsqu'elle est pleine, le processus fournisseur s'arrête ; lorsqu'elle est vide, le consommateur attend. Contrairement à un supermarché, elle ne porte pas de stock par référence, seulement une séquence de travaux.

**Exemple de dimensionnement.** Une ligne de peinture prend des travaux d'une cellule de soudage. Le soudage produit environ un travail toutes les 10 minutes ; la peinture consomme au même rythme moyen mais s'arrête pour des changements de couleur de 90 minutes, deux fois par poste. La file FIFO doit absorber la production de soudage pendant un changement de couleur : 90 ÷ 10 = 9 travaux. Avec une marge de 3, la file contient 12 travaux. Selon la loi de Little, un travail attend au plus environ 12 × 10 = 120 minutes dans la file [6].

Si la file est souvent pleine, la peinture est la contrainte ou le changement de couleur est trop long. Si elle est souvent vide, c'est le soudage qui pose problème. Dans les deux cas, la file rend le problème visible. C'est précisément son rôle.

### Le pacemaker : un seul point de planification

Dans un système tiré, un seul processus reçoit un programme de production : le pacemaker. Il s'agit en général de l'assemblage final ou du dernier processus en flux continu avant l'expédition. Tout ce qui se situe en amont suit les signaux kanban ; tout ce qui se situe en aval circule en FIFO. La planification du pacemaker est le point de rencontre entre ce sujet et le [guide de planification de la production et d'APS](https://www.m365.fm/en/learn/production-scheduling-aps/) : l'APS ou le planificateur décide de ce que le pacemaker fabrique et dans quel ordre, les boucles kanban décident de ce que le reste de l'usine réapprovisionne.

### Le circuit du manutentionnaire

Les supermarchés ont besoin d'une personne qui déplace les cartes et les conteneurs selon un cycle fixe. Ce rôle est souvent appelé water spider ou mizusumashi. Le circuit est calé sur le pitch (voir ci-dessous) : à chaque intervalle de pitch, le manutentionnaire prend la prochaine instruction de production dans le coffret heijunka, la livre, collecte les conteneurs vides et les kanbans de prélèvement, et apporte les conteneurs pleins à la ligne. Un circuit fixe fait de l'intervalle de collecte de la formule de dimensionnement une valeur connue plutôt qu'une estimation. Chronométrez le circuit avec le manutentionnaire et prévoyez une marge pour les retards et les pauses ; un circuit qui ne tient jamais dans le pitch est une surcharge (muri), et il sera abandonné précisément quand la ligne est la plus sollicitée. Pour les circuits internes à l'usine et les milk runs, voir le [guide de logistique interne](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

## Heijunka : niveler le programme dont dépend le kanban

Le kanban réagit à la consommation. Si le pacemaker fabrique 300 unités du modèle A le lundi et aucune le mardi, chaque boucle amont du modèle A voit un pic, puis rien. Les boucles doivent alors être dimensionnées pour le pic, et les stocks augmentent. Niveler le programme du pacemaker évite cela.

Le Lean Enterprise Institute définit le heijunka comme « le nivellement du type et de la quantité de production sur une période fixe » [18]. Ses deux exemples constituent la référence standard :

- **Nivellement des volumes :** un producteur reçoit 500 commandes par semaine, allant de 200 le lundi à 50 le mercredi et le vendredi ; il conserve un petit stock de produits finis près de l'expédition et produit régulièrement 100 unités par jour [18].
- **Nivellement des mix :** avec une demande hebdomadaire de 5 A, 3 B, 2 C et 2 D, un producteur de masse fabrique tous les A, puis tous les B ; un producteur lean entrelace les modèles dans une séquence répétitive [18].

Le LEI énumère les avantages : délais de livraison plus courts, consommation plus régulière des pièces, ce qui allège la pression sur les fournisseurs, séries plus petites qui limitent la propagation d'un défaut, et charge de travail plus homogène pour les opérateurs [18].

### Pitch : l'unité de temps d'un système tiré

Le LEI définit le pitch comme « le temps nécessaire dans une zone de production pour fabriquer un conteneur de produits », calculé comme temps takt × quantité de conditionnement ; avec un takt d'une minute et 20 pièces par conteneur, le pitch est de 20 minutes [19].

### Exemple détaillé : un coffret heijunka pour la ligne de supports

Reprenons la ligne en deux équipes de la section dimensionnement : takt 0,9375 minute, conteneurs de 40 pièces.

- Pitch = 0,9375 × 40 = 37,5 minutes
- Créneaux par jour = 900 ÷ 37,5 = 24 (12 par équipe)
- Demande quotidienne 960 pièces = 24 conteneurs

La ligne fabrique quatre modèles dont la demande quotidienne est de A = 480, B = 240, C = 160 et D = 80 pièces, soit 12, 6, 4 et 2 conteneurs par jour, ou 6, 3, 2 et 1 par équipe.

Un programme par lots, par équipe, donnerait A A A A A A B B B C C D. Un programme nivelé répartit chaque modèle sur toute l'équipe :

| Créneau (toutes les 37,5 min) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modèle | A | B | A | C | A | B | A | C | A | B | A | D |

Vérification du décompte : A apparaît 6 fois, B 3 fois, C 2 fois, D 1 fois. Dans le coffret heijunka, chaque créneau contient le kanban de production d'un conteneur. Le manutentionnaire prend un kanban toutes les 37,5 minutes. Si un kanban est encore dans le coffret au début du créneau suivant, la ligne est en retard, et chacun peut voir de combien.

La séquence nivelée implique 11 changements de modèle par équipe au lieu de 3. Cela n'est économique que si les changements au niveau du pacemaker prennent quelques secondes ou quelques minutes, ce qui explique concrètement pourquoi le SMED précède le nivellement des mix. Le [guide de la fabrication lean](https://www.m365.fm/en/learn/lean-manufacturing/) donne la séquence générale : stabilité avant flux, flux avant tirage, tirage avant nivellement. En pratique, le nivellement des volumes au niveau du pacemaker démarre souvent en même temps que les premières boucles kanban, et le nivellement fin des mix suit lorsque les changements le permettent.

### Ce qui se passe en amont lorsque vous lissez

Comparez les crochets du modèle D. Avec le calendrier par lots, les 40 pièces de D sont consommées en un seul bloc de 37,5 minutes en fin de poste, et la boucle doit couvrir une demande de 80 par jour en deux rafales maximum. Avec le calendrier lissé, la consommation reste de 80 par jour, mais répartie sur la journée. La demande de pointe pendant le délai de réapprovisionnement baisse, tout comme la marge de sécurité nécessaire. Sur des dizaines de références, cette différence est souvent plus importante que toute optimisation du nombre de cartes.

## Au-delà du kanban : CONWIP, POLCA et drum-buffer-rope

Les boucles kanban spécifiques à chaque référence fonctionnent lorsque chaque référence a une demande régulière. Lorsqu'une ligne fabrique des centaines de variantes, un supermarché pour chacune immobiliserait plus de stock que l'usine n'en avait auparavant. Trois alternatives maintiennent le plafond d'en-cours sans stocker chaque référence.

### CONWIP : un plafond d'en-cours unique pour toute la ligne

CONWIP signifie constant work in process (travail en cours constant). Spearman, Woodruff et Hopp l'ont décrit en 1990 dans l'*International Journal of Production Research* comme « un nouveau système de production en flux tiré », appuyé sur des arguments théoriques et des études de simulation [3]. Le mécanisme : aucune pièce ne peut entrer dans la ligne sans carte ; lorsqu'une pièce terminée quitte la dernière station, sa carte retourne à la première station et autorise la pièce suivante [5]. À l'intérieur de la ligne, les pièces circulent dans l'ordre FIFO, comme sur une ligne en flux poussé.

La comparaison faite dans l'article Wikipedia consacré à CONWIP est utile : le kanban maintient un contrôle plus serré des en-cours grâce à des cartes individuelles à chaque poste, tandis que CONWIP est plus facile à mettre en œuvre et à ajuster, car un seul jeu de cartes gère l'en-cours du système [5]. En 2022, les mêmes trois auteurs ont publié « CONWIP Redux », un bilan de 30 ans de développement qui répond aux malentendus courants [4].

**Exemple détaillé : fixer le niveau CONWIP.** Une ligne de cinq stations a un rythme de goulot de 60 unités par heure. Le temps de traitement brut d'une unité à travers les cinq stations, sans aucune attente, est de 25 minutes (0,417 heure). Selon la loi de Little, l'en-cours nécessaire pour maintenir le goulot occupé en l'absence totale de variabilité est de 60 × 0,417 = 25 unités [6]. Les lignes réelles connaissent une variabilité ; l'usine démarre donc avec 35 cartes et surveille le débit.

Si le débit se maintient autour de 60 par heure, délai moyen = 35 ÷ 60 = 0,58 heure, soit environ 35 minutes. L'équipe retire ensuite les cartes par paliers de deux. Si le débit passe sous le rythme du goulot à 29 cartes, elle revient à 31. Comparez avec une ligne non plafonnée qui détient 150 unités : même production, délai de 150 ÷ 60 = 2,5 heures.

### POLCA : le flux tiré pour les ateliers à forte variété et faibles volumes

POLCA signifie paired-cell overlapping loops of cards with authorization (boucles de cartes à cellules jumelées se chevauchant, avec autorisation) [21]. Rajan Suri l'a conçu dans le cadre de ses travaux au Center for Quick Response Manufacturing de l'University of Wisconsin–Madison [21]. Son *Practitioner's Guide to POLCA* le décrit comme « un système de contrôle visuel par cartes qui gère le flux des travaux dans l'atelier », « particulièrement adapté aux entreprises fabriquant des produits à forte variété, en faibles volumes et personnalisés », et souligne que le kanban « ne fonctionne pas bien avec la production à faible volume ou sur mesure » [20].

Le mécanisme en bref : chaque paire de cellules qui se transmettent du travail partage une boucle de cartes (par exemple « Fraisage–Soudage »). Un travail ne peut démarrer dans la cellule de fraisage que lorsque sa date de lancement est arrivée et qu'une carte Fraisage–Soudage est libre, ce qui signale que le soudage a la capacité de le recevoir. Lorsque le soudage termine le travail, la carte revient au fraisage. Parce que les boucles se chevauchent, chaque cellule est couverte par les cartes de ses paires amont et aval. POLCA combine les dates de lancement planifiées issues de l'ERP avec un signal de capacité venant de l'atelier.

### Drum-buffer-rope : le flux tiré par la contrainte

Le drum-buffer-rope (DBR) est la méthode de pilotage de la production de la théorie des contraintes, associée à Eliyahu Goldratt (sources dans le guide de la théorie des contraintes cité ci-dessous). La contrainte (le tambour) fixe le rythme ; un buffer temporel la protège des perturbations amont ; la corde relie la libération des matières à la consommation du tambour. Le DBR ne plafonne l'en-cours que devant la contrainte, ce qui en fait un système tiré au sens de Hopp et Spearman [2]. Le guide de Veryable présente CONWIP et DBR comme les deux principales alternatives au kanban [24]. Le DBR est expliqué en détail dans le [guide de la théorie des contraintes](https://www.m365.fm/en/learn/theory-of-constraints/).

### Tableau de décision : quel système de tirage convient ?

| Critère | Kanban (supermarché) | CONWIP | POLCA | Drum-buffer-rope |
|---|---|---|---|---|
| Gamme de produits | Faible à moyenne, références répétitives | Moyenne à élevée, gamme commune | Gamme élevée, sur mesure, nombreux gammes | Quelconque, avec une contrainte claire |
| Demande par référence | Régulière | Irrégulière acceptable | Irrégulière acceptable | Irrégulière acceptable |
| Stocke les produits finis | Oui, en supermarchés | Non (fabrication sur commande possible) | Non | Non ; tampon temporel avant la contrainte |
| Maîtrise des en-cours | Par boucle, par référence | Ligne entière | Entre chaque paire de cellules | Avant la contrainte |
| Nécessite des dates de lancement de la planification | Non pour les références courantes | Oui, une séquence de backlog | Oui, dates de lancement | Oui, planning de la contrainte |
| Facilité de mise en place | Moyenne (nombreuses boucles à dimensionner) | Facile (un seul nombre par ligne) | Moyenne (boucles par paire de cellules) | Moyenne (la contrainte doit être stable) |
| Défaillance typique | Supermarchés pour des références occasionnelles | Mauvaise séquence dans le backlog | Trop de boucles, confusion des cartes | La contrainte se déplace avec la gamme |

La plupart des usines combinent ces systèmes : kanban pour les références courantes et les composants standards achetés, CONWIP ou POLCA pour les variantes en fabrication sur commande, et DBR lorsqu'une ressource limite clairement la production.

## E-kanban et interaction avec l'ERP/MRP

### Qu'est-ce que l'e-kanban

Le kanban électronique remplace les cartes physiques par des signaux électroniques. Wikipedia indique que cela permet d'éliminer des problèmes courants tels que les erreurs de saisie manuelle et les cartes perdues [10]. Le LEI souligne que les kanbans fournisseurs pour les fournisseurs éloignés « ont généralement pris une forme électronique » [1]. La logique ne change pas : un nombre fixe de signaux de tirage par boucle, déclenchés par la consommation.

**Fonctionnement type d'une boucle e-kanban :**

1. Chaque conteneur porte une étiquette avec un code-barres, un QR code ou une puce RFID qui identifie le kanban (référence, boucle, numéro de carte).
2. Lorsqu'un conteneur est vidé, l'opérateur ou le manutentionnaire le scanne, ou un capteur détecte l'emplacement vide (balance, barrière photoélectrique, portique RFID).
3. L'ERP ou une application kanban dédiée passe le statut de ce kanban à « vide » et crée un signal de réapprovisionnement : un ordre de fabrication ou un travail pour un fournisseur interne, ou un appel sur un bon de commande-cadre pour un fournisseur externe.
4. Le processus fournisseur voit le signal dans sa file d'attente, sur un écran (un tableau kanban numérique à la cellule) ou sous forme de carte imprimée.
5. Lorsque le conteneur plein est reçu et scanné à son emplacement de stockage, le kanban repasse à « plein ».

### Physique ou électronique : quand passer au numérique

| Facteur | Garder les cartes physiques | Passer à l'e-kanban |
|---|---|---|
| Distance fournisseur-consommateur | Même bâtiment, quelques dizaines de mètres | Autre site, fournisseur externe, autre pays |
| Nombre de boucles | Dizaines | Centaines ou milliers |
| Taux de perte de cartes | Faible, les cartes sont faciles à contrôler | Pertes de cartes récurrentes, ruptures imputées aux cartes |
| Besoin de données | Le contrôle visuel suffit | Besoin de délais de réapprovisionnement, de performances des boucles, d'historique de la demande |
| Maturité | L'équipe apprend encore les règles | Les règles sont stables et respectées |
| Environnement IT/OT | Pas de scan ni de réseau fiable sur le terrain | Scanners, réseau et module kanban de l'ERP disponibles |

Une erreur fréquente consiste à commencer directement par l'e-kanban. L'écran masque ce qu'une rangée de cartes montre : qui détient des cartes, quelle boucle déborde, quelle règle est enfreinte. Notre recommandation : faire tourner une boucle sur papier jusqu'à ce que les règles tiennent, puis numériser.

### Comment les systèmes ERP gèrent le kanban

Les grands ERP intègrent des fonctions kanban. Deux exemples publiés montrent à quel point leurs calculs diffèrent.

- **Microsoft Dynamics 365 Supply Chain Management** calcule la quantité kanban à partir d'une politique de calcul de la quantité kanban utilisant la demande moyenne sur une période de demande définie, le délai d'approvisionnement, un facteur de sécurité et, éventuellement, un stock de sécurité dérivé d'un taux de service ; à un taux de service de 90 %, il utilise z = 1,29 [15]. Il distingue les règles kanban à quantité fixe, les kanbans à usage unique et les kanbans événementiels [15]. Les cartes en circulation sont imprimées une seule fois puis circulent entre le point d'origine et le point de consommation, souvent plusieurs fois par jour [15].
- **Oracle JD Edwards** propose plusieurs équations kanban, par exemple « taille de conteneur fixe et forte demande », où la taille du kanban égale la forte demande quotidienne × (délai de livraison en jours + jours de delta de scan) + stock de sécurité, et le nombre de cartes égale la taille du kanban divisée par la taille du conteneur [16]. La forte demande quotidienne est prise sur la demande de période la plus élevée dans la fenêtre MRP, ajustée selon les répartitions par fournisseur et par emplacement [16].

Avant de faire confiance aux nombres de cartes suggérés par l'ERP, vérifiez trois points : quelle demande il utilise (moyenne ou pic, passée ou future), s'il ajoute une carte pour le conteneur en cours d'utilisation, et comment il gère les tailles de lot au niveau du processus fournisseur. Ces choix expliquent la plupart des écarts entre le chiffre de l'ERP et l'expérience de l'atelier.

### MRP et kanban : qui fait quoi

Le MRP (planification des besoins en composants) éclate un programme directeur via la nomenclature et crée des ordres planifiés par date. Le kanban ne remplace que la dernière étape pour les pièces pilotées par kanban : le lancement des ordres individuels. Une répartition des tâches opérationnelle :

| Tâche | MRP / ERP | Boucle kanban |
|---|---|---|
| Planification de la capacité et des matières à long terme | Oui : S&OP, programme directeur, capacité approximative | Non |
| Contrats fournisseurs, commandes-cadres, prévisions transmises aux fournisseurs | Oui : partager les quantités prévisionnelles pour la planification de capacité | Non |
| Pièces à long délai et hors kanban | Oui : ordres planifiés | Non |
| Lancement quotidien des pièces kanban | Non : supprimer les ordres planifiés pour ces pièces | Oui : signal de consommation |
| Transactions de stock | Oui : entrées, sorties, souvent déclaration par débit automatique | Génère les transactions (scan) |
| Dimensionnement des boucles | Calcule des suggestions à partir de la demande | L'atelier valide et ajuste |
| Calcul de coûts et valorisation | Oui | Non |

Deux points techniques sont importants :

- **Éviter la double planification.** Si le MRP continue de créer des ordres planifiés pour une pièce également gérée en kanban, les acheteurs et les ordonnanceurs reçoivent deux signaux contradictoires. La plupart des ERP permettent de marquer une pièce comme pilotée par kanban afin que le MRP ne la planifie qu'à des fins de capacité et de prévision. Les paramétrages varient selon le système ; consultez la documentation de votre ERP.
- **Le débit automatique exige des nomenclatures exactes.** Lorsque le système déduit automatiquement les composants à un point de déclaration, des quantités erronées dans la nomenclature apparaissent sous forme de ruptures fantômes dans la boucle kanban. Corrigez la nomenclature, pas le nombre de cartes.

Le MRP et le S&OP sont traités en détail dans le [guide S&OP, MRP et planification de production](https://www.m365.fm/en/learn/sop-mrp-production-planning/), et la politique de stock, y compris le calcul du stock de sécurité, dans le [guide de gestion des stocks industriels](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

### Place du e-kanban dans l'architecture IT/OT

Le e-kanban touche plusieurs couches de systèmes : l'ERP (planification, achats, valorisation des stocks), le MES ou l'application d'atelier (signaux de production, confirmations), les scanners et capteurs sur le terrain, ainsi que les portails fournisseurs ou les liaisons EDI avec les fournisseurs externes. Le modèle ISA-95 d'intégration des systèmes d'entreprise et de contrôle est un moyen utile de décider quel système est responsable de quelles données kanban ; voir le [guide MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/). Deux règles pratiques :

- **Un seul système gère les données de référence du kanban** (boucles, nombres de cartes, quantités par conteneur). Les doublons dans Excel, le MES et l'ERP divergent en quelques semaines.
- **Se prémunir contre les signaux en double.** Un conteneur scanné deux fois, ou un capteur qui clignote, crée deux signaux de réapprovisionnement pour un même conteneur vide. N'autorisez qu'un seul signal ouvert par identifiant kanban et journalisez chaque changement d'état.
- **Prévoir les pannes.** Si le réseau ou l'application kanban tombe en panne, l'atelier a besoin de cartes imprimées ou d'une solution de secours papier pour chaque boucle. Tout dispositif de scan et toute connexion fournisseur font aussi partie de la surface d'attaque de l'usine ; le [guide de cybersécurité OT](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explique comment segmenter et sécuriser ces liaisons. Pour les options d'intégration dans le cloud, voir le [guide Azure pour l'industrie](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Simuler les boucles avant de les construire

Pour les usines comptant de nombreuses boucles ou une forte variation de la demande, une simulation à événements discrets peut tester les nombres de cartes, les tailles de supermarchés et les intervalles de tournée à partir de la demande historique, avant tout changement sur le terrain. Le [guide de simulation industrielle](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explique comment ces modèles sont construits. Les logiciels de cartographie de flux de valeur peuvent aider à garder cohérentes, d'un site à l'autre, les cartes de l'état futur avec supermarchés et boucles kanban ; le [guide iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) décrit un de ces outils et ses limites. **Remarque : l'auteur travaille chez iFAKT GmbH.**

## Modèles : carte, feuille de dimensionnement, checklist de supermarché, audit

Copiez ces tableaux dans un tableur ou dans votre documentation d'atelier. Ils sont volontairement simples : un système kanban doit pouvoir fonctionner avec une imprimante et une plastifieuse avant de nécessiter un logiciel.

### Modèle 1 : mise en page de la carte kanban

| Champ | Exemple | Remarques |
|---|---|---|
| Référence et désignation de la pièce | B-200, équerre gauche | Police de grande taille ; lisible à 6 pieds (environ 2 m) |
| Type de kanban | Kanban de production | Code couleur par type (par exemple blanc = production, jaune = prélèvement, rouge = urgence) |
| Numéro de carte | 3 sur 9 | Indique la taille de la boucle ; révèle les cartes perdues |
| Quantité par conteneur | 40 pièces | N'écrivez jamais « env. » |
| Type de conteneur | Bac bleu 600 × 400 mm | Correspond à l'emplacement en rack |
| Processus ou fournisseur amont | Cellule W2 (emboutissage et soudage) | Pour un kanban fournisseur : nom et identifiant du fournisseur |
| Adresse de stockage (supermarché) | SM-W2, rack 3, niveau B, emplacement 07 | Emplacement où revient le conteneur plein [1] |
| Adresse du processus consommateur | Ligne 1, poste 14, rack gauche | Point d'utilisation [1] |
| Code-barres ou QR code | Identifiant de boucle + numéro de carte | Pour le e-kanban ou les scans d'audit |
| Révision et date | Rév. 4, nov. 2026 | Modifié lorsque la boucle est redimensionnée |

### Modèle 2 : feuille de dimensionnement des boucles

| Ligne | Donnée | Unité | Exemple (équerre B-200) |
|---|---|---|---|
| 1 | Demande quotidienne moyenne | pièces/jour | 960 |
| 2 | Temps disponible par jour | minutes | 900 |
| 3 | Takt (ligne 2 ÷ ligne 1) | minutes/pièce | 0,9375 |
| 4 | Quantité par conteneur | pièces | 40 |
| 5 | Intervalle de collecte des cartes | minutes | 60 |
| 6 | File d'attente au processus amont | minutes | 90 |
| 7 | Changement de série par lot (si non compris dans la file) | minutes | 0 |
| 8 | Temps de traitement par conteneur | minutes | 20 |
| 9 | Transport et mise en place | minutes | 15 |
| 10 | Temps de réapprovisionnement (lignes 5 à 9) | minutes | 185 |
| 11 | Kanbans pour le temps de réapprovisionnement (ligne 10 ÷ ligne 3 ÷ ligne 4) | kanbans | 4,93 |
| 12 | Taille de lot au processus amont | conteneurs | 4 |
| 13 | Kanbans supplémentaires pour la constitution de lot (ligne 12 – 1) | kanbans | 3 |
| 14 | Marge de sécurité (10 % de la ligne 11) | kanbans | 0,49 |
| 15 | Total (lignes 11 + 13 + 14), arrondi au supérieur | kanbans | 9 |
| 16 | Stock maximal de la boucle (ligne 15 × ligne 4) | pièces | 360 |
| 17 | Couverture en jours (ligne 16 ÷ ligne 1) | jours | 0,375 |
| 18 | Prochaine date de revue | date | mensuelle |

### Modèle 3 : checklist de conception du supermarché

| # | Contrôle | Oui / Non |
|---|---|---|
| 1 | Chaque référence du supermarché répond aux critères de « runner » (demande régulière, faible variation) | |
| 2 | Chaque référence possède exactement une adresse fixe | |
| 3 | La capacité du rack est égale à la taille maximale de boucle par référence, sans emplacement supplémentaire | |
| 4 | Les racks se chargent par l'arrière et se prélèvent par l'avant | |
| 5 | Les positions des kanbans de signal ou les repères min/max sont visibles | |
| 6 | Poids des conteneurs et hauteurs de manutention vérifiés au regard des recommandations ergonomiques [28] | |
| 7 | Les allées permettent un accès sûr aux chariots ou tracteurs, séparées des zones de circulation piétonne | |
| 8 | Un poste kanban chez le consommateur et au processus amont | |
| 9 | Le parcours du manutentionnaire et l'intervalle de collecte sont écrits et chronométrés | |
| 10 | Le circuit de retour des conteneurs vides est défini | |
| 11 | Un responsable et un suppléant sont désignés pour le supermarché | |
| 12 | La procédure et la couleur du kanban d'urgence sont définies | |

### Modèle 4 : audit kanban hebdomadaire

| Contrôle | Méthode | Objectif | Action en cas d'écart |
|---|---|---|---|
| Nombre de cartes par boucle | Compter les cartes aux postes, chez le fournisseur, sur les conteneurs pleins et à la ligne | Égal à la liste maîtresse | Rechercher ; si perdue, remplacer et consigner la cause |
| Conteneurs non identifiés | Parcourir le supermarché et la ligne | Zéro | Identifier ou retirer ; trouver qui les a créés |
| Débordement du supermarché | Conteneurs hors emplacements fixes | Zéro | Arrêter la surproduction ; vérifier la règle 3 |
| Ruptures de stock | Arrêts de ligne ou manques dus à des boucles vides | Zéro, suivre le nombre | Cause racine : carte, dimensionnement, fournisseur, qualité |
| Kanbans d'urgence utilisés | Compter les cartes rouges | Zéro après rétablissement | Retirer ; analyser le déclencheur |
| Temps de réapprovisionnement | Horodatages ou échantillon de 10 cartes | Dans la valeur utilisée pour le dimensionnement | Redimensionner la boucle ou corriger le retard |
| Pièces défectueuses dans les conteneurs | Contrôle par échantillonnage au point d'utilisation | Zéro | Confinement qualité à la source |

### Modèle 5 : règles kanban pour le tableau d'atelier

| # | Règle | Qui |
|---|---|---|
| 1 | Nous prenons les pièces uniquement à notre propre adresse de point d'utilisation | Opérateurs |
| 2 | Lorsqu'un conteneur est vide, sa carte est immédiatement déposée dans la boîte kanban | Opérateurs |
| 3 | Nous ne fabriquons que ce que les kanbans de production autorisent, dans leur séquence | Cellule fournisseuse |
| 4 | Un conteneur plein porte toujours sa carte | Tout le monde |
| 5 | Les pièces défectueuses ne vont jamais dans un conteneur ; nous arrêtons et nous appelons | Tout le monde |
| 6 | Les cartes ne sont ajoutées ou retirées que par le responsable de la boucle, avec une date | Responsable matières |
| 7 | Les cartes d'urgence rouges retournent au responsable de la boucle après utilisation | Responsable matières |
| 8 | Si le système et le rack ne concordent pas, nous faisons confiance au rack et nous signalons l'écart | Tout le monde |

## Comment mettre en œuvre le kanban en fabrication : une feuille de route sur 26 semaines

La mise en place d'un système en flux tiré commence par un processus de fabrication stable, et non par les cartes. La feuille de route ci-dessous est une séquence type pour une chaîne de valeur et son équipe de fabrication dans une usine de taille moyenne. Les durées sont des hypothèses de planification, non des repères ; les usines ayant déjà une expérience du lean avancent plus vite, celles dont les processus sont instables plus lentement.

| Phase | Semaines | Objectif | Activités principales | Critères de sortie |
|---|---|---|---|---|
| 0. Sélectionner et établir la référence | 1–2 | Choisir le pilote, mesurer la situation actuelle | Choisir une famille de produits ; cartographie de l'état actuel ; mesurer le WIP, le délai de traversée, les ruptures et la valeur des stocks | KPI de référence validés par les opérations et la finance |
| 1. Stabiliser | 3–6 | Rendre le processus capable du flux tiré | 5S au niveau de l'approvisionnement et du point d'utilisation ; corriger les principales causes d'arrêt ; réduire les changements de série au processus fournisseur ; définir les conteneurs | Le processus fournisseur atteint sa production planifiée 9 jours sur 10 |
| 2. Concevoir | 7–10 | État futur et conception des boucles | Segmenter les pièces (runners, repeaters, strangers) ; choisir les types de boucles ; dimensionner les boucles avec la feuille de calcul ; concevoir le supermarché et la tournée | Liste des boucles avec nombre de cartes, adresses, responsables |
| 3. Pilote | 11–14 | Faire tourner 5 à 15 boucles | Imprimer les cartes, former opérateurs et manutentionnaires, démarrer les boucles ; revue quotidienne au tableau ; ajuster les dimensionnements | Deux semaines sans rupture causée par la conception des boucles |
| 4. Étendre | 15–22 | Couvrir la chaîne de valeur | Ajouter les runners restants ; premiers kanbans fournisseurs ; relier le planning pacemaker ; lisser le mix | 80 % des références runner en kanban ; ordres planifiés MRP supprimés pour elles |
| 5. Améliorer et digitaliser | 23–26 et en continu | Réduire le WIP, ajouter des données | Retirer les cartes une à une ; réduire les tailles de lot ; e-kanban pour les fournisseurs éloignés ; redimensionnement mensuel | Réductions de cartes documentées ; e-kanban pour les boucles retenues |

### Prérequis à ne pas sauter

| Prérequis | Pourquoi le kanban en a besoin | Pour en savoir plus |
|---|---|---|
| Processus fournisseurs stables et capables | Une boucle dimensionnée pour 0,25 jour échoue si la machine est en panne pendant une demi-journée | [Guide TPM et OEE](https://www.m365.fm/en/learn/tpm-oee/) |
| Changements de série courts | La taille du lot détermine le nombre de cartes (exemple 2) | [Guide SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) |
| Organisation de l'espace de travail | Adresses fixes, racks clairs, statut visible | [Guide 5S et gestion visuelle](https://www.m365.fm/en/learn/5s-visual-management/) |
| Travail standard pour manutentionnaires et opérateurs | Les intervalles de tournée et la gestion des cartes doivent être reproductibles | [Guide du travail standard](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) |
| Planning pacemaker lissé | Une demande non lissée gonfle les boucles | Section Heijunka ci-dessus |
| Données fiables | Quantités par conteneur, nomenclatures et historique de la demande | [Guide des KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) |

### Choisir les boucles pilotes

Les premières bonnes boucles partagent cinq caractéristiques : une demande quotidienne, un processus fournisseur à proximité, des changements de série inférieurs à environ 15 minutes, une pièce ayant causé des ruptures ou des surstocks visibles, et un chef d'équipe qui veut essayer. Évitez, pour la première boucle, la pièce du goulot le plus critique de l'usine ; une erreur de conception à cet endroit arrête toute la ligne.

### Impliquer les opérateurs, les manutentionnaires et leurs représentants

Un système kanban modifie le travail quotidien des opérateurs et des manutentionnaires. Leur adhésion détermine si les règles tiendront.

- **Expliquer l'objectif avant les règles.** Les personnes qui constatent les ruptures de stock et les racks saturés comprennent généralement assez vite à quoi sert un plafond d'en-cours (WIP). Celles à qui l'on demande de « suivre la carte » sans contexte, en revanche, ne le comprennent pas.
- **Laisser les opérateurs définir les positions des conteneurs et la hauteur des racks.** Ils savent où l'effort d'atteinte et de levage est pénible. Utilisez les ressources ergonomiques de l'OSHA comme référence pour la revue [28].
- **Convenir de ce qu'il advient du temps et de la main-d'œuvre libérés.** Si la manutention des stocks diminue, les gens s'inquiètent pour leurs emplois. Précisez-le tôt, et par écrit si une convention collective s'applique, quant à l'usage de la capacité libérée. Le [guide de la fabrication allégée](https://www.m365.fm/en/learn/lean-manufacturing/) aborde le contexte du travail aux États-Unis, notamment les comités de participation des salariés au titre du NLRA.
- **Rendre la règle d'arrêt sûre.** La règle 5 (aucun défaut en aval) ne fonctionne que si l'arrêt de la ligne et l'appel à l'aide ne sont jamais sanctionnés.
- **Utiliser le tableau quotidien.** Les problèmes de boucle relèvent de la réunion quotidienne à plusieurs niveaux ; voir le [guide de gestion de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/).

### Obtenir un appui extérieur

Les fabricants américains, en particulier les petites et moyennes entreprises, peuvent demander à leur centre local du NIST Manufacturing Extension Partnership (MEP) un accompagnement en fabrication allégée et en amélioration des processus ; le NIST MEP inscrit l'amélioration des processus et la fabrication allégée parmi ses services [27]. Les méthodes d'amélioration continue qui permettent de faire progresser les boucles sont décrites dans le [guide kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

## Indicateurs Kanban et vision financière

### Indicateurs opérationnels

| Indicateur | Formule | Exemple | Sens visé |
|---|---|---|---|
| Stock de boucle (max) | Kanbans × quantité par conteneur | 9 × 40 = 360 pièces | À la baisse dans le temps |
| Jours de couverture | Stock maximal de boucle ÷ demande quotidienne moyenne | 360 ÷ 960 = 0,375 jour | À la baisse, dans les limites de sécurité |
| Ruptures de stock par semaine | Nombre d'arrêts de ligne ou de pénuries causés par une boucle vide | 2 | Zéro |
| Exactitude des cartes | Cartes trouvées lors de l'audit ÷ cartes figurant sur la liste de référence | 87 ÷ 90 = 96,7 % | 100 % |
| Respect du délai de réapprovisionnement | Kanbans réapprovisionnés dans le délai dimensionné ÷ tous les kanbans | 182 ÷ 200 = 91 % | À la hausse |
| Kanbans d'urgence | Nombre émis par mois | 4 | À la baisse |
| En-cours (chaîne de valeur) | Somme des pièces entre le premier et le dernier processus | 3 200 -> 1 200 | À la baisse |
| Délai de traversée (loi de Little) | En-cours ÷ débit [6] | 1 200 ÷ 400 = 3 jours | À la baisse |
| Rotation des stocks | Coût annuel des marchandises vendues ÷ valeur moyenne des stocks | 24 M$ ÷ 3 M$ = 8 | À la hausse |
| Livraison à l'heure | Commandes expédiées à l'heure ÷ toutes les commandes | 95 % | À la hausse ou stable |
| Kanbans retirés | Cartes retirées après amélioration, par trimestre | 12 | À suivre, pas un quota |

Surveillez les couples d'indicateurs. Une baisse des stocks accompagnée d'une hausse des ruptures signifie que les boucles ont été réduites trop fortement ou que le processus n'est pas assez stable. Une hausse de la livraison à l'heure avec des stocks stables peut signifier que les boucles sont adéquates et que l'amélioration vient du lissage de la charge. Les définitions des indicateurs et les tableaux de bord pour l'ensemble de l'usine sont traités dans le [guide des indicateurs de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/).

### La vision financière : trésorerie, coût de possession et résultat publié

Un contrôleur de gestion d'usine observe trois effets.

**1. Libération de trésorerie ponctuelle.** Supposons que 120 références de pièces courantes passent des points de réapprovisionnement min/max au kanban, et que le stock moyen disponible de chaque boucle baisse de 3 000 $ au coût standard. Cela libère 120 × 3 000 $ = 360 000 $ de fonds de roulement, une seule fois. Ce gain ne se reproduit pas chaque année.

**2. Économies récurrentes sur le coût de possession.** Le coût de possession couvre le coût du capital, le stockage, la manutention, l'assurance, l'obsolescence et la démarque inconnue. Le pourcentage varie fortement selon l'entreprise et le secteur ; utilisez le chiffre de votre propre contrôleur de gestion. Avec une hypothèse illustrative de 20 % par an (une hypothèse pour cet exemple, non une référence), la baisse de 360 000 $ économise environ 72 000 $ par an.

**3. Un effet négatif temporaire sur le résultat publié en coûts complets.** En coûts complets (absorption), les produits finis et les en-cours portent une part des frais fixes de fabrication. Lorsque les stocks baissent, les frais qui avaient été incorporés aux stocks lors des périodes précédentes passent dans le coût des ventes ; le résultat publié peut donc reculer pendant les trimestres où les en-cours et les produits finis diminuent, même si la trésorerie s'améliore. Les rapports internes fondés sur les coûts variables (directs) ne montrent pas ce recul, ce qui est une raison de présenter les deux visions lors de la revue du pilote. Expliquez cet effet à la direction avant le pilote, faute de quoi le premier trimestre en kanban peut sembler un échec. Les matières premières et les pièces achetées ne portent pas de frais absorbés, de sorte que l'effet provient surtout des en-cours et des produits finis.

**Coûts à budgéter.** Conteneurs, racks et étagères à flux (investissement ou charges d'exploitation selon votre seuil de capitalisation), impression et plastification des cartes, temps de formation, éventuellement scanners et licences du module kanban de l'ERP pour le e-kanban (généralement en charges d'exploitation dans un modèle par abonnement), et la tournée du manutentionnaire. Un pilote typique de 10 à 15 boucles représente essentiellement un coût de main-d'œuvre et de conteneurs ; le dimensionnement et les règles ne coûtent rien, seule la rigueur est nécessaire.

**Exemple de dossier d'affaires pour un pilote (tous les chiffres sont illustratifs) :**

| Poste | Montant |
|---|---|
| Conteneurs et racks à flux pour 15 boucles | 18 000 $ |
| Formation : 40 personnes × 4 heures × 45 $ de taux chargé | 7 200 $ |
| Temps d'ingénierie et d'accompagnement, 8 semaines à temps partiel | 20 000 $ |
| **Coût total du pilote** | **45 200 $** |
| Réduction ponctuelle des stocks, 15 boucles × 3 000 $ | 45 000 $ |
| Économie annuelle sur les coûts de possession à un taux supposé de 20 % | 9 000 $ |
| Frais de fret express évités (données propres à l'usine, exemple) | 12 000 $ par an |

Dans cet exemple, le pilote se rembourse à peu près en trésorerie dès la première année. Le cas le plus important est généralement le déploiement sur l'ensemble de la chaîne de valeur et la réduction des délais de livraison qui en découle.

## Erreurs courantes avec le kanban et comment les corriger

| Erreur | Symptôme | Correction |
|---|---|---|
| Kanban avant la stabilité | Ruptures fréquentes parce que la machine qui alimente est en panne ou que le taux de rebut est élevé | Stabiliser d'abord (TPM, qualité à la source) ; dimensionner les boucles sur le délai de réapprovisionnement réel en attendant |
| Supermarchés pour les références peu courantes | Racks remplis de références à faible rotation, stocks élevés malgré le « tirage » | Segmenter les références ; passer à la fabrication sur commande avec CONWIP ou POLCA pour les références peu courantes |
| Dimensionnement sur le temps de cycle machine au lieu du délai de réapprovisionnement | Les boucles manquent toujours de pièces | Mesurer le délai de réapprovisionnement de bout en bout (feuille de calcul, lignes 5 à 10) |
| Ignorer la taille de lot chez le fournisseur | Boucles insuffisantes lorsque le fournisseur produit par lots | Ajouter des kanbans de formation de lot ou réduire la taille de lot avec le SMED |
| Ne jamais recalculer | Boucles trop grandes après une baisse de la demande, trop petites après une hausse | Revue mensuelle ; suggestions de recalcul basées sur l'ERP [15] |
| Cartes supplémentaires non officielles | La boucle grossit, la surproduction revient | Liste maîtresse des cartes, responsable de boucle, cartes d'urgence de couleur retirées après usage |
| Retirer les cartes trop vite | La ligne s'arrête, la confiance se perd | Retirer une carte à la fois, lorsqu'une personne peut résoudre le problème mis en évidence [12] |
| Commandes MRP parallèles planifiées | Les acheteurs commandent deux fois les pièces kanban | Signaler les pièces kanban dans l'ERP ; utiliser le MRP uniquement pour les prévisions et la capacité |
| Pacemaker non lissé | Les boucles amont subissent de fortes variations | Boîte Heijunka avec cadence ; lots plus petits au niveau du pacemaker |
| E-kanban comme raccourci | Les problèmes sont masqués dans un système que personne ne consulte | Faire fonctionner les boucles papier jusqu'à ce que les règles tiennent ; numériser ensuite avec un tableau visuel |
| Absence de responsabilité | Personne ne remarque les cartes perdues | Responsable de boucle nommé et audit hebdomadaire (modèle 4) |
| Fournisseur non impliqué | Le fournisseur manque les signaux ou livre en excès | Accord commun sur la méthode de signalisation, le délai, le conteneur et la quantité ; commencer avec quelques pièces |
| Lots ou révisions mélangés dans un même conteneur | Traçabilité perdue lorsqu'un lot est suspect ou rappelé ; mauvaise révision à la ligne | Un seul lot et une seule révision par conteneur ; numéro de lot ou code date sur l'étiquette ; racks FIFO ; règle de confinement gelant les cartes de la boucle pour le lot suspect |

## Limites : quand le kanban est le mauvais outil

Le kanban convient à une situation précise. Les usines qui appliquent le kanban en dehors de ce cadre rencontrent les problèmes suivants.

**Production à forte variété et faible volume, et production sur mesure.** Le guide de Suri indique clairement que le kanban « ne fonctionne pas bien avec la production à faible volume ou sur mesure » [20]. Une boucle propre à une référence commandée deux fois par an n'est qu'un stock avec une carte posée dessus. CONWIP et POLCA ont été développés pour ces cas [3][20].

**Demande très variable.** La taille de la boucle dépend de la demande pendant le délai de réapprovisionnement, plus la sécurité. Si la demande varie d'un facteur trois d'une semaine à l'autre et ne peut pas être lissée, la boucle doit être dimensionnée pour les pics, et la plupart du temps elle contient trop de stock. Il faut alors soit lisser la demande au niveau du pacemaker, soit recourir à une gestion planifiée (MRP), soit redimensionner les boucles dynamiquement.

**Réapprovisionnement long et peu fiable.** Avec des fournisseurs éloignés et des délais de transport longs, les kanbans fournisseurs immobilisent plusieurs semaines de stock dans la boucle ; le signal arrive trop tard pour réagir aux variations réelles. Dans ce cas, les prévisions et les lancements planifiés issus du MRP, combinés à un stock tampon local, donnent généralement de meilleurs résultats.

**Cycles de vie courts et modifications techniques.** Une boucle pleine de pièces à l'ancienne révision devient du rebut lorsque la conception change. Il faut planifier la sortie : geler la boucle, épuiser les cartes, puis introduire le nouveau numéro de référence avec de nouvelles cartes.

**Risque d'approvisionnement et résilience.** Les systèmes en flux tiré réduisent les stocks qui couvrent les variations normales. Ils ne sont pas conçus pour absorber des perturbations telles qu'un incendie chez un fournisseur ou une pénurie de puces. Toyota, à l'origine du kanban, a mis en place après le séisme de 2011 un plan de continuité d'activité prévoyant que les fournisseurs détiennent de deux à six mois de stock de semi-conducteurs, selon la pièce [26]. Décider quelles pièces doivent faire l'objet d'un stock stratégique hors de la boucle kanban relève d'une décision de risque ; voir le [guide sur la résilience de la chaîne d'approvisionnement](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/).

**Théorie et pratique.** La littérature académique sur le kanban est abondante. Lage Junior et Godinho Filho ont passé en revue 32 variantes du système kanban et constaté un large écart entre le nombre de propositions théoriques et celui des propositions appliquées en pratique [17]. De nombreuses variantes optimisées n'ont jamais été testées en usine. Pour la plupart des praticiens, la boucle classique, dimensionnée honnêtement et avec des règles rigoureuses, constitue le bon point de départ.

**Place du kanban dans les environnements réglementés et les projets.** Dans l'aérospatiale et la défense, les faibles volumes, les délais d'approvisionnement longs et les exigences de traçabilité limitent le kanban classique aux matériels standard, aux consommables et aux sous-ensembles répétitifs ; voir le [guide de planification de la production aérospatiale](https://www.m365.fm/en/learn/aerospace-production-planning/). Dans les industries de process, les kanbans de signal sur cuves ou silos peuvent fonctionner lorsque les tailles de lots sont importantes et les changements de série longs.

## Glossaire Kanban

| Terme | Définition |
|---|---|
| Quantité par conteneur (quantité de conditionnement) | Nombre fixe de pièces par kanban ; l'unité de la boucle |
| CONWIP | Constant work in process (en-cours constant) ; système en flux tiré avec un seul jeu de cartes pour une ligne complète [3][5] |
| Drum-buffer-rope (DBR) | Méthode de pilotage issue de la théorie des contraintes : la contrainte fixe le rythme, un tampon temporel la protège, la mise en production y est liée |
| E-kanban | Signal kanban électronique, déclenché par scan ou capteur [10] |
| Kanban d'urgence | Carte supplémentaire temporaire pour récupérer d'une rupture ; retirée après utilisation |
| Voie FIFO | File d'attente avec une quantité maximale entre deux processus, premier entré, premier sorti |
| Heijunka | Lissage du type et de la quantité de production sur une période fixe [18] |
| Heijunka box | Planning visuel avec les types de produits sur un axe et les créneaux temporels (pitch) sur l'autre [18] |
| Just-in-time (JIT) | Ne fabriquer que ce qui est nécessaire, au moment où il est nécessaire, dans la quantité nécessaire [8] |
| Kanban | Dispositif de signalisation qui autorise la production ou le prélèvement dans un système en flux tiré ; japonais pour « signal » ou « panneau » [1] |
| Poste kanban | Boîte ou casier où les kanbans sont collectés pour enlèvement |
| Loi de Little | En-cours moyen = débit × délai moyen de traversée [6] |
| Boucle | Une relation fournisseur-client pour une référence avec son jeu de kanbans |
| Pacemaker | Le processus unique qui reçoit le programme de production |
| Pitch | Temps de fabrication d'un conteneur : takt time × quantité de conditionnement [19] |
| POLCA | Paired-cell overlapping loops of cards with authorization (boucles de cartes à chevauchement entre cellules appariées avec autorisation) ; flux tiré pour ateliers à forte variété et faibles volumes [20][21] |
| Kanban de production | Carte qui autorise un processus à fabriquer un type et une quantité [1] |
| Système en flux tiré | Système de production qui limite explicitement l'en-cours [2] |
| Système en flux poussé | Système qui lance le travail selon un planning, sans plafond d'en-cours |
| Délai de réapprovisionnement | Temps écoulé entre la vidange d'un conteneur (libération de sa carte) et le retour du conteneur plein à son point de stockage |
| Runners, repeaters, strangers | Segmentation des références selon la régularité de la demande, utilisée pour choisir entre kanban et fabrication sur commande |
| Facteur de sécurité | Pourcentage ajouté à la demande pendant le réapprovisionnement pour couvrir la variabilité |
| Kanban de signal (kanban triangle) | Carte qui déclenche un lot lorsque le stock atteint un point de déclenchement [1] |
| Supermarché | Point de stock maîtrisé avec adresses fixes et quantités maximales, dans lequel le processus aval prélève |
| Kanban fournisseur | Kanban de prélèvement vers un fournisseur externe, souvent électronique [1] |
| Takt time | Temps disponible divisé par la demande client |
| Système deux bacs | Deux conteneurs par référence ; un bac vide est le signal de réapprovisionnement [10] |
| Mizusumashi (water spider) | Manutentionnaire sur un circuit fixe qui déplace les kanbans et les conteneurs |
| Kanban de prélèvement | Carte qui autorise le déplacement de pièces vers un processus aval [1] |
| WIP | Work in process (en-cours) : matière lancée mais non terminée |

## FAQ : questions sur le système kanban et le système pull

### Qu'est-ce qu'un système kanban en production industrielle ?

Un système kanban pilote la production et les flux de matières à l'aide de signaux déclenchés par la consommation. Lorsqu'un processus aval utilise un conteneur, sa carte ou le conteneur vide remonte vers l'amont et autorise exactement un réapprovisionnement. Le nombre de cartes plafonne le stock de chaque boucle [1].

### Quelles informations figurent sur une carte kanban ?

En général : le nom et le numéro de la pièce, le processus ou le fournisseur qui l'alimente, la quantité par conteneur (pack-out), l'adresse de stockage et l'adresse du processus consommateur [1]. La plupart des usines ajoutent le numéro de carte dans la boucle (par exemple 3 sur 9), le type de kanban et un code-barres pour les audits ou l'e-kanban.

### Quels sont les principaux types de kanban ?

Le kanban de production (fabriquer cette quantité), le kanban de transfert ou de déplacement (déplacer cette quantité), le kanban de signal ou triangle (lancer un lot à un point de déclenchement) et le kanban fournisseur (commander auprès d'un fournisseur externe) [1]. Les systèmes à deux bacs, les kanbans d'urgence, les kanbans ponctuels et l'e-kanban sont des variantes de ces types.

### Comment calcule-t-on le nombre de cartes kanban ?

On part de N = demande × délai de réapprovisionnement × (1 + facteur de sécurité) ÷ quantité par conteneur, puis on arrondit à l'entier supérieur. Exemple : 960 × 0,25 × 1,1 ÷ 40 = 6,6, soit 7 cartes. On vérifie ensuite si les intervalles de collecte et les tailles de lot du processus amont exigent des cartes supplémentaires ; dans l'exemple ci-dessus, ces éléments portent le nombre à 9 [12][13].

### Quelles sont les six règles du kanban de Toyota ?

Dans la version courante : le processus aval prélève ce dont il a besoin, le processus amont produit dans la quantité et l'ordre des kanbans, rien n'est fabriqué ni déplacé sans kanban, le kanban accompagne toujours les pièces, les pièces défectueuses ne sont jamais transmises, et le nombre de kanbans est réduit progressivement afin de mettre en évidence les problèmes [10]. Une seconde version, tirée du manuel de Toyota de 1973, les formule différemment et ajoute « réduire les fluctuations » et « stabiliser et rationaliser le processus de production » [11].

### Quelle est la différence entre système push et système pull ?

Un système pull limite explicitement les encours ; un système push lance le travail selon un planning sans cette limite [2]. Le pull ne se confond pas avec la fabrication à la commande : une boucle kanban en fabrication sur stock relève du pull, tandis qu'un atelier en fabrication à la commande qui lance toutes les commandes en même temps relève du push.

### Le kanban est-il la même chose que le juste-à-temps ?

Non. Le juste-à-temps est le principe qui consiste à ne produire que ce qui est nécessaire, au moment où il est nécessaire, et en quantité nécessaire [8]. Le kanban est le système de signalisation que Toyota a développé pour mettre ce principe en pratique [7].

### Qu'est-ce qu'un système kanban à deux bacs ?

Chaque pièce dispose de deux conteneurs au point d'utilisation. Lorsque le premier est vide, l'opérateur commence à puiser dans le second et renvoie le bac vide comme signal de réapprovisionnement. Chaque bac contient de quoi couvrir la demande pendant le délai de réapprovisionnement, avec une marge. C'est la forme la plus simple du kanban, adaptée aux consommables à faible coût [10].

### Qu'est-ce qu'un supermarché kanban ?

Un point de stock maîtrisé, généralement situé à proximité du processus qui l'alimente, où chaque référence dispose d'une adresse fixe et d'une quantité maximale. Le processus aval ou un manutentionnaire y prélève, et le fournisseur ne remplace que ce qui a été prélevé.

### Qu'est-ce que l'e-kanban ?

Le kanban électronique remplace les cartes physiques par des scans, des capteurs ou des messages système. Il contribue à éliminer les erreurs de saisie manuelle et les cartes égarées [10] et constitue la forme habituelle pour les fournisseurs éloignés [1]. Il est conseillé de faire fonctionner une boucle sur papier d'abord ; on ne numérise qu'une fois les règles validées.

### Quelle est la différence entre kanban et MRP ?

Le MRP planifie les matières et la capacité à partir d'un programme directeur et de nomenclatures, par date. Le kanban déclenche le réapprovisionnement selon la consommation. Dans la plupart des usines, le MRP assure la planification à long terme, les prévisions transmises aux fournisseurs et les pièces hors kanban, tandis que le kanban exécute le réapprovisionnement quotidien des pièces à rotation régulière [15][16].

### Qu'est-ce que le CONWIP et en quoi se distingue-t-il du kanban ?

Le CONWIP (constant work in process, en-cours constant) utilise un seul jeu de cartes pour toute une ligne : un travail n'entre que si une carte est libre, et la carte revient au début lorsque le travail est terminé [3][5]. Le kanban utilise des cartes propres à chaque pièce à chaque étape. Le CONWIP est plus simple à mettre en place et convient aux lignes à nombreuses variantes ; le kanban offre un contrôle plus serré par étape [5].

### Dans quels cas ne pas utiliser le kanban ?

Lorsque la demande par pièce est sporadique ou très variable, lorsque les produits sont personnalisés ou en faible volume, lorsque les délais de réapprovisionnement sont longs et peu fiables, ou lorsque les pièces changent fréquemment de révision. Il vaut mieux alors recourir à la fabrication à la commande avec CONWIP ou POLCA, ou à un pilotage planifié par MRP [20].

### Un kanban de production est-il la même chose qu'un tableau Kanban ?

Non. Les deux limitent les travaux en cours, mais un tableau Kanban gère des tâches dans le travail intellectuel et se dimensionne selon le jugement de l'équipe, tandis que le kanban de production gère des pièces physiques et se dimensionne selon une formule. La méthode du tableau trouve ses origines dans le système de production de Toyota [22].

### Combien de kanbans une boucle doit-elle avoir au minimum ?

Deux. Avec une seule carte, le consommateur doit attendre chaque fois que la carte est en transit. Certaines usines fixent un minimum interne de trois pour les kanbans de production.

### Combien de temps faut-il pour mettre en place le kanban ?

Pour une chaîne de valeur, un pilote de 5 à 15 boucles peut être mené en environ trois mois si les processus fournisseurs sont stables ; la couverture complète d'une chaîne de valeur prend généralement environ six mois dans la feuille de route ci-dessus. Des processus instables et de longs changements de série allongent ce délai.

### Le kanban peut-il fonctionner avec les fournisseurs ?

Oui, au moyen de kanbans fournisseurs, généralement électroniques pour les fournisseurs éloignés [1]. Convenez de la méthode de signal, du délai de livraison, du conditionnement, de la quantité et de la conduite à tenir en cas de pics. Partagez les prévisions issues du MRP afin que le fournisseur puisse planifier sa capacité, tandis que le kanban déclenche les livraisons effectives.

### Le juste-à-temps est-il un système en flux poussé ou tiré ?

Tiré. Toyota décrit le JAT comme une boucle dans laquelle les processus amont ne réapprovisionnent que ce que les processus aval ont prélevé [8], et le kanban est l'outil qui le met en œuvre [7]. Une usine peut se dire en JAT tout en fonctionnant en flux poussé, par exemple en lançant chaque ordre dès sa saisie ; le critère est de savoir si le WIP est plafonné [2].

### Qu'appelle-t-on flux poussé et flux tiré dans la gestion de la chaîne d'approvisionnement ?

La même logique appliquée entre entreprises. Dans une chaîne d'approvisionnement en flux poussé, les matières premières et les produits finis sont déplacés et stockés selon des prévisions. Dans une chaîne en flux tiré, le réapprovisionnement suit la demande réelle, par exemple grâce aux kanbans fournisseurs [1]. La plupart des chaînes combinent les deux : les prévisions planifient la capacité et les achats à long délai, et les signaux de consommation déclenchent les livraisons.

### Un système tiré peut-il fonctionner sans prévisions de la demande ?

Pas entièrement. Le réapprovisionnement quotidien repose sur la consommation, mais les tailles de boucles sont calculées à partir de la demande attendue, les modules kanban des ERP les recalculent à partir des périodes de demande [15], et les fournisseurs ont besoin de prévisions pour planifier leur capacité. Le flux tiré remplace le lancement des ordres piloté par les prévisions, pas la prévision elle-même.

### Le kanban relève-t-il du lean ou du Six Sigma ?

Du lean. Le kanban provient du système de production Toyota [7][8], principale source de la production lean. Six Sigma est une méthode distincte, fondée sur la statistique, visant à réduire la variabilité et les défauts. De nombreuses usines utilisent les deux, car des processus stables et capables permettent des boucles kanban plus petites ; voir le [guide sur Six Sigma et l'analyse des causes racines](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### Le kanban est-il japonais ou chinois ?

Japonais. Kanban est le mot japonais signifiant « panneau » ou « enseigne » [1], et la méthode a été développée chez Toyota au Japon [7][10].

## Conclusion et premières étapes

Un système kanban est un plafond de WIP rendu visible. Ses cartes, ses bacs et ses supermarchés transforment une idée simple issue de l'atelier d'usinage de Toyota dans les années 1950 en pratique quotidienne : ne fabriquer et ne déplacer que ce que le processus suivant a consommé. La définition la plus utile pour la conception vient de Hopp et Spearman : un système en flux tiré limite explicitement les travaux en cours [2]. Le kanban le fait référence par référence. CONWIP, POLCA et drum-buffer-rope le font pour des lignes, des paires de cellules et des contraintes, et conviennent là où des boucles spécifiques à chaque référence ne feraient que stocker des articles à faible rotation.

La partie difficile tient au temps de réapprovisionnement derrière chaque carte, à la taille de lot du processus amont, à un planning pacemaker lissé et à la discipline nécessaire pour suivre les règles. Dimensionnez les boucles à partir des temps de réapprovisionnement mesurés, comparez la suggestion de votre ERP avec votre propre feuille de calcul, ne retirez des cartes que lorsque quelqu'un peut corriger ce que cela révèle, et conservez en dehors des boucles les stocks de sécurité stratégiques là où le risque d'approvisionnement l'exige.

**Vos premières étapes dans les 30 prochains jours**

- [ ] Parcourez une famille de produits depuis l'expédition jusqu'à la réception et comptez les WIP entre chaque processus
- [ ] Calculez le délai de traversée actuel avec la loi de Little (WIP ÷ débit quotidien)
- [ ] Segmentez les références de la famille en runners, repeaters et strangers à partir de la demande quotidienne et de son coefficient de variation
- [ ] Choisissez trois à cinq boucles runners à proximité d'un processus amont stable
- [ ] Mesurez le temps de réapprovisionnement de chaque boucle de bout en bout et renseignez la feuille de dimensionnement
- [ ] Imprimez et plastifiez les cartes, marquez les emplacements du supermarché, et formez les opérateurs et les manutentionnaires aux huit règles de l'atelier
- [ ] Convenez avec la direction financière de la manière dont la réduction des stocks sera déclarée, y compris l'effet du coût complet (absorption costing)
- [ ] Vérifiez avec l'IT si votre ERP dispose d'un module kanban et comment il calcule la taille des boucles ; évitez que la MRP ne planifie deux fois les références kanban
- [ ] Passez en revue les boucles chaque jour au tableau de l'atelier pendant deux semaines, puis chaque semaine avec le modèle d'audit
- [ ] Si vous avez besoin d'un soutien externe, contactez le centre NIST MEP de votre État [27]

---

## Pour aller plus loin sur m365.fm

**Guides de ce parcours d'apprentissage**
- [Lean Manufacturing : principes, outils, mise en œuvre et limites](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Cartographie de la chaîne de valeur (Value Stream Mapping)](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Planification des ventes et des opérations, MRP et planification de production](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Théorie des contraintes et drum-buffer-rope](https://www.m365.fm/en/learn/theory-of-constraints/)
- [SMED et réduction des temps de changement de série](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM et TRS](https://www.m365.fm/en/learn/tpm-oee/)
- [5S et gestion visuelle](https://www.m365.fm/en/learn/5s-visual-management/)
- [Management de l'atelier et Gemba walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Indicateurs de performance industrielle (KPI)](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Cybersécurité OT et ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Azure pour l'industrie manufacturière](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planification de production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Approfondissements**
- [Dimensionnement des lots (Lot Sizing)](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestion des stocks industriels et stock de sécurité](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Logistique interne et milk runs](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Simulation de production](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Résilience de la chaîne d'approvisionnement](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Travail standardisé](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)

**Termes du glossaire (entités)**
[Kanban](https://www.m365.fm/entity/kanban/) · [Système à flux tiré](https://www.m365.fm/entity/pull-system/) · [Juste-à-temps](https://www.m365.fm/entity/just-in-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [5S](https://www.m365.fm/entity/5s/) · [Travail standard](https://www.m365.fm/entity/standard-work/) · [Théorie des contraintes](https://www.m365.fm/entity/theory-of-constraints/) · [Management Lean](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur le lean manufacturing, la planification de production et la transformation numérique de la production, en mettant l'accent sur la manière dont les modèles de chaîne de valeur, la simulation et l'analyse des KPI aident les usines à concevoir le flux et le tirage.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources marked (V) were opened and checked for this article on that date. Sources marked (V-sister) were opened and checked on the same date for the related guide `lean-manufacturing.md`; our fetch budget ran out before a second check for this article, so the fact checker flagged them for a quick re-check before publication.

1. Kanban. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/ (V)
2. Hopp, W. J.; Spearman, M. L.: To Pull or Not to Pull: What Is the Question? *Manufacturing & Service Operations Management* 6 (2004) 2, pp. 133–148. DOI: 10.1287/msom.1030.0028. https://pubsonline.informs.org/doi/pdf/10.1287/msom.1030.0028 (V)
3. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP: a pull alternative to kanban. *International Journal of Production Research* 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761. Reprint and abstract: Project Production Institute Journal, Vol. 3 (2018). https://projectproduction.org/journal/conwip-a-pull-alternative-to-kanban/ (V; volume, issue and pages as verified for the related guide `production-scheduling-aps.md`)
4. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP Redux: reflections on 30 years of development and implementation. *International Journal of Production Research* 60 (2022) 1, pp. 381–387. DOI: 10.1080/00207543.2021.1954713. https://econpapers.repec.org/RePEc:taf:tprsxx:v:60:y:2022:i:1:p:381-387 (V)
5. CONWIP. Wikipedia. https://en.wikipedia.org/wiki/CONWIP (V)
6. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. *Operations Research* 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html (V)
7. Sugimori, Y. et al. (four authors): Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system. *International Journal of Production Research* 15 (1977) 6, pp. 553–564. DOI: 10.1080/00207547708943149. https://scispace.com/papers/toyota-production-system-and-kanban-system-materialization-2c0g0kt2j0 (V; the record names Y. Sugimori plus three co-authors)
8. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html (V)
9. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge (English edition 1988). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140 (V-sister)
10. Kanban. Wikipedia. https://en.wikipedia.org/wiki/Kanban (V)
11. Roser, C.: Toyota's Six Rules for Kanban. AllAboutLean. https://www.allaboutlean.com/toyotas-six-rules/ (V)
12. Roser, C.: How Many Kanbans? The Kanban Formula, Part 1. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part1/ (V)
13. Roser, C.: How Many Kanbans? The Kanban Formula, Part 2. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part2/ (V)
14. Co, H. C.; Moosa, S.: Overplanning Factor in Toyota's Formula for Computing the Number of Kanban. *IIE Transactions* 29 (1997) 5, pp. 409–415. DOI: 10.1080/07408179708966346. https://ink.library.smu.edu.sg/lkcsb_research/892 (V)
15. Kanban quantity calculations and circulating kanbans (Dynamics 365 Supply Chain Management training module). Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/create-process-fixed-kanbans-dyn365-supply-chain-mgmt/5-calculations (V)
16. Kanban Equation 1: Fixed Container Size and High Demand. Oracle JD Edwards EnterpriseOne Kanban Management 9.2 documentation. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoakm/kanban-equation-1-fixed-container-size-and-high-demand.html (V)
17. Lage Junior, M.; Godinho Filho, M.: Variations of the kanban system: Literature review and classification. *International Journal of Production Economics* 125 (2010) 1, pp. 13–21. Elsevier, ScienceDirect PII S0925-5273(10)00019-8. https://ideas.repec.org/a/eee/proeco/v125y2010i1p13-21.html (V; DOI not shown on the record page)
18. Heijunka. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/ (V)
19. Pitch. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/pitch/ (V)
20. Suri, R.: The Practitioner's Guide to POLCA: The Production Control System for High-Mix, Low-Volume and Custom Products. Productivity Press / Taylor & Francis. https://www.taylorfrancis.com/books/9781351170765
21. Rajan Suri, Professor Emeritus, Industrial and Systems Engineering (POLCA, Center for Quick Response Manufacturing). University of Wisconsin–Madison, College of Engineering. https://engineering.wisc.edu/?p=27657 (V)
22. Kanban (development). Wikipedia. https://en.wikipedia.org/wiki/Kanban_(development) (V)
23. How the Kanban System of Inventory Management Works. Smartsheet. https://www.smartsheet.com/understanding-kanban-inventory-management-and-its-uses-across-multiple-industries (V; vendor page)
24. Kanban in manufacturing: cards, boards and supermarkets. Veryable. https://www.veryableops.com/blog/kanban-manufacturing-cards-boards-supermarkets (V; vendor page)
25. Plex: Push vs. Pull Manufacturing: Is a Kanban Pull System Right for Your Company? IndustryWeek, July 28, 2017. https://www.industryweek.com/cloud-computing/article/22023873/push-vs-pull-manufacturing-is-a-kanban-pull-system-right-for-your-company (V; vendor byline)
26. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/ (V-sister)
27. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (V)
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics (V)
