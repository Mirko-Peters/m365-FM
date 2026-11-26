# SEO metadata

| Field | Value |
|---|---|
| Meta title | Théorie des contraintes en production : 5 étapes, goulots |
| Meta description | Théorie des contraintes en production : cinq étapes de focalisation, analyse des goulots, Drum-Buffer-Rope chiffré, comptabilité du débit, modèles. |
| Slug | `theory-of-constraints` |

# Théorie des contraintes : les cinq étapes de focalisation, goulots d'étranglement et Drum-Buffer-Rope

> **Réponse courte :** La théorie des contraintes (TOC, *theory of constraints*) est une approche de management développée par Eliyahu M. Goldratt et présentée dans le roman d'entreprise *The Goal* (1984). Elle affirme que le rendement de tout système est limité par très peu de contraintes, souvent un goulot d'étranglement unique, si bien que l'effort d'amélioration doit d'abord porter là. La TOC met cela en pratique avec cinq étapes de focalisation (identifier, exploiter, subordonner, élever, prévenir l'inertie), la méthode d'ordonnancement drum-buffer-rope et la comptabilité par le débit (*throughput accounting*) [1][4][6].

> **Points clés**
> - *The Goal*, de Eliyahu M. Goldratt et Jeff Cox, a été publié pour la première fois en 1984 par North River Press ; en 2011, il avait été vendu à plus de 5 millions d'exemplaires dans 35 langues [1][2].
> - Les cinq étapes de focalisation sont : identifier la contrainte, l'exploiter, subordonner tout le reste à celle-ci, l'élever et empêcher l'inertie de devenir la contrainte [4].
> - Une heure perdue au niveau de la contrainte est une heure perdue pour l'ensemble de l'usine. Une heure gagnée sur un poste non contraint ne change rien, sauf si elle soulage la contrainte.
> - Drum-buffer-rope (DBR) ordonnance la contrainte (*drum*), la protège par un tampon temporel (*buffer*) et ne libère les matières qu'au rythme que la contrainte peut absorber (*rope*) [6][8].
> - La comptabilité par le débit juge les décisions selon le débit (ventes moins coût variable réel), l'inventaire/investissement et les charges d'exploitation, et classe les produits selon le débit par minute de contrainte, ce qui peut inverser le classement donné par la comptabilité analytique standard [6][19][20].
> - La détection des goulots doit reposer sur les données : un contrôle de charge de capacité, l'observation des files d'attente et, lorsque des données d'état des machines existent, la méthode des périodes actives, qui met aussi en évidence les goulots mobiles [13][14][15].
> - Une revue de 2003 portant sur plus de 80 applications publiées de la TOC fait état de gains opérationnels et financiers importants et d'aucun échec signalé, ce qui en dit aussi long sur les cas qui sont publiés [10].
> - TOC, lean et Six Sigma fonctionnent mieux ensemble : la TOC indique où concentrer les efforts, le lean élimine les gaspillages et crée le flux, Six Sigma réduit la variation à l'endroit qui compte.

## Table des matières

1. [Qu'est-ce que la théorie des contraintes ? Définition et idée centrale](#quest-ce-que-la-théorie-des-contraintes--définition-et-idée-centrale)
2. [Historique : Eliyahu Goldratt, OPT et The Goal](#histoire--eliyahu-goldratt-opt-et-the-goal)
3. [Contrainte vs goulot d'étranglement : types de contraintes](#contrainte-vs-goulot-détranglement--types-de-contraintes)
4. [Les cinq étapes de focalisation](#les-cinq-étapes-de-focalisation)
5. [Exemple de théorie des contraintes : les cinq étapes de focalisation dans une usine de collecteurs](#théorie-des-contraintes-exemple--les-cinq-étapes-de-concentration-dans-une-usine-de-blocs-collecteurs)
6. [Analyse des goulots : comment identifier le goulot (six méthodes)](#analyse-des-goulots-détranglement--comment-identifier-le-goulot-six-méthodes)
7. [Ordonnancement drum-buffer-rope avec des chiffres](#ordonnancement-drum-buffer-rope-chiffré)
8. [Drum-buffer-rope simplifié (S-DBR) pour la fabrication à la commande](#drum-buffer-rope-simplifié-s-dbr-pour-la-fabrication-à-la-commande)
9. [Gestion des tampons : la boucle de rétroaction](#gestion-des-tampons--la-boucle-de-rétroaction)
10. [La physique de l'usine derrière la TOC : loi de Little et variabilité](#physique-dusine-derrière-la-toc--loi-de-little-et-variabilité)
11. [Comptabilité par le débit vs comptabilité analytique](#comptabilité-du-débit-et-comptabilité-de-coûts)
12. [Les processus de réflexion](#les-processus-de-réflexion)
13. [TOC vs lean vs Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Au-delà de l'usine : chaîne critique et réapprovisionnement](#au-delà-de-latelier--chaîne-critique-et-réapprovisionnement)
15. [Modèles pour les travaux TOC](#modèles-pour-les-travaux-toc)
16. [Feuille de route de mise en œuvre : les six premiers mois](#feuille-de-route-de-mise-en-œuvre--les-six-premiers-mois)
17. [Indicateurs TOC : mesurer les progrès](#indicateurs-kpi-toc--comment-mesurer-les-progrès)
18. [Erreurs courantes](#erreurs-courantes)
19. [Critiques et limites de la théorie des contraintes](#critiques-et-limites-de-la-théorie-des-contraintes)
20. [Les personnes et la sécurité au niveau de la contrainte](#les-personnes-et-la-sécurité-au-niveau-de-la-contrainte)
21. [La TOC dans l'usine numérique : données, simulation et APS](#toc-dans-lusine-numérique--données-simulation-et-aps)
22. [Glossaire](#glossaire)
23. [FAQ : questions sur la théorie des contraintes](#faq--questions-sur-la-théorie-des-contraintes)
24. [Conclusion et premières étapes](#conclusion-et-premières-étapes)

**Quelle section correspond à votre rôle ?**

| Vous êtes ... | Commencez par |
|---|---|
| Directeur d'usine ou directeur des opérations | Sections 4, 5, 16 et 18 |
| Planificateur ou ordonnanceur de production | Sections 6 à 10 |
| Contrôleur de gestion d'usine ou DAF | Sections 11 et 17 |
| Responsable CI, lean ou Six Sigma | Sections 12, 13 et 15 |
| Étudiant ou nouveau venu sur la TOC | Sections 1 à 5, puis le glossaire |

## Qu'est-ce que la théorie des contraintes ? Définition et idée centrale

La théorie des contraintes est une manière de gérer une organisation comme une chaîne d'étapes dépendantes. Son point de départ est simple : tout système qui poursuit un objectif possède au moins un facteur qui limite la part de cet objectif qu'il peut atteindre. Le TOC Institute utilise l'analogie de la chaîne : une chaîne n'est jamais plus solide que son maillon le plus faible, et renforcer un autre maillon ne la rend pas plus solide [4]. Les livres ultérieurs de Goldratt et la communauté TOC ont étendu l'idée de l'atelier à la distribution, aux projets, à la finance et à la stratégie [6].

Pour une usine de fabrication, l'objectif est généralement formulé comme gagner de l'argent maintenant et à l'avenir. Le facteur limitant peut être une machine, une compétence, un fournisseur, une règle de gestion ou le marché lui-même. La TOC l'appelle la contrainte. L'affirmation centrale est que la plupart des systèmes n'ont qu'une seule contrainte, ou très peu, à un moment donné. Le TOC Institute indique que la plupart des systèmes ont une ressource limitant la capacité, et rarement plus de deux ou trois [4].

### L'idée centrale en un paragraphe

Si la production d'une usine est limitée par une seule ressource, alors la production de l'usine est égale à la production de cette ressource. Chaque minute perdue sur cette ressource est une minute de production que l'usine perd définitivement. Chaque minute gagnée ailleurs ne constitue au mieux qu'une capacité excédentaire, et au pire crée davantage de stocks qui attendent devant la contrainte. C'est pourquoi la TOC affirme que les gains d'efficience locaux aux postes non contraints ne se cumulent pas en performance d'usine. Chercher à optimiser séparément chaque étape est un effort gaspillé ; la TOC améliore le système dans son ensemble en passant par sa contrainte.

### Théorie des contraintes en fabrication : pourquoi elle compte en pratique

Trois situations courantes en usine illustrent cette idée :

| Situation | Réaction typique sans TOC | Réaction avec la TOC |
|---|---|---|
| Des commandes sont en retard, les en-cours sont partout | accélérer, ajouter des heures supplémentaires partout, lancer les commandes plus tôt | identifier la seule ressource qui limite la production, lancer les travaux au rythme de cette ressource |
| Une machine non goulot est à l'arrêt | lui trouver du travail pour maintenir un taux d'« efficience » élevé | la laisser attendre ; un temps d'arrêt à un poste non contraint est normal et peu coûteux |
| Une nouvelle machine est proposée | l'approuver parce que le service est surchargé | se demander si elle ajoute de la capacité au niveau de la contrainte et quel effet elle a sur le débit |

### Avantages de la théorie des contraintes

Les bénéfices les plus souvent rapportés sont des délais de fabrication plus courts, une meilleure tenue des dates de livraison, des stocks plus faibles et un débit plus élevé. Une revue des applications publiées par Mabin et Balderstone, telle que résumée par Panizzolo, fait état d'améliorations moyennes de 70 % du délai commande-livraison, de 65 % du cycle de fabrication, de 49 % des stocks, de 63 % du débit ou du chiffre d'affaires et de 44 % de la performance sur les dates de livraison [11]. Panizzolo attribue ces moyennes à la revue de Mabin et Balderstone, *The World of the Theory of Constraints* (2000), qui occupe la longueur d'un livre ; l'article de revue de 2003 des mêmes auteurs analyse le même corpus de plus de 80 cas [10][11]. Il faut considérer ces chiffres comme la limite haute de ce qui est possible : ils proviennent de réussites publiées, et la revue d'origine n'a relevé aucun cas d'échec [10]. La section 19 explique ce que cela implique.

Au-delà des chiffres, la TOC donne à une usine une réponse commune à la question « par où commencer ? ». C'est souvent le changement le plus important : moins de projets d'amélioration des processus, dirigés vers le point où ils modifient réellement le résultat.

## Histoire : Eliyahu Goldratt, OPT et The Goal

Eliyahu M. Goldratt est né le 31 mars 1947 et est décédé le 11 juin 2011 à son domicile en Israël. Il était titulaire d'une licence de l'université de Tel Aviv, ainsi que d'un master et d'un doctorat de l'université Bar-Ilan [2][3]. Avant que la TOC ne porte ce nom, il a travaillé avec Creative Output, une entreprise qui commercialisait l'Optimized Production Technology (OPT), un logiciel d'ordonnancement de la production [3].

| Année | Jalon | Source |
|---|---|---|
| avant 1984 | Logiciel d'ordonnancement OPT commercialisé par Creative Output, à l'origine technique du drum-buffer-rope (année exacte de lancement [unverified: année de lancement non confirmée]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing* de Goldratt et Jeff Cox, North River Press, 262 pages | [1] |
| vers 1985 | Fondation de l'Avraham Y. Goldratt Institute après le départ de Goldratt de Creative Output | [3] |
| 1986 | *The Race* (avec Robert E. Fox) décrit en détail le drum-buffer-rope ; première édition révisée de *The Goal* | [3][7][8] |
| 1990 à 1991 | *The Haystack Syndrome* : le débit, les stocks et les charges d'exploitation comme mesures de décision | [3][20] |
| 1992 | deuxième édition révisée de *The Goal* | [3][7] |
| 1994 | *It's Not Luck* : processus de réflexion pour le marketing et la stratégie | [3][12] |
| 1997 | *Critical Chain* : application de la TOC à la gestion de projet | [3] |
| 2000 | *Necessary But Not Sufficient* : la TOC et les logiciels d'entreprise | [3] |
| 2004 | troisième édition révisée de *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (commerce de détail et distribution) | [3] |
| 2010 | *Theory of Constraints Handbook* (sous la direction de Cox et Schleier), la référence standard sur le DBR, le S-DBR et la gestion par les tampons | [9] |
| 2011 | Décès de Goldratt ; *The Goal* figure dans la liste de Time parmi les 25 livres de gestion d'entreprise les plus influents (liste de Time citée par Wikipedia) | [2][7] |
| 2014 | quatrième édition révisée (30e anniversaire) de *The Goal* (liste des éditions issue d'une infobox non sourcée) | [7] |

### The Goal : un roman comme manuel

*The Goal* raconte l'histoire d'Alex Rogo, directeur d'usine dont le site doit être redressé en trois mois. Son ancien professeur de physique, Jonah, le guide par des questions plutôt que par des réponses [7]. La scène la plus citée est une randonnée de scouts : la troupe ne peut avancer que aussi vite que son garçon le plus lent, Herbie, et les écarts dans la file s'allongent à mesure que les marcheurs rapides imposent l'allure. La solution de Rogo consiste à placer Herbie en tête, à alléger son sac à dos et à relier le groupe par une corde. C'est là, en un après-midi, les cinq étapes de focalisation et le drum-buffer-rope : identifier Herbie, l'exploiter (sac allégé), subordonner la troupe à son allure et garder la file courte.

Le format romanesque a rendu ces idées accessibles aux superviseurs et aux opérateurs, et pas seulement aux ingénieurs. North River Press a indiqué en 2011 que le livre s'était vendu à plus de 5 millions d'exemplaires dans 35 langues [2].

### De l'OPT à une philosophie de management

La TOC s'est construite par étapes. La première fut l'ordonnancement (OPT, puis DBR). La deuxième fut la mesure (comptabilité du débit). La troisième fut une méthode générale de résolution de problèmes (les processus de réflexion). La quatrième appliqua cette logique aux projets (chaîne critique) et à la distribution (réapprovisionnement) [6][12]. Aujourd'hui, la Theory of Constraints International Certification Organization (TOCICO), une association américaine à but non lucratif 501(c)(3), certifie les praticiens à trois niveaux : examens de fondamentaux, examens de praticien et évaluation d'implémenteur [5].

## Contrainte vs goulot d'étranglement : types de contraintes

Les mots « contrainte » et « goulot d'étranglement » sont souvent utilisés comme synonymes. Ils ne sont pas tout à fait équivalents.

- Un **goulot d'étranglement** est une ressource dont la capacité est inférieure à la demande qui lui est adressée. C'est une notion de capacité.
- Une **contrainte** est tout ce qui limite la performance du système vis-à-vis de son objectif. Ce peut être un goulot d'étranglement, mais aussi le marché, une matière, une politique ou un mode de pensée.
- Une **ressource à capacité contrainte (CCR)** est une ressource qui n'est pas un goulot d'étranglement en moyenne, mais qui le devient si elle n'est pas gérée avec soin, par exemple à cause des pics dans le mix produit.

Un goulot d'étranglement ne limite le débit que s'il se trouve sur le chemin des commandes qui comptent. Une usine peut avoir une machine « goulot » surchargée de travaux de faible priorité, alors que la véritable contrainte est le marché. La TOC demande donc d'abord : qu'est-ce qui limite l'objectif ?

### Types de contraintes

| Type | Exemple | Comment on le repère | Première action typique |
|---|---|---|---|
| Physique : équipement | un centre d'usinage 5 axes, un four de traitement thermique, une ligne de peinture | file d'attente permanente devant, ressources à l'arrêt derrière | exploiter : aucune minute perdue |
| Physique : personnes et compétences | seulement deux soudeurs certifiés par équipe | le travail attend des personnes précises | polyvalence, planning construit autour des compétences |
| Matière | une pièce moulée avec un délai de 16 semaines | l'assemblage attend une pièce unique | stock tampon de réapprovisionnement, deuxième source |
| Marché | demande inférieure à la capacité de l'usine | capacité libre partout, ventes en dessous du plan | la contrainte est extérieure ; améliorer l'offre et le délai |
| Politique | « ne lancer que des lots complets », « maintenir chaque machine au-dessus de 85 % de rendement » | règles qui imposent des comportements erronés | processus de pensée, modifier la règle |
| Paradigme | « le stock est un actif », « une usine occupée est une bonne usine » | résistance face à l'inactivité des non-contraintes | formation, jeux de simulation |

En pratique, les contraintes de politique méritent une attention particulière : une contrainte physique est souvent bridée par une règle (lots minimaux, règles de lancement, objectifs de taux d'utilisation) plutôt que par sa capacité réelle. L'exemple détaillé de la section 5 montre deux de ces règles.

### Goulots statiques, dynamiques et mobiles

Un goulot **statique** reste sur la même ressource pendant des mois. Un goulot **dynamique** ou **mobile** se déplace entre les ressources selon le mix produit, les pannes ou les effectifs. La différence influe sur le choix de la méthode : un goulot statique peut être piloté avec une configuration DBR fixe, tandis qu'un goulot mobile exige des données et souvent un APS pour calculer la charge par ressource pour le carnet de commandes en cours [13][14]. La section 6 montre comment les distinguer.

### VATI : le type d'usine façonne la contrainte

La TOC classe les usines selon la forme de leur flux matière, appelée analyse VATI [6][9] :

| Type | Forme du flux | Exemple | Problème typique |
|---|---|---|---|
| V | peu de matières premières se divisent en nombreux produits | acier, papier, chimie, extrusion | mauvaise affectation : matière engagée trop tôt sur le mauvais produit |
| A | nombreuses pièces convergent vers peu de produits | assemblage aéronautique, construction de machines | pièces arrivant non synchronisées, l'assemblage attend la dernière pièce |
| T | peu de composants, assemblés tardivement en nombreuses variantes | électronique, électroménager | pièces détournées entre variantes, décalage des produits finis |
| I | ligne droite | lignes d'usinage simples | comportement classique du goulot d'étranglement |

La plupart des usines réelles sont des combinaisons. Le type d'usine indique où placer les stocks tampons : avant l'assemblage dans une usine de type A, avant la divergence dans une usine de type V.

## Les cinq étapes de focalisation

Les cinq étapes de focalisation constituent le cœur de la méthode TOC. Le TOC Institute les formule ainsi : identifier la contrainte du système, exploiter la contrainte, subordonner tout le reste à la contrainte, élever la contrainte, et empêcher l'inertie de devenir la contrainte [4]. Goldratt a appelé ce cycle le processus d'amélioration continue (POOGI), qui est aussi le sous-titre des éditions ultérieures de *The Goal* [6]. Comme l'étape 5 ramène à l'étape 1, les cinq étapes forment un cycle d'amélioration continue : une fois une contrainte du système levée, une nouvelle contrainte apparaît ailleurs, et le travail recommence.

Avant l'étape 1, deux questions appellent une réponse : quel est l'objectif du système, et comment mesurer les progrès vers cet objectif ? Dans une entreprise, la TOC utilise le débit, l'inventaire (ou l'investissement) et les charges d'exploitation comme mesures (section 11).

| Étape | Question | Ce que cela signifie dans un atelier | Ce que cela ne signifie pas |
|---|---|---|---|
| 1. Identifier | Qu'est-ce qui limite le débit actuellement ? | trouver la ressource, la matière, le marché ou la règle qui fixe le rythme | choisir la machine qui tombe le plus souvent en panne ou la plus chère |
| 2. Exploiter | Comment tirer le maximum de ce dont on dispose ? | aucune minute perdue, aucun travail défectueux, le bon mix produit | acheter de la capacité |
| 3. Subordonner | Comment tout le reste soutient-il l'étape 2 ? | lancements, tailles de lots, maintenance, qualité et effectifs suivent la contrainte | maintenir chaque ressource occupée |
| 4. Élever | Si cela ne suffit toujours pas, comment ajouter de la capacité ? | heures supplémentaires, sous-traitance, une deuxième machine, un nouveau fournisseur | le premier réflexe |
| 5. Empêcher l'inertie | La contrainte s'est-elle déplacée ? Les anciennes règles sont-elles devenues la contrainte ? | revenir à l'étape 1, revoir les règles conçues pour l'ancienne contrainte | déclarer la victoire |

### Étape 1 : Identifier la contrainte

La contrainte est la ressource dont la capacité est la plus faible par rapport à la demande qui lui est adressée. En pratique, commencez par un calcul de charge (demande multipliée par le temps de process, rapporté au temps disponible), puis vérifiez sur le terrain : où le travail fait-il la queue, où les opérateurs attendent-ils une ressource, sur quelle ressource les responsables de production demandent-ils sans cesse des nouvelles ? Le TOC Institute ajoute qu'une contrainte mal identifiée se corrige facilement sans dommage durable, ce qui est une bonne raison de ne pas attendre des données parfaites [4]. La section 6 présente six méthodes de détection.

### Étape 2 : Exploiter la contrainte

Exploiter signifie rendre la contrainte aussi productive que possible sans dépenser de somme importante. Le TOC Institute indique qu'une contrainte est souvent utilisée moins de 50 % du temps sur une base 24/7 et que les trois premières étapes révèlent généralement au moins 30 % de capacité cachée en quelques mois ; ces deux affirmations ne reposent sur aucun jeu de données publié, il convient donc de les vérifier dans votre propre usine [4]. Mesures d'exploitation typiques :

- couvrir les pauses, les changements d'équipe et les réunions pour que la contrainte continue de tourner ;
- déplacer la préparation des réglages hors du temps de marche de la contrainte (changement de série externe, voir le guide [SMED et réduction des changements de série](https://www.m365.fm/en/learn/smed-changeover-reduction/)) ;
- inspecter en amont de la contrainte pour qu'elle ne traite jamais une pièce déjà rebutée (dans les environnements AS9100 ou IATF 16949, déplacer un point de contrôle implique de mettre à jour le plan de contrôle et l'AMDEC processus) ;
- contrôler la qualité directement en aval de la contrainte, car une pièce rebutée plus tard coûte du temps de contrainte ;
- maintenir un stock tampon de travail devant elle pour qu'elle ne soit jamais en manque ;
- lui donner la priorité pour la maintenance, la programmation, l'outillage et la manutention ;
- choisir le mix produit selon le débit par minute de contrainte (section 11) ;
- confier aux autres ressources les travaux qu'elles peuvent faire, même moins efficacement.

### Étape 3 : Subordonner tout le reste

La subordination est l'étape la plus difficile, car elle va à l'encontre des indicateurs d'efficacité locale. Les non-contraintes doivent disposer de capacité disponible, et elles doivent l'utiliser pour protéger la contrainte, et non pour constituer des stocks. Exemples :

- **Lancement :** la matière entre dans l'usine au rythme de la contrainte (la corde dans le DBR).
- **Tailles de lots :** les non-contraintes peuvent travailler en petits lots et multiplier les changements de série, car elles disposent de capacité disponible ; la contrainte peut avoir besoin de lots plus grands pour économiser du temps de réglage.
- **Maintenance :** une panne sur la contrainte obtient le prochain technicien disponible ; la maintenance préventive sur la contrainte est planifiée lors d'arrêts programmés.
- **Qualité :** l'approbation de la première pièce sur la contrainte est prioritaire sur les autres contrôles de première pièce.
- **Mesure :** cessez de récompenser les services non contraints pour leur taux d'utilisation ou leurs « heures gagnées ».

Le TOC Institute relève que des contraintes qui changent fréquemment perturbent les politiques, les procédures et les personnes [4]. La subordination doit donc inclure la protection de la position de la contrainte, par exemple en maintenant les autres ressources bien au-dessus de la capacité de la contrainte.

### Étape 4 : Élever la contrainte

Ce n'est qu'après avoir réalisé les étapes 2 et 3 que vous devriez investir dans la capacité. Les options d'élévation comprennent les heures supplémentaires ou un poste supplémentaire uniquement au niveau de la contrainte, la sous-traitance d'une partie de son travail, l'ajout de personnel, l'achat d'équipements ou la refonte du produit pour réduire le temps requis sur la contrainte. De nombreuses usines passent directement à cette étape et achètent une machine alors que la contrainte existante perd encore un quart de son temps en pauses, en changements de série et en manque de matière.

### Étape 5 : Empêcher l'inertie de devenir la contrainte

Lorsque l'exploitation et l'élévation fonctionnent, la contrainte se déplace souvent et une nouvelle contrainte apparaît : sur une autre machine, chez un fournisseur ou sur le marché. Les règles qui étaient justes pour l'ancienne contrainte causent désormais des dommages. Inertie typique : la taille de lot importante de l'ancien goulot reste dans la gamme de fabrication, une règle de lancement liée à l'ancien tambour subsiste dans l'ERP, ou l'équipe commerciale continue de rationner les commandes alors que l'usine dispose maintenant de capacité disponible. Revenez à l'étape 1 et révisez les règles.

## Théorie des contraintes, exemple : les cinq étapes de concentration dans une usine de blocs collecteurs

L'exemple suivant a été construit pour ce guide. Les chiffres sont plausibles pour un petit atelier d'usinage américain mais ne proviennent pas de données réelles d'une entreprise.

### L'usine

Une usine de 60 personnes dans le Midwest fabrique des blocs collecteurs hydrauliques dans deux familles de produits :

- **Produit A** (collecteur standard) : prix 900 $, matière première et pièces achetées 400 $.
- **Produit B** (collecteur sur mesure) : prix 1 200 $, matière première et pièces achetées 450 $.

L'usine fonctionne sur deux postes de 8 heures, cinq jours par semaine : 80 heures, soit 4 800 minutes de temps disponible par ressource et par semaine. La demande hebdomadaire est de 100 unités de A et 60 unités de B. Les charges d'exploitation (toute la main-d'œuvre, les salaires, le loyer, l'énergie, les amortissements ; tout sauf la matière réellement variable) s'élèvent à 62 000 $ par semaine.

### Étape 1 : identifier la contrainte à l'aide d'un tableau de charge

Temps d'usinage en minutes par unité, issus des gammes et vérifiés par chronométrage sur le terrain :

| Ressource | A (min/unité) | B (min/unité) | Charge A (100 unités) | Charge B (60 unités) | Charge totale (min) | Charge vs 4 800 min |
|---|---|---|---|---|---|---|
| Scie | 8 | 10 | 800 | 600 | 1 400 | 29 % |
| Cellule CNC 5 axes | 25 | 40 | 2 500 | 2 400 | 4 900 | **102 %** |
| Ébavurage et lavage | 12 | 12 | 1 200 | 720 | 1 920 | 40 % |
| Assemblage | 15 | 20 | 1 500 | 1 200 | 2 700 | 56 % |
| Test sous pression | 10 | 15 | 1 000 | 900 | 1 900 | 40 % |

**Calcul pour la cellule CNC :** 100 × 25 + 60 × 40 = 2 500 + 2 400 = 4 900 minutes contre 4 800 disponibles, soit une charge de 4 900 ÷ 4 800 = 102 %. Même sur le papier, la cellule CNC ne peut pas répondre à la demande.

Le tableau de charge n'utilise que le temps théorique. La réalité est pire. Une étude de temps de deux semaines sur la cellule CNC (journal de poste et données d'état des machines) a montré où les 4 800 minutes étaient passées :

| Utilisation du temps CNC par semaine | Minutes | Part |
|---|---|---|
| Usinage productif de pièces bonnes | 3 600 | 75,0 % |
| Pauses et relève de poste non couvertes (2 postes × 30 min × 5 jours) | 300 | 6,3 % |
| Changements de série (15 par semaine × 30 min) | 450 | 9,4 % |
| En attente : manque de matière, de programmes ou de montages | 250 | 5,2 % |
| Arrêts imprévus | 100 | 2,1 % |
| Pièces usinées ultérieurement mises au rebut au test sous pression | 100 | 2,1 % |
| **Total** | **4 800** | **100 %** |

La capacité effective de la contrainte est donc de 3 600 minutes par semaine, face à une demande de 4 900. L'usine peut satisfaire environ 73 % de la demande (3 600 ÷ 4 900).

Le terrain a confirmé les chiffres : en moyenne 2,5 jours de travail attendaient devant la cellule CNC, tandis que l'assemblage et le test sous pression attendaient régulièrement des pièces. Les superviseurs désignaient l'assemblage comme goulot parce qu'il était « toujours en retard », mais l'assemblage était en retard parce que la cellule CNC le privait de pièces.

### Étape 2a : exploiter par le mix produit

Avec 3 600 minutes effectives, l'usine ne peut pas tout fabriquer. Quels produits doit-elle fabriquer en premier ? Ici, la comptabilité par le débit et la comptabilité des coûts standard donnent des réponses différentes (la section 11 explique la logique en détail).

| | Produit A | Produit B |
|---|---|---|
| Prix | 900 $ | 1 200 $ |
| Coût variable réel (matière) | 400 $ | 450 $ |
| Débit par unité (T) | 500 $ | 750 $ |
| Minutes CNC par unité | 25 | 40 |
| **Débit par minute CNC** | **20,00 $** | **18,75 $** |
| Marge sur coût standard par unité (voir section 11) | 161,20 $ | 280,52 $ |

Le produit B semble plus rentable par unité, quelle que soit la méthode. Mais par minute de contrainte, le produit A rapporte davantage.

- **Mix 1, B d'abord (ce que suggère le rapport de coûts) :** 60 B utilisent 2 400 min ; les 1 200 min restantes produisent 48 A. Débit = 60 × 750 $ + 48 × 500 $ = 45 000 $ + 24 000 $ = **69 000 $**. Bénéfice net = 69 000 $ − 62 000 $ = **7 000 $ par semaine**.
- **Mix 2, A d'abord (débit par minute de contrainte) :** 100 A utilisent 2 500 min ; les 1 100 min restantes produisent 27 B (27 × 40 = 1 080 min). Débit = 100 × 500 $ + 27 × 750 $ = 50 000 $ + 20 250 $ = **70 250 $**. Bénéfice net = 70 250 $ − 62 000 $ = **8 250 $ par semaine**.

Le mix fondé sur la contrainte rapporte 1 250 $ de plus par semaine, soit environ 65 000 $ par an sur 52 semaines, sans aucun investissement. Il change aussi la discussion avec les ventes : les clients du B doivent accepter des délais de livraison plus longs ou un prix qui reflète l'utilisation de la contrainte par le B.

### Étape 2b : Exploiter le temps perdu

L'équipe s'est ensuite attaquée aux pertes relevées dans l'étude de temps :

| Mesure | Coût | Minutes récupérées par semaine |
|---|---|---|
| Pauses décalées ; un opérateur de relève formé maintient la cellule en marche | 1 500 $ par semaine (une partie d'un opérateur de relève) | 300 |
| Préparation du changement d'outil en dehors du temps machine : outils, montages et programmes préparés avant l'arrêt de la machine ; changement de 30 à 18 min | environ 6 000 $ une seule fois pour un préréglage d'outils et des chariots | 180 (15 × 12 min) |
| Matière et programmes préparés un poste à l'avance (une mémoire tampon temporelle, voir section 7) | aucun | 200 |
| Cotes critiques d'alésage contrôlées juste après l'usinage au lieu de l'essai sous pression | jauges, environ 2 500 $ une seule fois | 70 |
| Maintenance préventive déplacée sur la fenêtre planifiée du week-end | aucun | 50 |
| **Total** | | **800** |

La capacité effective passe de 3 600 à 4 400 minutes par semaine, soit une hausse de 22 % (800 ÷ 3 600). Avec le mix 2, l'usine produit désormais 100 A (2 500 min) et 47 B (47 × 40 = 1 880 min, total 4 380 min).

Débit = 100 × 500 $ + 47 × 750 $ = 50 000 $ + 35 250 $ = **85 250 $ par semaine**. Les charges d'exploitation augmentent du coût de l'opérateur de relève : 62 000 $ + 1 500 $ = 63 500 $. Bénéfice net = 85 250 $ − 63 500 $ = **21 750 $ par semaine**, contre 8 250 $ auparavant. Les dépenses ponctuelles d'environ 8 500 $ sont amorties en moins d'une semaine.

C'est le schéma typique de la TOC : comme les charges d'exploitation sont en grande partie fixes à court terme, chaque minute supplémentaire de la contrainte se transforme presque intégralement en bénéfice.

### Étape 3 : Subordonner le reste de l'usine

Pour conserver les 800 minutes, le reste de l'usine a dû évoluer :

- La scie a cessé de couper « pour rester occupée ». Elle ne coupe désormais que ce qu'exige le planning CNC, avec une libération un poste à l'avance (la corde).
- La cellule CNC suit une séquence hebdomadaire fixe qui regroupe les produits par famille de montages ; la scie et l'ébavurage suivent cette séquence.
- La maintenance répond d'abord aux appels de la CNC ; l'objectif de délai de réponse est de 10 minutes.
- Le laboratoire qualité réalise les contrôles de première pièce CNC avant toute autre demande.
- Les responsables de la scie et de l'ébavurage ne sont plus évalués sur le taux d'utilisation. Leur indicateur devient « la CNC n'attend jamais après nous ».

Le taux d'utilisation de la scie passe d'environ 45 % (elle constituait des stocks) à 29 %. C'est voulu. En termes de TOC, le temps d'inactivité de la scie est le prix à payer pour protéger la contrainte.

### Étape 4 : Élever la contrainte

Après l'exploitation, 13 unités de B par semaine restent non satisfaites (60 − 47). Trois options d'élévation :

| Option | Minutes de contrainte supplémentaires | Débit supplémentaire par semaine | Charges d'exploitation supplémentaires par semaine | Effet net par semaine | Commentaire |
|---|---|---|---|---|---|
| Équipe du samedi uniquement sur la cellule CNC (8 h, pourvue par volontariat ou selon les règles d'heures supplémentaires de la convention collective) | 480 | 12 B × 750 $ = 9 000 $ | 1 200 $ de majoration des heures supplémentaires et de soutien | **+7 800 $** | rapide, réversible |
| Sous-traiter l'ébauche du B à un sous-traitant, 180 $ par unité | 13 B n'ont pas besoin des 40 min complètes | 13 × (750 $ − 180 $) = 7 410 $ | coordination, environ 300 $ | **+7 110 $** | T par unité tombe à 570 $ car le coût du sous-traitant est réellement variable |
| Acheter une deuxième machine 5 axes, 650 000 $ | 4 800 | 13 B × 750 $ = 9 750 $ (la demande limite le gain) | 4 000 $ (opérateur, amortissement, maintenance) | **+5 750 $** | retour sur investissement d'environ 650 000 $ ÷ 5 750 $ = 113 semaines, sauf si la demande augmente |

Le poste du samedi l'emporte. La deuxième machine n'a de sens que si les ventes peuvent la remplir, car une fois installée, la contrainte se déplace vers le marché. La vérification financière est simple : l'option augmente-t-elle T moins OE, et de combien par rapport à l'investissement ? La section 11 présente les formules.

### Étape 5 : prévenir l'inertie

Avec le poste du samedi, la cellule CNC dispose de 4 880 minutes effectives, ce qui suffit pour la demande complète de 4 900 moins quelques minutes ; la demande devient alors la limite. Nouvelle répartition de la charge :

| Ressource | Charge à pleine demande | Charge par rapport à la disponibilité |
|---|---|---|
| Cellule CNC (avec le samedi) | 4 900 | environ 100 % du temps effectif |
| Assemblage | 2 700 | 56 % |
| Test sous pression | 1 900 | 40 % |

La contrainte est sur le point de se déplacer vers le marché. Deux pièges d'inertie sont apparus lors de la revue :

1. L'ERP conservait l'ancienne taille de lot minimale de 40 pour B, fixée il y a des années pour économiser les réglages de la CNC. Avec des changements de série plus rapides, cette règle bloquait les délais courts. Le lot a été ramené à 10.
2. Les ventes annonçaient encore six semaines pour B « parce que l'atelier est toujours plein ». Le délai annoncé a été ramené à trois semaines, ce qui a permis de gagner deux nouveaux clients B dans le trimestre.

Retour à l'étape 1 : si les nouveaux clients B font augmenter la demande, la cellule CNC redevient la contrainte et l'option de la deuxième machine fait l'objet d'un nouveau calcul. Cette boucle est le processus d'amélioration continue.

### Ce que l'exemple enseigne

| Enseignement | Preuve dans l'exemple |
|---|---|
| Le goulot visible n'est pas forcément la contrainte | les superviseurs accusaient l'assemblage, qui était en manque de travail |
| L'exploitation vaut mieux que l'investissement | 800 minutes pour 8 500 $ une fois, plus 1 500 $ par semaine, contre 650 000 $ |
| La comptabilité analytique peut mal classer les produits | B semblait meilleur par unité, A rapporte davantage par minute de contrainte |
| Les postes non contraints doivent avoir du temps d'arrêt | la scie est passée d'un taux d'utilisation de 45 % à 29 % |
| Les anciennes règles survivent aux anciennes contraintes | le lot de 40 et le délai de six semaines |

## Analyse des goulots d'étranglement : comment identifier le goulot (six méthodes)

L'analyse des goulots d'étranglement consiste à trouver la ressource qui limite le débit, à mesurer ce que coûte sa production et à vérifier si elle se déplace. C'est l'étape 1 des cinq étapes de concentration, et elle doit être répétée chaque fois que le mix produit, la demande ou le planning de production changent.

Le goulot n'est pas toujours la machine la plus chère, celle qui tombe le plus souvent en panne ou le service dont le superviseur se fait le plus entendre. Utilisez plusieurs méthodes et vérifiez qu'elles concordent.

### Méthode 1 : calcul de la charge de capacité

Pour chaque ressource, comparez le temps que requiert la demande avec le temps disponible.

**Formule :** Charge (%) = Σ (demande par produit × temps de traitement par unité, réglages inclus) ÷ temps disponible × 100

La ressource affichant la charge la plus élevée est le candidat goulot. La section 5 présente le calcul ; la cellule CNC était à 102 % sur la base des temps théoriques. Deux raffinements rendent la méthode fiable :

1. **Utilisez le temps effectif, et non le temps nominal.** Divisez la charge théorique par la part de temps pendant laquelle la ressource produit réellement des pièces bonnes (disponibilité × qualité, ou part productive mesurée). Une ressource à 85 % de charge sur le papier et à 75 % de part productive est en réalité à 113 % (85 ÷ 0,75).
2. **Utilisez le mix produit réel de la période planifiée.** Une ressource peut être le goulot pendant une semaine riche en B et ne plus l'être pendant une semaine riche en A.

Point fort : ne nécessite que les gammes, la demande et un calendrier. Point faible : les gammes sont souvent inexactes, et la méthode ignore la variabilité ainsi que les déplacements de goulot.

### Méthode 2 : observation des files d'attente et des en-cours

Le travail s'accumule devant un goulot, et les ressources situées en aval attendent. Comptez le travail en amont de chaque ressource (en heures de travail, et non en pièces) au même moment sur plusieurs jours. Une ressource dotée d'une file importante et persistante, avec des ressources en aval en manque de travail, est le goulot probable. Attention : une file peut aussi se former devant une ressource alimentée par gros lots ou dont la politique consiste à produire par anticipation.

### Méthode 3 : la marche du goulot

Christoph Roser recommande la marche du goulot comme méthode d'atelier lorsque les données d'état des machines font défaut [15]. Parcourez la ligne plusieurs fois par équipe et notez pour chaque processus s'il travaille, s'il est en manque (il attend des entrées) ou s'il est bloqué (il ne peut pas transmettre le travail). Un processus qui travaille la plupart du temps, avec des processus bloqués en amont et des processus en manque en aval, est le goulot. Répétez sur plusieurs jours pour voir si le goulot se déplace.

| Passage à | Scie | Cellule CNC | Ébavurage | Assemblage | Test |
|---|---|---|---|---|---|
| 07:30 | bloquée | en fonctionnement | en manque | en manque | en fonctionnement |
| 09:00 | en fonctionnement | en fonctionnement | en fonctionnement | en manque | en manque |
| 10:30 | bloquée | en fonctionnement | en manque | en fonctionnement | en manque |
| 13:00 | bloquée | à l'arrêt (outil) | en manque | en manque | en manque |
| Tendance | souvent bloquée | toujours en fonctionnement | souvent en manque | souvent en manque | souvent en manque |

### Méthode 4 : Taux d'utilisation (pourcentage de temps actif)

Les données machine issues d'un MES, d'une plateforme IIoT ou de la commande machine indiquent la part du temps pendant laquelle chaque ressource est active. La ressource ayant la part de temps actif la plus élevée est le candidat goulot. Roser, Nakano et Tanaka appellent cette approche la méthode de la charge de travail et l'utilisent comme comparaison dans leur article de 2001 [13]. Elle est facile à automatiser, mais elle ne tient pas compte de l'ordre dans lequel les ressources s'interrompent mutuellement : deux ressources à 85 pour cent semblent identiques, même si l'une d'elles bloque l'autre.

### Méthode 5 : La méthode des périodes actives

La méthode des périodes actives a été publiée par Roser, Nakano et Tanaka à la Winter Simulation Conference de 2001, puis étendue aux goulots mobiles en 2002 [13][14]. Elle nécessite un journal d'états horodaté pour chaque ressource.

- Les **états actifs** sont les états dans lesquels la ressource peut faire attendre les autres : traitement, mais aussi changement de série, panne, réparation et maintenance [14][15].
- Les **états inactifs** sont les états dans lesquels la ressource attend les autres : en manque (en attente de matière ou de transport) et bloquée [14][15].
- Une **période active** est une séquence ininterrompue d'états actifs [13].
- À tout instant, **la ressource dont la période active ininterrompue est la plus longue est le goulot momentané** [14].
- Lorsque la période active du goulot actuel chevauche celle du goulot précédent ou suivant, le goulot **se déplace** entre les deux ; en dehors des chevauchements, la ressource est le goulot **unique** [14].

**Exemple commenté (deux heures d'un journal de poste fictif) :**

| Ressource | Périodes actives | Périodes inactives |
|---|---|---|
| Scie | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | bloquée entre celles-ci |
| Cellule CNC | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | en manque 09:05–09:15 |
| Assemblage | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | en manque 08:10–08:30 et 09:10–09:40 |

Étape par étape :

1. 08:00–09:05 : la période active de 65 minutes de la cellule CNC est la plus longue, la cellule CNC est donc le goulot momentané.
2. 09:05–09:10 : la cellule CNC est en manque. La plus longue période active à ce moment est celle de l'assemblage (08:30–09:10). L'assemblage est le goulot.
3. 09:10–09:15 : seule la scie est active (09:10–09:30). La scie est le goulot.
4. 09:15–10:00 : la deuxième période de la cellule CNC (45 minutes) est la plus longue. La cellule CNC est le goulot.
5. Chevauchements : la période CNC 08:00–09:05 chevauche la période d'assemblage 08:30–09:10 pendant 35 minutes (08:30–09:05), le goulot passe donc de la CNC à l'assemblage à ce moment. La période de la scie 09:10–09:30 chevauche la période CNC 09:15–10:00 pendant 15 minutes, un passage de la scie à la CNC.

| Ressource | Goulot unique | Goulot mobile | Somme | Part des 120 min (unique / somme) |
|---|---|---|---|---|
| Cellule CNC | 08:00–08:30 et 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50 % / 92 % |
| Assemblage | 09:05–09:10 = 5 min | 35 min | 40 min | 4 % / 33 % |
| Scie | 09:10–09:15 = 5 min | 15 min | 20 min | 4 % / 17 % |

Roser interprète la part unique comme une borne inférieure et la somme comme une borne supérieure de l'effet d'une amélioration : si la cellule CNC est le goulot unique 50 pour cent du temps et le goulot unique ou mobile 92 pour cent du temps, un gain d'une minute à la cellule CNC devrait améliorer la production du système d'environ 0,5 à 0,9 minute [15]. Deux heures de données suffisent seulement à montrer le mécanisme ; une analyse réelle s'appuie sur des semaines de journaux.

À comparer avec la méthode 4 : la cellule CNC a été active 110 minutes sur 120 (92 pour cent), la scie 80 (67 pour cent) et l'assemblage 70 (58 pour cent). Le taux d'utilisation désigne la même ressource ici, mais il classerait la scie devant l'assemblage alors que l'assemblage fait plus souvent partie d'un goulot mobile.

**Origine des données :** états machine du MES, passerelles IIoT lisant le contrôleur, ou journal d'événements d'une simulation à événements discrets. Roser note que la méthode est plus simple avec la simulation ou des systèmes fortement automatisés, et recommande la marche du goulot lorsque ces données manquent [15]. Le guide [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explique comment les usines collectent les états des équipements.

### Méthode 6 : simulation et tests de sensibilité

Un modèle de simulation à événements discrets de la ligne permet de tester directement la question : si chaque ressource reçoit tour à tour 10 % de capacité supplémentaire, quelle modification augmente la production ? La ressource dont l'amélioration accroît le plus la production est la contrainte pour ce mix. La simulation met aussi en évidence les goulots qui se déplacent sous l'effet de la variabilité, que les tableaux de charge statiques ne voient pas. Le guide sur la [simulation de fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explique comment construire un tel modèle.

### Causes courantes des goulots

Une analyse de goulot doit aboutir à une cause, et pas seulement à une localisation. Les causes habituelles dans une usine :

- capacité inférieure à la demande pour le mix de produits actuel (une véritable contrainte de capacité)
- arrêts non planifiés et réparations lentes sur la ressource critique
- changements de série longs combinés à des règles de lots importants
- compétences ou effectifs insuffisants : seules quelques personnes savent conduire ou régler la ressource
- pertes de qualité : rebut et retouches qui consomment deux fois le temps de la contrainte
- famine : matière, outillages, programmes ou travaux amont arrivant en retard
- politiques, telles que des objectifs de taux d'utilisation qui maintiennent les non-contraintes occupées alors que le travail s'accumule au mauvais endroit

La cause détermine la correction. Les cinq premières appellent d'abord l'exploitation (section 4, étape 2), et l'élévation seulement si cela ne suffit pas ; la famine appelle la subordination (étape 3) ; les politiques appellent une modification des règles, souvent avec les processus de réflexion (section 12).

### Quelle méthode, et quand ?

| Méthode | Données nécessaires | Détecte les goulots mobiles | Effort | Usage idéal |
|---|---|---|---|---|
| Charge de capacité | gammes, demande, calendrier | non | faible | premier contrôle, planification, chiffrage |
| Observation des files d'attente | comptages sur le terrain | partiellement | faible | confirmation |
| Parcours du goulot | parcours répétés | partiellement | faible à moyen | usines sans données machines |
| Taux d'utilisation | états des machines | non | faible une fois les données disponibles | tableaux de bord |
| Période active | états horodatés | oui | moyen | lignes automatisées, données MES, simulation |
| Simulation | modèle et données | oui | moyen à élevé | mix élevé, décisions d'investissement |

### Six questions qui révèlent un faux goulot

1. La ressource fonctionne-t-elle réellement pendant tout le temps disponible, ou est-elle souvent en famine ?
2. La file d'attente devant elle est-elle permanente ou seulement due à un lot qui arrive ?
3. Les ressources en aval attendent-elles cette ressource, ou autre chose ?
4. Si elle recevait demain 10 % de capacité en plus, les expéditions augmenteraient-elles ?
5. Le « goulot » est-il occupé par un travail qui n'est pas nécessaire maintenant ?
6. La limite réelle est-elle une règle, comme des tailles de lots minimales ou un schéma de postes fixe ?

## Ordonnancement drum-buffer-rope chiffré

Drum-buffer-rope (DBR) est la méthode TOC d'ordonnancement et de pilotage de la production. Goldratt et Robert E. Fox l'ont décrite dans *The Race* (1986), en s'appuyant sur la métaphore de la troupe de scouts de *The Goal* [3][8]. Le *Theory of Constraints Handbook* décrit la forme actuelle, y compris la gestion des buffers et la classification des flux VATI [9].

- **Drum (tambour) :** le planning de la contrainte. C'est le seul planning détaillé de l'usine qu'il faut tenir à jour.
- **Buffer (tampon) :** des buffers de temps qui protègent le débit de l'usine contre la variabilité. Le DBR traditionnel utilise des buffers au niveau de la contrainte, aux points d'assemblage où les pièces de la contrainte rencontrent celles des non-contraintes, et à l'expédition [6].
- **Rope (corde) :** le mécanisme de lancement. La matière entre dans l'usine un buffer de temps avant son besoin à la contrainte ; lancer plus tôt ne fait qu'augmenter les en-cours [6].

Les buffers en DBR se mesurent en **temps**, et non en pièces [6]. Un buffer de contrainte de 16 heures signifie que la matière est lancée 16 heures ouvrées avant son début planifié à la contrainte.

### Étape 1 : construire le planning du drum

Revenons à l'usine de collecteurs : la cellule CNC est le drum. Son planning pour le mercredi (équipe 1 : 06h00–14h00, équipe 2 : 14h00–22h00), avec les changements de série de 18 minutes de la section 5 :

| Ordre | Produit et quantité | Réglage + marche (min) | Début CNC | Fin CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Mer 06:00 | Mer 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Mer 10:28 | Mer 14:06 |
| 1043 | A × 10 | 268 | Mer 14:06 | Mer 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Mer 18:34 | Mer 21:32 |

La séquence suit la décision de mix produit de la section 5 et la demande hebdomadaire, avec des lots assez petits pour garder des délais courts. Les 28 minutes restantes en fin d'équipe sont consacrées à un contrôle planifié des outils.

### Étape 2 : fixer les buffers

- **Buffer de contrainte :** 16 heures ouvrées (deux équipes). La scie et la manutention demandent moins d'une heure de temps de manipulation par ordre ; le reste protège contre les pannes de scie, les manques de matière et les programmes.
- **Buffer d'expédition :** 16 heures ouvrées après la cellule CNC. L'ébavurage, l'assemblage et le contrôle demandent environ une heure de temps de manipulation par ordre.
- **Zone de buffer physique :** une zone au sol délimitée devant la cellule CNC, dimensionnée pour environ une journée de travail, avec des files FIFO par famille de gabarits. Si la zone déborde, le lancement est en avance sur la corde ; si elle est vide, la cellule CNC est menacée.

Quelle doit être la taille d'un buffer au départ ? Gray, Felan, Umble et Umble notent qu'il existe des règles empiriques, mais que, selon leur expérience, les tailles de buffers sont généralement fixées pour obtenir un système stable, puis ajustées [24] ; la gestion des buffers (section 9) fait cet ajustement. Une valeur de départ souvent citée dans la pratique TOC est environ la moitié du délai actuel pour ce segment [unverified: à confirmer sur votre propre flux]. Dans l'exemple, les pièces attendaient auparavant 2,5 jours devant la cellule CNC ; l'équipe a commencé avec une journée et prévu d'ajuster.

### Étape 3 : tendre la corde

Heure de lancement = début planifié à la contrainte − buffer de contrainte.

| Ordre | Début CNC | Buffer de contrainte | Lancement vers la scie | Date d'expédition (fin CNC + buffer d'expédition) |
|---|---|---|---|---|
| 1041 | Mer 06:00 | 16 h | Mar 06:00 | Jeu 10:28 |
| 1042 | Mer 10:28 | 16 h | Mar 10:28 | Jeu 14:06 |
| 1043 | Mer 14:06 | 16 h | Mar 14:06 | Jeu 18:34 |
| 1044 | Mer 18:34 | 16 h | Mar 18:34 | Jeu 21:32 |

Aucune matière n'est lancée avant son heure de lancement, même si la scie est inactive. C'est ce qui maintient les en-cours et le délai à un niveau bas.

### Étape 4 : faire tourner l'usine selon l'état des buffers

Les non-contraintes ne reçoivent pas de planning détaillé. Elles travaillent selon l'état de leurs buffers (section 9) : les ordres dont le buffer est le plus consommé passent en premier. La cellule CNC suit sa séquence.

### DBR vs. push MRP : ce qui change

| Sujet | Push MRP | DBR |
|---|---|---|
| Lancement | délais planifiés par opération, souvent gonflés | planning de la contrainte moins buffer |
| Plannings détaillés | pour chaque poste de travail | uniquement pour la contrainte |
| En-cours | augmentent quand les délais sont gonflés | limités par la corde |
| Priorités en atelier | listes d'urgence, expédition accélérée | codes couleur de l'état des buffers |
| Réponse à la variabilité | plus de délai, plus d'en-cours | buffers en quelques points, dimensionnés et ajustés |

Le guide [ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/) explique comment le DBR s'intègre à l'ordonnancement à capacité finie et quand un APS apporte de la valeur.

### DBR dans les ateliers d'assemblage (type A)

Dans un atelier de type A, les pièces de la contrainte rencontrent les pièces hors contrainte à l'assemblage. Le DBR traditionnel ajoute un **stock tampon d'assemblage** : les pièces hors contrainte sont lancées de façon à attendre à l'assemblage l'arrivée de la pièce de la contrainte, afin que la production de la contrainte n'attende jamais une pièce manquante [6][9]. Dans l'aéronautique et la construction de machines, où les assemblages comptent des centaines de pièces, c'est souvent là que le DBR apporte le plus de gains ; le guide [planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/) traite de cet environnement.

## Drum-buffer-rope simplifié (S-DBR) pour la fabrication à la commande

Le DBR simplifié (S-DBR) a été développé pour les ateliers en fabrication à la commande, où c'est généralement le marché, et non une ressource interne, qui constitue la contrainte, ou lorsque la contrainte interne n'est pas fortement chargée. Il n'utilise qu'un seul stock tampon, le **stock tampon d'expédition**, et remplace le planning détaillé du tambour par un contrôle de la **charge planifiée** sur la ressource contrainte de capacité (CCR) [6][9].

### Fonctionnement du S-DBR

1. **Stock tampon d'expédition :** chaque commande est lancée un délai tampon fixe avant sa date d'échéance.
2. **Charge planifiée :** l'atelier tient à jour le total cumulé du travail déjà engagé sur la CCR, exprimé en jours.
3. **Annonce de la date d'échéance :** une nouvelle commande reçoit une date d'échéance non antérieure à la date à laquelle la CCR peut la traiter, augmentée d'une partie du stock tampon d'expédition pour le travail situé après la CCR. Une convention courante consiste à prendre la date de charge planifiée plus la moitié du stock tampon d'expédition [unverified: convention courante non sourcée].
4. **La gestion des tampons** fixe les priorités en atelier selon la part du stock tampon d'expédition consommée.

### Exemple détaillé : annoncer une date d'échéance avec le S-DBR

Supposons que l'usine de collecteurs soit passée en fabrication à la commande et que le marché soit la contrainte la plupart des semaines. La cellule CNC est traitée comme CCR avec 4 400 minutes effectives par semaine, soit 880 minutes par jour ouvré.

- Commandes déjà engagées sur la cellule CNC : 3 520 minutes. Charge planifiée = 3 520 ÷ 880 = **4,0 jours ouvrés**.
- Stock tampon d'expédition : **6 jours ouvrés** (le délai total actuel est de 12 jours ; l'équipe part de la moitié).
- Nouvelle commande : 10 unités de B, 40 minutes chacune = 400 minutes = 0,45 jour sur la cellule CNC.

Date d'échéance sûre = aujourd'hui + charge planifiée + temps CNC de la nouvelle commande + moitié du stock tampon d'expédition = 0 + 4,0 + 0,45 + 3,0 = **7,45, soit 8 jours ouvrés**. Date de lancement = date d'échéance − stock tampon d'expédition = jour 8 − 6 = **jour 2**.

Si le service commercial veut promettre 5 jours, le contrôle montre que la commande passerait en tête de file sur la cellule CNC et ferait prendre du retard à d'autres commandes. Cette discussion doit avoir lieu à la saisie de la commande, et non sur l'atelier deux semaines plus tard.

### DBR ou S-DBR ?

| Critère | DBR traditionnel | S-DBR |
|---|---|---|
| Contrainte | interne et fortement chargée | marché, ou interne mais modérément chargée |
| Stocks tampons | contrainte, assemblage, expédition | expédition uniquement |
| Planning de la contrainte | séquencement détaillé | contrôle de la charge planifiée |
| Effort | plus élevé | plus faible |
| Adéquation typique | goulot stable, ateliers de type A ou I | ateliers de fabrication à la commande, forte variété |

## Gestion des tampons : la boucle de rétroaction

La gestion des tampons est la boucle de contrôle et d'amélioration du DBR et du S-DBR [9]. Pour chaque ordre ouvert, l'atelier suit la part de son tampon consommée et la colore en conséquence. Le résumé Wikipédia de la TOC décrit le codage rouge, jaune et vert selon la pénétration dans le tampon [6].

**Formule (pour un ordre qui n'a pas encore atteint le point protégé) :**
Pénétration du tampon (%) = (1 − temps restant avant l'arrivée programmée au point protégé ÷ taille du tampon) × 100

| Zone | Pénétration du tampon | Signification | Réaction |
|---|---|---|---|
| Vert | 0 à 33 % | dans les temps | aucune |
| Jaune | 33 à 67 % | la marge se réduit | vérifier où se trouve l'ordre, préparer une action |
| Rouge | 67 à 100 % | le point protégé risque d'attendre | accélérer : passer l'ordre en tête, corriger la cause |
| Noir (certains ateliers) | au-delà de 100 % | déjà en retard | escalader, informer le client s'il s'agit d'un tampon d'expédition |

La répartition en tiers est une convention, non une loi de la nature.

### Exemple détaillé : état des tampons le mercredi à 06 h 00

Tampon de la contrainte : 16 heures ouvrées. Aucun des quatre ordres n'a encore atteint la cellule CNC au début du poste.

| Ordre | Début programmé sur CNC | Heures ouvrées restantes | Pénétration | Zone | Action |
|---|---|---|---|---|---|
| 1041 | Mer 06 h 00 | 0 | 100 % | rouge/noir | la CNC va attendre ; trouver l'ordre immédiatement |
| 1042 | Mer 10 h 28 | 4,5 | 1 − 4,5 ÷ 16 = 72 % | rouge | accélérer à la scie |
| 1043 | Mer 14 h 06 | 8,1 | 1 − 8,1 ÷ 16 = 49 % | jaune | vérifier l'état |
| 1044 | Mer 18 h 34 | 12,6 | 1 − 12,6 ÷ 16 = 21 % | vert | aucune |

Dans une journée normale, les ordres dus dans les prochaines heures se trouvent déjà dans le tampon devant la cellule CNC. Si l'ordre 1041 n'est pas là à 06 h 00, la cellule CNC est sur le point de perdre du temps.

### Utiliser les données du tampon pour progresser

Consignez la raison chaque fois qu'un ordre passe au rouge : matière manquante, panne de la scie, programme non validé, blocage qualité. Après quelques semaines, un diagramme de Pareto des causes constitue la liste d'amélioration pour les non-contraintes. Deux règles empiriques pour le dimensionnement :

- Si beaucoup d'ordres sont rouges, le tampon est trop petit ou le processus amont trop instable. Corrigez d'abord les principales causes, puis envisagez un tampon plus grand.
- Si presque tous les ordres restent verts, le tampon est trop grand. Réduisez-le par étapes ; les en-cours et les délais de traversée baissent avec lui.

Pour les tampons de stock en distribution, la règle de gestion dynamique des tampons résumée sur Wikipédia consiste à réduire un tampon d'un tiers si le stock reste dans le tiers supérieur pendant un délai de réapprovisionnement complet, et à l'augmenter d'un tiers si le stock reste trop longtemps dans le tiers inférieur [6].

## Physique d'usine derrière la TOC : loi de Little et variabilité

La TOC est parfois enseignée comme une philosophie. Ses règles d'ordonnancement découlent aussi de la théorie des files d'attente.

### Loi de Little

John D. C. Little a démontré en 1961 que, dans un système stable, le nombre moyen d'éléments dans le système est égal au taux d'arrivée multiplié par le temps moyen passé dans le système [16]. En termes d'usine (Hopp et Spearman) [17] :

**En-cours = débit × temps de cycle**, ou **temps de cycle = en-cours ÷ débit**

**Exemple chiffré (usine de collecteurs, avant et après DBR) :**

| | Avant (flux poussé) | Après (DBR) |
|---|---|---|
| En-cours entre la scie et l'expédition | 640 unités | 90 unités |
| Débit | 127 unités par semaine | 147 unités par semaine |
| Temps de cycle = en-cours ÷ débit | 640 ÷ 127 = 5,0 semaines | 90 ÷ 147 = 0,61 semaine, soit environ 3 jours ouvrés |

L'en-cours a baissé parce que la corde a cessé de lancer des ordres de fabrication trop tôt ; le débit a augmenté parce que la contrainte a été exploitée. Le délai de fabrication a diminué de plus de 80 %. La loi de Little signale aussi la limite : si l'en-cours placé devant la contrainte baisse au point de la priver de matière, le débit chute également. C'est pourquoi le DBR maintient un stock tampon au niveau de la contrainte, et nulle part ailleurs.

### Variabilité et taux d'utilisation

L'approximation de Kingman pour un poste unique montre pourquoi les non-contraintes ont besoin de capacité disponible [17][18] :

**Temps d'attente ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

où ca et ce sont les coefficients de variation des arrivées et des temps opératoires, u le taux d'utilisation et te le temps opératoire moyen. Il s'agit d'une approximation pour un poste unique avec des distributions générales d'arrivée et de temps opératoire (G/G/1), et elle est la plus précise à fort taux d'utilisation [17][18].

| Taux d'utilisation u | u ÷ (1 − u) | Temps d'attente avec ca = ce = 1, te = 40 min |
|---|---|---|
| 70 % | 2,3 | 93 min |
| 85 % | 5,7 | 227 min |
| 95 % | 19,0 | 760 min |

De 85 à 95 % d'utilisation, le temps d'attente est multiplié par plus de trois. Une usine qui pousse chaque ressource vers 95 % crée de longues files d'attente partout. La réponse de la TOC consiste à faire fonctionner la contrainte à très haut taux d'utilisation, protégée par un stock tampon délibéré, et à maintenir les non-contraintes nettement en dessous.

## Comptabilité du débit et comptabilité de coûts

La comptabilité du débit est le système de mesure de la TOC. Goldratt a exposé ses trois mesures dans *Le But* et *The Haystack Syndrome* [20] ; *Throughput Accounting* de Thomas Corbett (North River Press) constitue le traitement de référence en livre [21].

### Les trois mesures

| Mesure | Définition (Goldratt, telle que résumée par MAAW) [20] | Définition pratique en usine |
|---|---|---|
| Débit (T) | le taux auquel le système génère de l'argent par les ventes | ventes moins coûts totalement variables, généralement matières premières, pièces achetées, commissions et sous-traitance par unité [6][22] |
| Inventaire (I), souvent appelé plus tard « investissement » | l'argent que le système investit dans l'achat de choses qu'il entend vendre | matières premières, en-cours et produits finis valorisés au coût matière, plus, dans la définition élargie, équipements et bâtiments [22] |
| Charges d'exploitation (OE) | tout l'argent que le système dépense pour transformer l'inventaire en débit | salaires et traitements (y compris la main-d'œuvre directe), loyer, énergie, maintenance, amortissements |

La main-d'œuvre directe fait partie des OE, non du T. C'est la différence clé avec la comptabilité de coûts standard : dans la plupart des usines, la main-d'œuvre ne varie pas à court terme avec chaque unité supplémentaire.

### Mesures dérivées

| Mesure | Formule | Usine de collecteurs après exploitation (hebdomadaire) |
|---|---|---|
| Résultat net (NP) | T − OE | 85 250 $ − 63 500 $ = 21 750 $ |
| Retour sur investissement (ROI) | (T − OE) ÷ I | avec I = 1,2 million de $ : 21 750 $ × 52 ÷ 1 200 000 = 94 % par an |
| Productivité | T ÷ OE | 85 250 $ ÷ 63 500 $ = 1,34 |
| Rotation de l'investissement | T ÷ I | 85 250 $ × 52 ÷ 1 200 000 = 3,7 par an |

Le résumé de Lean Production présente les mêmes mesures dérivées et la priorité de décision de la TOC : augmenter d'abord le débit, puis réduire l'investissement, puis réduire les charges d'exploitation [22]. Le montant de l'investissement, 1,2 million de $, est une hypothèse de l'exemple.

### Règle de décision : débit par unité de contrainte

Lorsqu'une contrainte existe, les produits doivent être classés selon le débit par unité de temps de la contrainte, et non selon la marge par unité. Dans les manuels de comptabilité, c'est la notion familière de « contribution par unité de facteur limitant » ; l'équipe d'examinateurs de l'ACCA décrit la version débit à l'aide du retour par heure d'usine et du ratio de comptabilité du débit (TPAR) [19] :

- **Rendement par heure d'usine** = débit par unité ÷ heures par unité sur le goulot
- **Coût par heure d'usine** = coût total de l'usine ÷ total des heures disponibles sur le goulot
- **TPAR** = rendement par heure d'usine ÷ coût par heure d'usine ; il doit normalement être supérieur à 1 [19].

### Exemple détaillé : coût standard contre comptabilité par débit

La comptabilité analytique standard de l'usine de collecteurs répartit les charges d'exploitation entre les produits selon les minutes de main-d'œuvre standard. Minutes standard budgétées à la demande : A 70 minutes par unité (8 + 25 + 12 + 15 + 10) × 100 unités = 7 000 ; B 97 minutes (10 + 40 + 12 + 20 + 15) × 60 unités = 5 820 ; total 12 820 minutes. Taux d'imputation = 62 000 $ ÷ 12 820 = **4,84 $ par minute standard**.

| | Produit A | Produit B |
|---|---|---|
| Prix | 900,00 $ | 1 200,00 $ |
| Matière | 400,00 $ | 450,00 $ |
| Main-d'œuvre et frais généraux (70 × 4,84 $ ; 97 × 4,84 $) | 338,80 $ | 469,48 $ |
| **Marge standard par unité** | **161,20 $** | **280,52 $** |
| Marge standard en % | 17,9 % | 23,4 % |
| Débit par unité | 500 $ | 750 $ |
| Heures CNC par unité | 0,417 | 0,667 |
| **Rendement par heure CNC** | **1 200 $** | **1 125 $** |

Coût par heure d'usine, en utilisant les charges d'exploitation après exploitation : 63 500 $ ÷ (4 400 ÷ 60 = 73,3 heures CNC) = **865,91 $**. TPAR A = 1 200 ÷ 865,91 = **1,39** ; TPAR B = 1 125 ÷ 865,91 = **1,30**. Les deux produits sont rentables, mais A rapporte davantage par heure de contrainte.

La comptabilité standard recommande de « pousser B » : elle a la marge unitaire la plus élevée, en valeur comme en pourcentage. La comptabilité par débit recommande de « remplir d'abord la contrainte avec A ». La section 5 a montré le résultat : 1 250 $ de bénéfice net hebdomadaire supplémentaire avec le classement par débit. La comptabilité standard n'est pas fausse sur le plan arithmétique. Elle répond à une autre question (le coût complet moyen d'une unité sur une période), et ce n'est pas la question qui se pose pour une décision de mix produit sous contrainte.

### Exemple détaillé : une commande qui n'utilise que la capacité excédentaire

Un client demande 40 plaques d'adaptation par semaine à 260 $ l'unité. La matière coûte 150 $. Les plaques nécessitent la scie (15 minutes), l'ébavurage (10 minutes) et l'assemblage (25 minutes), mais **aucun temps CNC**. Total : 50 minutes standard.

| | Vue du coût standard | Vue par débit |
|---|---|---|
| Matière | 150,00 $ | 150,00 $ |
| Main-d'œuvre et frais généraux (50 × 4,84 $) | 242,00 $ | non imputé par unité : les charges d'exploitation ne changent pas, les ressources ont une capacité excédentaire |
| Marge par unité | 260 − 392 = **−132 $** | T = 260 − 150 = **+110 $** |
| Décision | refuser | accepter |
| Effet sur le bénéfice net hebdomadaire (40 plaques) | | +4 400 $, tant que la scie, l'ébavurage et l'assemblage restent sous leur capacité |

Vérification des charges : scie +600 minutes (à 2 000, 42 %), ébavurage +400 (à 2 320, 48 %), assemblage +1 000 (à 3 700, 77 %). L'assemblage se rapproche de la contrainte, la commande doit donc être acceptée avec une limite de volume et un suivi. Avec la comptabilité standard, l'usine aurait refusé 4 400 $ par semaine.

### Stocks et bénéfice publié

En coûts complets (absorption), les frais généraux sont intégrés aux stocks. Si l'usine de collecteurs fabrique 50 unités supplémentaires de A pour le stock, 50 × 338,80 $ = **16 940 $** de frais généraux de la période passent au bilan au lieu du compte de résultat, et le bénéfice publié augmente d'autant. La trésorerie diminue du montant de matière achetée, soit 50 × 400 $ = 20 000 $. En comptabilité par débit, le bénéfice net ne change pas et les stocks augmentent de 20 000 $. C'est pourquoi les praticiens de la TOC avertissent que constituer des stocks peut faire paraître une usine meilleure sur le papier alors que sa situation de trésorerie et ses délais se dégradent.

Aux États-Unis, l'information financière externe exige d'intégrer les frais généraux de production dans le coût des stocks (coûts complets) : selon l'ASC 330, le coût des stocks correspond à la somme des dépenses et charges engagées directement ou indirectement pour amener un article à son état et à son emplacement actuels, et les frais généraux fixes de production sont affectés aux stocks sur la base de la capacité normale des installations de production [28][29]. Votre contrôleur de gestion décide de la manière dont l'usine l'applique. La comptabilité par débit est donc un outil de décision interne. La plupart des usines qui l'utilisent conservent des états financiers conformes aux GAAP pour la publication externe et réconcilient les deux.

### Ce que le contrôleur de site doit surveiller

| Risque | Pourquoi c'est important | Mesure d'atténuation |
|---|---|---|
| « Réellement variable » défini trop étroitement ou trop largement | T est surestimé ou sous-estimé | convenir d'une liste écrite : matière, pièces achetées, sous-traitance, fret sortant si calculé par unité, commissions commerciales |
| CE traité comme fixe à long terme | les variations importantes de volume modifient bien les CE | revérifier les hypothèses de CE pour les décisions au-delà d'un trimestre |
| Ignorer l'emplacement de la contrainte | le débit par minute de contrainte n'a plus de sens si la contrainte se déplace | recalculer lorsque le tableau de charge change |
| Tarification durablement inférieure au coût complet | la capacité disponible disparaît et les CE doivent augmenter | plafonds de volume, revue chaque trimestre |
| Deux jeux de chiffres | confusion dans les réunions de direction | une seule feuille de réconciliation ; TA pour les décisions, PCGR pour les états financiers |
| Main-d'œuvre réellement variable par unité | la rémunération à la pièce ou la main-d'œuvre intérimaire facturée à l'unité est réellement variable | l'inclure dans le coût réellement variable ; les salaires réguliers restent en CE |

Le guide des [indicateurs de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) couvre la rotation des stocks et d'autres mesures financières et opérationnelles.

## Les processus de réflexion

Les processus de réflexion (PR) sont les outils de la TOC pour les problèmes qui ne sont pas des problèmes de capacité : contraintes de politique, conflits et conduite du changement. Le roman de Goldratt *It's Not Luck* (1994) les a fait connaître d'un large public ; Kim, Mabin et Davies ont passé en revue la littérature de recherche à leur sujet, de 1994, après ce livre, jusqu'au début de 2006, et ont constaté que la TOC s'est développée surtout par la pratique, avec de nombreux domaines d'application et des approches multiméthodes [12].

Les PR répondent à trois questions : que changer, par quoi le remplacer, et comment provoquer le changement.

| Outil | Question | Logique | Résultat |
|---|---|---|---|
| Arbre de réalité actuelle (ARA) | que changer ? | cause et effet (« si ... alors ... ») depuis quelques causes racines vers de nombreux effets indésirables (EI) | le problème central |
| Nuage évaporé (NE), diagramme de résolution de conflit | par quoi le remplacer ? | nécessité (« pour ... nous devons ... ») | l'hypothèse qui, une fois levée, résout le conflit |
| Arbre de réalité future (ARF) | par quoi le remplacer ? | suffisance, avec injections | la solution et ses effets secondaires (branches négatives) |
| Arbre des prérequis (AP) | comment provoquer le changement ? | obstacles et objectifs intermédiaires | la séquence des jalons |
| Arbre de transition (AT) | comment provoquer le changement ? | action, raison, effet | un plan pas à pas |

### Exemple détaillé : nuage évaporé sur la taille de lot

Sur le site de collecteurs, le superviseur CNC et le directeur commercial se disputaient la taille de lot pour B.

| Case | Contenu |
|---|---|
| A (objectif commun) | faire fonctionner une usine rentable |
| B (besoin 1) | bien utiliser la capacité de la cellule CNC |
| C (besoin 2) | livrer rapidement les commandes B |
| D (souhait 1, sert B) | lancer de gros lots de B (40) pour économiser les changements de série |
| D' (souhait 2, sert C) | lancer de petits lots de B (10) |
| Conflit | D et D' ne peuvent pas être réalisés ensemble |

L'hypothèse sous B–D : « les changements de série à la cellule CNC prennent 30 minutes, donc chaque changement supplémentaire coûte 30 minutes de temps de contrainte ». L'injection : réduire le changement à 18 minutes grâce à la préparation externe et regrouper les variantes de B par famille de montages, afin que les petits lots coûtent peu de temps de contrainte. Le nuage « s'évapore » parce que l'hypothèse à l'origine du conflit n'est plus vraie.

### Exemple détaillé : un petit arbre de réalité actuelle

Effets indésirables (EI) relevés par l'équipe de direction : commandes en retard, en-cours élevés, relances fréquentes, heures supplémentaires à l'assemblage, superviseurs se disputant les priorités. Lecture de l'arbre depuis le bas :

1. Si les superviseurs sont évalués sur le taux d'utilisation, alors ils lancent le travail trop tôt pour garder leurs machines occupées.
2. Si le travail est lancé trop tôt, alors les en-cours augmentent et les files d'attente devant la cellule CNC s'allongent.
3. Si les files sont longues, alors la cellule CNC traite ce qui est en tête, et non ce qui est dû.
4. Si la cellule CNC traite les mauvaises commandes, alors les commandes échues sont en retard, et les relances et les heures supplémentaires à l'assemblage suivent.

Problème central : la mesure du taux d'utilisation (une contrainte de politique). La solution n'est pas davantage de capacité mais une autre mesure et une règle de lancement, c'est-à-dire le DBR.

### Bien utiliser les PR

- Commencer par des arbres réduits. Cinq à dix EI suffisent pour un secteur.
- Vérifier chaque flèche : la cause mène-t-elle réellement à l'effet ? Existe-t-il d'autres causes ?
- Travailler en groupe incluant les opérateurs ; ils connaissent les effets que les managers ne voient pas.
- Le nuage évaporé est l'outil le plus simple pour commencer et le plus utile dans les conflits quotidiens.

## TOC vs. lean vs. Six Sigma

La TOC, le lean et le Six Sigma sont souvent présentés comme des concurrents. En pratique, ils répondent à des questions différentes.

| Sujet | Théorie des contraintes | Lean | Six Sigma |
|---|---|---|---|
| Origine | Goldratt, années 1980, Israël et États-Unis [1][3] | Système de production Toyota, Japon | Motorola, années 1980, États-Unis [27] |
| Question centrale | où se trouve le levier ? | où se trouve le gaspillage ? | où se trouve la variation ? |
| Objectif | la contrainte et le débit global | le flux et la valeur pour le client sur tout le flux de valeur | les défauts et la capabilité du processus |
| Outils principaux | cinq étapes de focalisation, DBR, gestion des tampons, comptabilité du débit, processus de réflexion | cartographie du flux de valeur, 5S, SMED, kanban, travail standardisé, kaizen | DMAIC, statistiques, cartes de contrôle, plans d'expériences |
| Vision de la capacité | protéger la capacité excédentaire des non-contraintes | équilibrer au takt, réduire la surcapacité comme gaspillage | pas central |
| Vision des stocks | tampons en quelques points choisis, dans le temps | minimiser partout | pas central |
| Vision financière | débit, stocks, charges d'exploitation | délai de traversée, coût, qualité | coût de la non-qualité |
| Faiblesse typique | une focalisation étroite peut ignorer le gaspillage hors de la contrainte | appliquer les outils partout à la fois | projets choisis sans vision système |

### Comment ils fonctionnent ensemble

1. **La TOC fixe la focalisation.** Les cinq étapes de focalisation choisissent le lieu où une amélioration change le résultat de l'usine.
2. **Le lean exploite la contrainte.** Le SMED réduit les changements de série sur la contrainte, le TPM augmente sa disponibilité, le travail standardisé et les 5S la stabilisent. Voir les guides [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) et [TPM et OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **Le Six Sigma supprime la variation sur la contrainte et en amont.** Les rebuts à la contrainte et un approvisionnement tardif et instable dans son tampon sont de bons projets DMAIC. Voir [Six Sigma et analyse des causes racines](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **La TOC mesure le résultat.** La comptabilité du débit montre ce que chaque projet a apporté à T, I et OE.

### Là où le lean et la TOC divergent réellement

- **Équilibrage des lignes.** Le lean équilibre le contenu de travail au takt. La TOC maintient volontairement les non-contraintes déséquilibrées, avec une capacité de réserve, pour protéger la contrainte. Sur une ligne d'assemblage cadencée au takt, la ligne dans son ensemble joue le rôle de contrainte ; la divergence pèse davantage dans les ateliers à production en petites séries.
- **Tampons.** Le lean considère les stocks comme du gaspillage et les tampons comme une contre-mesure temporaire. La TOC considère un tampon temporel dimensionné à la contrainte comme une protection permanente. Les deux réduisent fortement le volume total en cours par rapport à un système en flux poussé.
- **Mécanismes de tirage.** Le kanban limite les en-cours entre chaque paire de processus ; le DBR les limite entre le lancement et la contrainte, à l'image du CONWIP, que Spearman, Woodruff et Hopp ont proposé comme alternative de tirage au kanban [23]. Voir le guide [kanban et système en flux tiré](https://www.m365.fm/en/learn/kanban-pull-system/).

### TRS à la contrainte

Le TRS (disponibilité × performance × qualité) est le plus utile à la contrainte, où chaque minute perdue coûte du débit. Sur une non-contrainte, un TRS faible peut simplement signifier qu'elle attend, ce qui est normal. Si votre usine publie un seul chiffre de TRS pour l'ensemble des machines, isolez la contrainte.

## Au-delà de l'atelier : chaîne critique et réapprovisionnement

### Gestion de projet par la chaîne critique

Dans *Critical Chain* (1997), Goldratt a appliqué la TOC aux projets [3]. Les idées en bref :

- **La chaîne critique** est la plus longue chaîne de tâches dépendantes, en tenant compte à la fois des dépendances entre tâches et des dépendances entre ressources. Un chemin critique ignore les conflits de ressources.
- **Estimations de tâches agressives.** La marge de sécurité est retirée des tâches individuelles.
- **Tampons agrégés.** La sécurité retirée est regroupée dans un **tampon projet** en fin de projet et dans des **tampons d'alimentation** là où les chaînes non critiques rejoignent la chaîne critique.
- **Gestion par les tampons.** L'avancement est suivi à l'aide d'un graphique de tendance (fever chart) : tampon consommé par rapport à la chaîne réalisée.
- **Pas de multitâche néfaste.** Les ressources terminent une tâche avant d'en commencer une autre.

La comparaison faite par le PMI entre le DBR et la mise en tampon de la chaîne critique décrit la logique commune : les deux protègent la contrainte du système avec des tampons de temps agrégés plutôt qu'avec une sécurité locale à chaque étape [24]. Pour les projets d'outillage, les extensions d'usine et les lancements de nouveaux produits, la chaîne critique est souvent la deuxième application de la TOC après le DBR.

### Réapprovisionnement et distribution

Pour les articles produits sur stock et les pièces de rechange, la TOC remplace les prévisions à chaque emplacement par des tampons réapprovisionnés en fonction de la consommation réelle. Le tampon est dimensionné sur la consommation maximale attendue pendant le délai moyen de réapprovisionnement, auquel s'ajoute une marge pour les approvisionnements peu fiables ; il est ensuite ajusté d'un tiers à la hausse ou à la baisse selon la durée pendant laquelle le stock reste dans la zone rouge ou verte [6]. Le guide [gestion des stocks de fabrication](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) compare cette méthode aux formules classiques de stock de sécurité, et le guide [S&OP et MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) montre sa place dans la planification.

## Modèles pour les travaux TOC

Copiez ces tableaux dans un tableur ou sur un tableau d'atelier. Ils sont volontairement simples.

### Modèle 1 : Fiche d'identification de la contrainte

| Ressource | Charge pilotée par la demande (min/semaine) | Disponible (min/semaine) | Part productive | Charge effective % | File d'attente moyenne devant (heures de travail) | Parcours du goulot : % en marche | Période active : % seul / somme | Verdict |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modèle 2 : Journal des pertes de la contrainte (par poste)

| Date | Poste | Minutes planifiées | Minutes productives | Pause non couverte | Changement de série | En manque | Bloqué | En panne | Rebut/reprise | Remarques |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Modèle 3 : Mix produit par throughput par minute de contrainte

| Produit | Prix | Coût variable réel | T par unité | Minutes de contrainte par unité | T par minute de contrainte | Demande | Rang | Quantité planifiée |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modèle 4 : Tableau de suivi des tampons

| Commande | Point protégé (contrainte / assemblage / expédition) | Échéance au point protégé | Taille du tampon (h) | Restant (h) | Pénétration % | Zone | Emplacement actuel | Responsable |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modèle 5 : Journal des causes des commandes en zone rouge

| Date | Commande | Zone atteinte | Catégorie de cause (matière, machine, qualité, programme, personnel, autre) | Détail de la cause | Minutes perdues à la contrainte | Action corrective | Responsable |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modèle 6 : Fiche de décision d'élévation

| Option | Minutes de contrainte supplémentaires/semaine | Δ T par semaine | Δ OE par semaine | Δ I (ponctuel) | Δ NP par semaine (ΔT − ΔOE) | Délai de retour en semaines (ΔI ÷ ΔNP) | Où va la contrainte ensuite ? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modèle 7 : Nuage évaporé

| A : objectif commun | B : besoin 1 | C : besoin 2 | D : souhait au service de B | D' : souhait au service de C | Hypothèses B–D | Hypothèses C–D' | Hypothèses D vs. D' | Injection |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modèle 8 : Réunion quotidienne de contrainte (10 minutes, à la contrainte)

| Minute | Sujet | Données |
|---|---|---|
| 0–2 | hier : minutes productives vs. plan, principale perte | Modèle 2 |
| 2–5 | tampon : commandes rouges et jaunes, qui agit | Modèle 4 |
| 5–8 | causes des rouges, actions correctives en cours | Modèle 5 |
| 8–10 | aujourd'hui : séquence, effectifs, fenêtre de maintenance | planning du tambour |

Le guide [management de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/) montre comment intégrer une telle réunion dans des réunions à plusieurs niveaux.

## Feuille de route de mise en œuvre : les six premiers mois

La feuille de route ci-dessous s'applique à une seule usine ou à un seul flux de valeur. Elle suppose une contrainte physique à l'intérieur de l'usine ; si l'analyse du mois 1 montre que le marché est la contrainte, passez directement à S-DBR et au volet commercial.

| Phase | Semaines | Objectifs | Activités clés | Critères de sortie |
|---|---|---|---|---|
| 0. Préparer | 1–2 | compréhension commune | la direction lit *Le But* ou organise une simulation de jeu TOC ; définir l'objectif et les indicateurs (T, I, OE) ; associer dès le début les représentants syndicaux ou du personnel | sponsor désigné, équipe centrale constituée, indicateurs convenus |
| 1. Identifier | 3–6 | trouver la contrainte grâce aux données | tableau de charge (Méthode 1), comptage des files d'attente, parcours des goulots, données machines ou analyse par périodes actives si disponibles | contrainte validée par les données et par l'atelier |
| 2. Exploiter | 5–12 | récupérer le temps perdu sur la contrainte | journal des pertes de la contrainte, pauses de couverture, préparation externe, qualité avant et après la contrainte, priorité de maintenance, mix produits par T par minute de contrainte | minutes productives en hausse, Pareto des pertes en service |
| 3. Subordonner | 9–16 | protéger la contrainte, réduire les en-cours | essai DBR ou S-DBR : planning en tambour, stocks tampons, règle de lancement par corde ; suppression des objectifs de taux d'utilisation aux non-contraintes | règle de lancement appliquée au quotidien, en-cours en baisse |
| 4. Gestion des tampons | 12–20 | pilotage quotidien et apprentissage | tableau de suivi des tampons, journal des causes des commandes en rouge, réunion quotidienne de 10 minutes sur la contrainte, premier ajustement de la taille des tampons | moins de commandes en rouge, causes en cours de correction |
| 5. Mesurer et décider | 16–24 | la finance au cœur des décisions | vue de la comptabilité par débit pour les décisions de mix et de commandes, rapprochement avec la comptabilité de coûts standard | comptabilité par débit utilisée dans au moins une décision réelle |
| 6. Élever et revoir | 20–26 | ajouter des capacités uniquement lorsque c'est justifié ; détecter l'inertie | fiche de décision d'élévation (Modèle 6), revue des gammes, règles de lots, règles de chiffrage | emplacement de la contrainte revérifié, cycle suivant planifié |

### Rôles

| Rôle | Responsabilité |
|---|---|
| Sponsor (directeur d'usine) | objectif, indicateurs, suppression des contraintes de politique comme les objectifs de taux d'utilisation |
| Responsable de la contrainte (superviseur de la contrainte) | minutes productives quotidiennes, journal des pertes, réunion sur la contrainte |
| Planificateur ou ordonnanceur | planning en tambour, lancement, tailles des tampons, chiffrage des dates de livraison |
| Contrôleur de gestion de l'usine | définitions de T, I, OE ; décisions de mix produits et de commandes ; rapprochement |
| Responsable maintenance | délai d'intervention sur la contrainte, fenêtres de maintenance planifiée |
| Responsable qualité | contrôles avant et après la contrainte, causes des commandes en rouge liées à la qualité |
| Opérateurs sur et autour de la contrainte | causes des pertes, amélioration des préparations, idées ; ils portent les actions correctives |

### Critères de choix de la zone pilote

Choisissez un flux de valeur où (1) une contrainte unique est clairement visible, (2) le délai de livraison ou le délai de production pénalise les clients, (3) le superviseur est volontaire, et (4) des données existent ou peuvent être relevées à la main pendant quelques semaines. Le guide [cartographie du flux de valeur](https://www.m365.fm/en/learn/value-stream-mapping/) montre comment cartographier le flux et repérer où se situe la contrainte dans le flux de valeur.

## Indicateurs KPI TOC : comment mesurer les progrès

| KPI | Formule | Niveau | Fréquence | Commentaire |
|---|---|---|---|---|
| Débit (T) | ventes − coût réellement variable | usine | hebdomadaire, mensuel | l'indicateur principal de l'objectif |
| Charges d'exploitation (OE) | toutes les autres dépenses | usine | mensuel | doit croître moins vite que T |
| Stock/investissement (I) | valeur matière du stock et des en-cours (plus les actifs dans la vue élargie) | usine | mensuel | la part des en-cours doit baisser avec le DBR |
| Bénéfice net | T − OE | usine | mensuel | |
| ROI | (T − OE) ÷ I | usine | trimestriel | |
| Minutes productives du goulot | minutes de pièces bonnes au goulot ÷ minutes disponibles | goulot | par équipe | le rythme quotidien |
| Respect du planning du goulot | ordres lancés dans la fenêtre planifiée ÷ ordres planifiés | goulot | quotidien | montre si le tambour tient |
| Part des ordres rouges | ordres rouges ÷ ordres ouverts | tampon | quotidien | trop élevée : tampon trop petit ou processus instable |
| Respect des dates de livraison | ordres expédiés à la date promise ou avant ÷ ordres expédiés | client | hebdomadaire | le résultat le plus visible |
| Délai de traversée | du lancement à l'expédition, médiane et 90e percentile | flux de valeur | hebdomadaire | vérifier avec la loi de Little |
| En-cours en jours | en-cours ÷ débit quotidien moyen | flux de valeur | hebdomadaire | |
| Throughput-dollar-days (TDD) | Σ (valeur T de l'ordre en retard × jours de retard) | responsabilité | hebdomadaire | une mesure TOC des « choses qui auraient dû être faites » ; origine dans les travaux de mesure de Goldratt [unverified: source à confirmer] |
| Inventory-dollar-days (IDD) | Σ (valeur du stock × jours de détention) | responsabilité | hebdomadaire | mesure les « choses qui n'auraient pas dû être faites » [unverified: source à confirmer] |

Deux règles pour le tableau de bord KPI : afficher les indicateurs du goulot au niveau du goulot, et ne pas présenter le taux d'utilisation des non-goulots comme objectif de performance. Le guide sur les [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) définit les KPI de production standard qui accompagnent ceux-ci.

## Erreurs courantes

| Erreur | Pourquoi elle fait mal | Mieux |
|---|---|---|
| Choisir le goulot au feeling | le problème visible est souvent un symptôme (l'assemblage était en manque) | tableau de charge plus contrôle au sol, données de période active si disponibles |
| Passer directement à l'étape 4 | de l'argent dépensé alors que le goulot perd encore 20 à 25 % de son temps | exploiter et subordonner d'abord |
| Garder des objectifs d'utilisation sur les non-goulots | lancements anticipés, plus d'en-cours, le goulot exécute le mauvais travail | mesurer les non-goulots sur « le goulot n'attend jamais après nous » |
| Lancer le travail en avance « par sécurité » | les en-cours et les délais augmentent ; les priorités se perdent | lancement strict par la corde |
| Tampons fixés une fois pour toutes et oubliés | trop grands : les en-cours restent élevés ; trop petits : rouges permanents | ajuster à partir des données d'ordres rouges |
| Aucun contrôle qualité avant le goulot | le goulot usine des pièces déjà au rebut | inspection ou poka-yoke avant le goulot |
| Rebuts découverts loin en aval | le temps du goulot est gaspillé sans bruit | contrôler les caractéristiques critiques juste après le goulot |
| Ignorer la contrainte de marché | une usine avec de la capacité disponible partout continue d'« optimiser » les machines | S-DBR, offres sur délais de traversée, implication des ventes |
| Choisir la gamme par marge unitaire | moins de bénéfice avec la même capacité | classer par T par minute de goulot |
| Deux systèmes de priorité concurrents | listes urgentes et couleurs de tampon se contredisent | une seule règle : le statut du tampon |
| Le goulot se déplace, les règles restent | anciennes tailles de lots et anciens devis bloquent le gain suivant | revue de l'étape 5 à chaque cycle |
| Opérateurs du goulot laissés à l'écart | les personnes qui voient les pertes ne sont pas consultées | les opérateurs sont responsables des causes de pertes et des contre-mesures |

## Critiques et limites de la théorie des contraintes

La TOC (théorie des contraintes) a de solides résultats pratiques et un soutien plus faible dans la recherche. Un guide sérieux doit couvrir les deux.

### 1. Données probantes : cas de réussite et biais de publication

Mabin et Balderstone ont analysé plus de 80 applications réussies de la TOC publiées et ont constaté des améliorations opérationnelles et financières significatives ; malgré des recherches approfondies, ils n'ont trouvé aucun rapport d'échec [10]. C'est un avertissement autant qu'une approbation. Les cas publiés sont rédigés par des consultants, des éditeurs de logiciels et des entreprises enthousiastes ; les mises en œuvre ratées figurent rarement dans la presse. Gupta et Snyder (2009) ont soutenu que la TOC n'avait pas encore démontré son efficacité dans la littérature académique et ont appelé à des études reliant la mise en œuvre à la performance financière, comme résumé sur Wikipedia [6]. L'enquête de Panizzolo menée auprès de 61 usines européennes a montré que certaines pratiques de la TOC, en particulier la DBR, les non-contraintes disposant d'une capacité excédentaire et un plan directeur basé sur la contrainte, étaient liées à une meilleure performance, mais les résultats variaient selon les pays et reposaient sur les évaluations personnelles des managers [11].

### 2. Optimalité et recherche sur l'ordonnancement

Les chercheurs en recherche opérationnelle ont critiqué les heuristiques de la TOC comme n'étant pas optimales. Trietsch a soutenu que la DBR est inférieure aux méthodes concurrentes, et Linhares (2009) a soutenu que la règle de la TOC pour le choix de la gamme de production (classer par débit par unité de contrainte) ne peut pas garantir des résultats optimaux en général, car le problème de la composition de la production avec plusieurs contraintes est algorithmiquement difficile [6]. La leçon pratique : la règle « T par minute de contrainte » est fiable avec une seule contrainte claire. Avec deux contraintes ou plus en interaction, utilisez la programmation linéaire ou un APS.

### 3. Originalité

Les critiques ont souligné que de nombreuses idées de la TOC existaient déjà : la contribution par facteur limitant en comptabilité de gestion (Noreen, Smith et Mackey, 1995), des éléments de la dynamique des systèmes et de la maîtrise statistique des procédés, la méthode PERT/CPM en gestion de projet [6]. Goldratt lui-même a reconnu des travaux antérieurs, en particulier le Système de production Toyota et les idées de flux de Ford, dans son article de 2009 « Standing on the Shoulders of Giants » [6]. Pour un praticien, l'originalité compte moins que le fait que la combinaison fonctionne ; pour un étudiant, il vaut la peine de savoir d'où viennent les différents éléments.

### 4. Personnes et politique

Nave (2002) a soutenu que la TOC tend à ignorer les employés et ne traite pas les politiques inefficaces comme des contraintes, comme résumé sur Wikipedia [6]. En pratique, le risque est que « subordonner » soit compris comme « obéir », et que les opérateurs de la contrainte supportent toute la pression. La section 20 traite de ce point.

### 5. Là où la TOC s'adapte moins bien

- **Lignes équilibrées et cadencées** avec takt et peu de variabilité : la ligne elle-même est la contrainte, et l'équilibrage de ligne en Lean est le meilleur outil.
- **Goulots très mobiles** dans les ateliers à forte variété : un seul tambour est difficile à définir. La S-DBR, la maîtrise de la charge ou un APS conviennent mieux.
- **Usines où le marché est la contrainte** pendant des années : la DBR interne apporte peu ; le levier se situe dans les ventes, le délai de livraison et la conception des offres.
- **Maturité de la mesure :** la comptabilité du débit exige une équipe financière prête à tenir une seconde vue. Sans cela, les décisions reviennent au coût standard.

### 6. Contexte commercial

Une grande partie de la littérature sur la TOC est publiée par North River Press et par des cabinets de conseil fondés par Goldratt ou ses associés. Cela ne rend pas ces travaux faux, mais cela signifie que de nombreuses sources ne sont pas indépendantes. Ce guide s'appuie sur des sources évaluées par des pairs lorsqu'elles existent et signale comme tels les affirmations de praticiens (comme le chiffre de « 30 % de capacité cachée » avancé par le TOC Institute) [4].

## Les personnes et la sécurité au niveau de la contrainte

La TOC peut améliorer ou dégrader le travail des personnes situées au niveau de la contrainte. La méthode elle-même est neutre ; c'est la manière dont elle est introduite qui fait la différence.

### Ce que les opérateurs remarquent en premier

- **Plus d'attention :** les responsables s'intéressent soudain à chaque minute passée sur une seule machine. Cela peut ressembler à un contrôle. Expliquez pourquoi, et laissez les opérateurs consigner eux-mêmes les pertes.
- **Pauses :** « pauses de couverture » signifie qu'un opérateur de relève fait tourner la machine, jamais que les personnes sautent leurs pauses.
- **Temps d'inactivité ailleurs :** les opérateurs des postes non contraints peuvent craindre pour leur emploi lorsqu'on leur demande de ne pas constituer de stocks. Précisez que la capacité excédentaire est intentionnelle et utilisez-la pour la formation, l'amélioration des changements de série, les 5S, la polyvalence sur la contrainte et le travail sur la qualité.
- **Reconnaissance :** les améliorations de l'équipe de la contrainte (comme le passage d'un changement de série de 30 à 18 minutes) doivent être visibles sur le tableau, avec les noms si les intéressés sont d'accord.

### Les règles de sécurité ne fléchissent pas pour la contrainte

La pression pour maintenir la contrainte en marche ne doit jamais conduire à des raccourcis sur la sécurité. Les interventions de maintenance et d'entretien sur les machines où une remise sous tension inopinée peut blesser des personnes relèvent de la norme de l'OSHA sur le contrôle des énergies dangereuses (consignation et étiquetage, 29 CFR 1910.147) [25]. Des changements de série plus rapides doivent être conçus dans la procédure (fixations à dégagement rapide, outils préréglés, matières préparées par étapes), et non obtenus en sautant la consignation. Il en va de même pour les protections et l'ergonomie : un opérateur de relève doit recevoir la même formation et la même qualification que l'opérateur habituel.

### Contexte syndical et social

Dans les usines syndiquées, les pauses décalées, les opérateurs de relève, les équipes du samedi et les changements de mesure touchent souvent à la convention collective. Associez le syndicat ou les représentants du personnel dès la phase 0 de la feuille de route, expliquez l'objectif et convenez de la manière dont les heures supplémentaires et les rôles de relève sont attribués. Un déploiement de la TOC qui commence par un grief sur les horaires de pause perd des mois.

### Le respect des personnes dans les termes de la TOC

Le nuage d'évaporation (section 12) est un outil pratique de respect des personnes : il part du principe que les deux parties d'un conflit ont un besoin légitime et cherche l'hypothèse erronée qui se cache derrière le conflit. Utilisé dans une équipe qui inclut des opérateurs, il transforme « opérateurs contre planificateurs » en un problème commun avec un objectif partagé.

## TOC dans l'usine numérique : données, simulation et APS

La TOC est née avec un logiciel : l'OPT était un programme d'ordonnancement avant d'être une philosophie [3]. Aujourd'hui, les outils numériques apportent leur aide à quatre niveaux.

### 1. Données pour la détection des goulots

Les plateformes MES et IIoT fournissent les états horodatés des machines dont la méthode des périodes actives a besoin (Section 6). La plupart des usines disposent déjà des états (en marche, à l'arrêt, en panne, en réglage) mais ne distinguent pas « en attente de matière » et « bloqué » de « à l'arrêt ». Ajouter ces deux états est souvent le changement unique le plus utile pour l'analyse TOC. Convenez avec les opérateurs et, le cas échéant, avec le syndicat que les données d'état des machines servent à identifier les pertes du système, et non à évaluer des individus. Collectez les données en lecture seule depuis les automates et maintenez le réseau OT segmenté ; le guide [cybersécurité OT et ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explique comment procéder. Vérifiez que les horloges sont synchronisées entre les machines, car la méthode des périodes actives compare les horodatages entre les ressources. Les guides [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) et [maintenance prédictive et IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) décrivent le cheminement des données ; le guide [IT industrielle avec Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) traite de l'analyse dans le cloud pour ces données.

### 2. Simulation pour les goulots mobiles et le dimensionnement des tampons

Une simulation à événements discrets vous permet de tester la taille des tampons, les règles de lancement et les options d'élévation avant de modifier l'atelier. Roser, Nakano et Tanaka ont développé la méthode des périodes actives à partir de données de simulation [13][14]. Questions typiques : à quelle fréquence le goulot se déplace-t-il avec le mix du trimestre prochain ? Quelle doit être la taille du tampon de contrainte pour que la part des commandes urgentes reste sous 10 % ? Une deuxième machine déplace-t-elle la contrainte vers l'assemblage ? Le guide [jumeau numérique en fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/) explique quand un modèle de simulation devient un jumeau numérique.

### 3. APS pour l'ordonnancement par tambour

Un APS peut ordonnancer le tambour avec des réglages dépendant de la séquence, calculer les dates de lancement à partir des tampons et afficher l'état des tampons. La DBR fournit la logique de pilotage ; l'APS apporte la puissance de calcul, en particulier lorsque la contrainte se déplace ou que plusieurs contraintes interagissent (là où la règle simple du mix produit échoue, voir Section 19). Le guide [ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/) traite le sujet en profondeur, y compris dans les cas où l'ERP suffit.

### 4. Modèles de chaîne de valeur pour la vision système

Un modèle numérique de chaîne de valeur montre la contrainte dans le contexte de l'ensemble du flux : temps de cycle, disponibilité, tailles de lots et stocks. Un exemple de tel logiciel est iFAKT Polaris, qui combine modélisation de chaîne de valeur et simulation ; selon le fournisseur, ses modules incluent l'optimisation de l'ordonnancement [26]. Il s'agit d'une description du fournisseur, non d'un test indépendant. **Note : l'auteur travaille chez iFAKT GmbH.** Le guide [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) le décrit plus en détail ; d'autres outils de chaîne de valeur et de simulation peuvent réaliser la même analyse TOC.

### Séquence : la méthode d'abord, puis le logiciel

Commencez le journal des pertes de contrainte et le tableau des tampons sur papier ou dans un tableur. Automatisez une fois la méthode éprouvée et les chiffres acceptés par les équipes. Un écran d'état des tampons que personne n'utilise vaut moins qu'un tableau blanc qui anime la réunion quotidienne.

## Glossaire

| Terme | Définition |
|---|---|
| Période active | une suite ininterrompue d'états actifs d'une ressource ; base de la méthode des périodes actives [13] |
| Méthode des périodes actives | méthode de détection des goulots : à tout instant, la ressource ayant la période active ininterrompue la plus longue est le goulot [13][14] |
| Tampon d'assemblage | tampon temporel qui fait attendre au montage les pièces non contraintes, dans l'attente de la pièce contrainte |
| Goulot | une ressource dont la capacité est inférieure à la demande qui lui est adressée |
| Parcours du goulot | méthode d'atelier consistant à relever les états de travail, de famine et de blocage lors de rondes répétées [15] |
| Gestion par les tampons | suivi de la consommation des tampons par zones de couleur pour fixer les priorités et trouver les causes d'amélioration [9] |
| Pénétration du tampon | part d'un tampon temporel déjà consommée |
| Ressource à capacité contrainte (CCR) | une ressource proche de sa capacité qui peut devenir la contrainte si elle n'est pas gérée |
| Contrainte | tout élément qui limite la performance d'un système vis-à-vis de son objectif |
| Tampon de contrainte | tampon temporel placé en amont de la contrainte |
| CONWIP | constant work in process (en-cours constant) ; système en tirage qui limite le total des en-cours d'une ligne [23] |
| Chaîne critique | la plus longue chaîne de tâches dépendantes, compte tenu des dépendances entre tâches et ressources |
| Arbre de la réalité actuelle (CRT) | outil de la démarche de réflexion reliant les effets indésirables à leurs causes racines |
| Tambour | le planning de la contrainte, qui fixe le rythme de l'usine |
| Tambour-tampon-corde (DBR) | méthode de planification TOC : planifier la contrainte, la protéger par des tampons temporels, lancer au rythme de celle-ci [6][8] |
| Élever | étape 4 : ajouter de la capacité au niveau de la contrainte |
| Nuage évaporant (EC) | outil de la démarche de réflexion pour résoudre un conflit en remettant en cause une hypothèse |
| Exploiter | étape 2 : tirer le maximum de la contrainte avec les ressources existantes |
| Tampon d'alimentation | dans la chaîne critique, tampon à l'endroit où une chaîne non critique rejoint la chaîne critique |
| Cinq étapes de focalisation | identifier, exploiter, subordonner, élever, éviter l'inertie [4] |
| Arbre de la réalité future (FRT) | outil de la démarche de réflexion pour tester une solution et ses effets secondaires |
| Inertie | règles et habitudes qui survivent à la contrainte pour laquelle elles avaient été créées |
| Inventaire/investissement (I) | argent immobilisé dans ce que le système entend vendre (et, au sens large, dans les actifs) [20] |
| Loi de Little | WIP = débit × temps de cycle [16] |
| Charges d'exploitation (OE) | toutes les dépenses engagées pour transformer l'inventaire en débit [20] |
| Charge planifiée | dans le S-DBR, le travail engagé sur la CCR exprimé en temps |
| POOGI | processus d'amélioration continue ; les cinq étapes de focalisation sous forme de cycle |
| Arbre des prérequis (PRT) | outil de la démarche de réflexion listant les obstacles et les objectifs intermédiaires |
| Tampon projet | dans la chaîne critique, le temps de sécurité agrégé à la fin d'un projet |
| Corde | le mécanisme de lancement reliant la mise en fabrication au planning de la contrainte |
| S-DBR (tambour-tampon-corde simplifié) | variante du DBR avec un tampon d'expédition et un contrôle de la charge planifiée, pour la fabrication à la commande [6][9] |
| Goulot mobile | goulot qui se déplace d'une ressource à l'autre au fil du temps [14] |
| Tampon d'expédition | tampon temporel protégeant la date de livraison |
| Subordonner | étape 3 : aligner tous les non-contraints sur la contrainte |
| Débit (T) | vitesse à laquelle le système génère de l'argent par les ventes : ventes moins coût réellement variable [20] |
| Comptabilité par le débit | comptabilité de gestion fondée sur T, I et OE |
| Ratio de comptabilité par le débit (TPAR) | rendement par heure d'usine ÷ coût par heure d'usine [19] |
| Arbre de transition (TrT) | outil de la démarche de réflexion pour une mise en œuvre pas à pas |
| TOCICO | Theory of Constraints International Certification Organization, organisme à but non lucratif de droit américain 501(c)(3) [5] |
| Effet indésirable (UDE) | effet négatif observé, utilisé comme donnée d'entrée d'un arbre de la réalité actuelle |
| VATI | classification des usines selon la forme du flux de matière : V, A, T, I [6] |

## FAQ : questions sur la théorie des contraintes

### Qu'est-ce que la théorie des contraintes, en termes simples ?

Tout système comporte un ou quelques maillons faibles qui limitent sa capacité de production. La théorie des contraintes consiste à identifier ce maillon faible, à en tirer le maximum, à aligner tout le reste sur lui, et seulement ensuite à investir dans celui-ci. Elle a été développée par Eliyahu M. Goldratt et présentée dans *The Goal* en 1984 [1].

### Quelles sont les 5 étapes de la théorie des contraintes ?

Identifier la contrainte, exploiter la contrainte, subordonner tout le reste à la contrainte, élever la contrainte, et empêcher l'inertie de devenir la contrainte, puis recommencer [4].

### Quel est un exemple de théorie des contraintes ?

Dans l'usine de collecteurs décrite à la section 5, une cellule CNC limitait la production. En couvrant les pauses, en accélérant les changements de série, en organisant l'approvisionnement par étapes et en avançant les contrôles qualité, son temps productif a augmenté de 800 minutes par semaine (22 %). Modifier l'assortiment de produits selon le débit par minute de contrainte a accru le bénéfice sans investissement. Une seconde machine à 650 000 $ s'est révélée être l'option la plus faible.

### Quelle est la différence entre un goulot d'étranglement et une contrainte ?

Un goulot d'étranglement est une ressource dont la capacité est inférieure à la demande qui lui est adressée. Une contrainte est tout ce qui limite l'objectif du système : un goulot d'étranglement, mais aussi le marché, une matière, une politique ou un état d'esprit. Tout goulot d'étranglement qui limite la production est une contrainte ; toute contrainte n'est pas un goulot d'étranglement.

### Comment identifier un goulot d'étranglement dans un processus ?

Commencez par un tableau de charge de capacité (demande × temps de process par rapport au temps disponible), puis confirmez sur le terrain avec le comptage des files d'attente et une visite du goulot. Si vous disposez d'états horodatés des machines, utilisez la méthode des périodes actives, qui fait aussi apparaître les goulots mobiles [13][14][15]. La section 6 compare six méthodes.

### Qu'est-ce que l'analyse de goulot d'étranglement ?

L'analyse de goulot d'étranglement identifie la ressource qui limite un processus, quantifie la production qu'elle coûte et vérifie si elle se déplace dans le temps. Dans une usine, commencez par un calcul de charge de capacité, confirmez-le par le comptage des files d'attente et une visite du goulot, et utilisez les données d'état des machines avec la méthode des périodes actives lorsque vous les avez (section 6).

### Comment corriger un goulot d'étranglement ?

Suivez les cinq étapes de focalisation. Commencez par l'exploiter (aucune minute perdue, aucun travail défectueux, le bon assortiment de produits), puis subordonnez le reste de l'usine à son rythme, et seulement ensuite élevez-le par des heures supplémentaires, de la sous-traitance ou de nouveaux équipements. Dans l'exemple des collecteurs de la section 5, la seule exploitation a augmenté le temps productif à la contrainte de 22 % avant tout investissement.

### Que sont les contraintes de production ?

Tout ce qui limite la quantité qu'une usine peut produire et expédier : la capacité des équipements, les personnes et leurs compétences, les matières et les fournisseurs, le marché, et les politiques propres à l'usine, comme les règles de taille de lot ou de taux d'utilisation. Une contrainte de production n'est pas toujours une machine (section 3).

### Quels sont les quatre types de contraintes ?

Les listes varient. Regroupées en quatre, les catégories de la section 3 sont les contraintes physiques (équipements, personnes, matières), les contraintes de marché, les contraintes de politique et les contraintes de paradigme. Le tableau de la section 3 découpe la catégorie physique en trois, ce qui donne six.

### Qu'est-ce que le drum-buffer-rope ?

Le drum-buffer-rope est la méthode d'ordonnancement de la TOC. Le drum (tambour) est le planning de la contrainte, le buffer (tampon) est un tampon temporel qui protège la contrainte et la date d'expédition, et la rope (corde) ne libère les matières qu'un temps de tampon avant que la contrainte en ait besoin [6][8]. La section 7 présente un planning de libération chiffré.

### Qu'est-ce que le drum-buffer-rope simplifié (S-DBR) ?

Le S-DBR est une variante destinée aux ateliers en production à la commande. Il n'utilise qu'un tampon d'expédition et vérifie la charge planifiée sur la ressource à capacité contrainte au moment où les dates de livraison sont promises, au lieu de tenir un planning détaillé de la contrainte [6][9].

### Qu'est-ce que la gestion des tampons ?

La gestion des tampons suit la part du tampon temporel de chaque commande qui a été consommée et classe les commandes en vert, jaune ou rouge. Les commandes rouges sont traitées en priorité, et les causes des commandes rouges deviennent la liste des améliorations [9].

### Qu'est-ce que la comptabilité par le débit ?

La comptabilité par le débit est la comptabilité de gestion de la TOC. Elle utilise le débit (chiffre d'affaires moins les coûts variables réellement variables), l'inventaire ou l'investissement, et les charges d'exploitation ; le résultat net est T − OE et le ROI est (T − OE) ÷ I [20][22]. En présence d'une contrainte, elle classe les produits selon le débit par minute de contrainte.

### En quoi la comptabilité par le débit diffère-t-elle de la comptabilité analytique ?

La comptabilité analytique standard répartit la main-d'œuvre et les frais généraux sur les unités et classe les produits selon leur marge unitaire. La comptabilité par le débit traite la main-d'œuvre et les frais généraux comme des charges d'exploitation, qui ne varient pas avec chaque unité à court terme, et classe les produits selon le débit par unité de temps de la contrainte. Les deux méthodes peuvent donner des réponses opposées, comme le montre l'exemple de la section 11.

### Quelle est la différence entre le lean et la théorie des contraintes ?

Le lean recherche le gaspillage sur l'ensemble de la chaîne de valeur et crée le flux et la tirée. La TOC recherche la contrainte unique et concentre l'amélioration sur ce point. Le lean équilibre le travail sur le takt ; la TOC conserve une capacité excédentaire aux postes non contraints. Utilisées ensemble, la TOC indique aux outils lean comme le SMED et le TPM où intervenir en premier.

### La TOC et le Six Sigma peuvent-ils être combinés ?

Oui. La TOC choisit l'endroit, le Six Sigma réduit la variabilité à cet endroit, par exemple les rebuts au niveau de la contrainte ou un approvisionnement instable vers son tampon. La comptabilité par le débit montre ensuite l'effet financier de chaque projet.

### Quels sont les processus de pensée de la TOC ?

Un ensemble d'outils logiques pour les problèmes non physiques : l'arbre de la réalité actuelle, le nuage d'évaporation, l'arbre de la réalité future, l'arbre des prérequis et l'arbre de transition. Ils répondent à la question de ce qu'il faut changer, de ce par quoi le remplacer et de la manière de provoquer le changement [12].

### Qu'est-ce que la gestion de projet par chaîne critique ?

L'application de la TOC aux projets par Goldratt, issue de son livre *Critical Chain* de 1997 [3]. Elle planifie la chaîne la plus longue de dépendances de tâches et de ressources, retire la marge de sécurité de chaque tâche et la regroupe dans des tampons de projet et d'alimentation.

### Qu'est-ce que la théorie des contraintes dans la gestion de la chaîne d'approvisionnement ?

Dans les chaînes d'approvisionnement, la TOC remplace les stocks pilotés par les prévisions, à chaque site, par des tampons réapprovisionnés en fonction de la consommation réelle et redimensionnés selon leur état [6]. Elle considère le maillon le plus faible, souvent un fournisseur, une usine ou le marché, comme la contrainte qui fixe le rythme de l'ensemble du système. La section 14 résume les règles de réapprovisionnement.

### Quelles sont les critiques adressées à la théorie des contraintes ?

Les principales critiques portent sur le biais de publication dans les études de réussite, l'absence d'optimalité des heuristiques de la TOC lorsque plusieurs contraintes interagissent, l'originalité limitée de certaines idées et une tendance à négliger les personnes et les politiques [6][10]. La section 19 traite chacune d'elles.

### La théorie des contraintes est-elle toujours pertinente ?

Oui. Les usines ont toujours des contraintes, et la combinaison de meilleures données machines, de la simulation et de l'APS facilite la détection des goulots mobiles et la planification d'un drum. Ce qui a changé, c'est que la TOC est rarement utilisée seule ; elle est généralement combinée au lean, au Six Sigma et à la planification numérique.

### Qui a créé la théorie des contraintes ?

Eliyahu M. Goldratt (1947 à 2011), physicien et auteur de management israélien. Il a introduit la TOC dans *The Goal* (1984), coécrit avec Jeff Cox [1][2].

### Combien de temps faut-il pour mettre en œuvre la théorie des contraintes ?

Dans une usine ou une chaîne de valeur, les premiers résultats mesurables proviennent généralement de l'exploitation de la contrainte en quelques semaines, car ils nécessitent peu d'investissement. Une routine DBR ou S-DBR stable avec gestion des tampons demande plusieurs mois ; la feuille de route de la section 16 prévoit six mois pour le premier cycle complet. Ces durées sont des hypothèses de planification, et non des repères issus d'une étude.

### Existe-t-il une certification en théorie des contraintes ?

TOCICO propose une certification à trois niveaux : des examens de niveau fondamental, des examens de niveau praticien et une évaluation de niveau implémenteur, dans des domaines tels que les opérations, la chaîne d'approvisionnement, la gestion de projet (CCPM), les processus de pensée et la finance [5].

## Conclusion et premières étapes

La théorie des contraintes part d'une observation simple : la production d'une usine est déterminée par un très petit nombre de contraintes, généralement une seule. Cela change ce que les responsables doivent faire. Au lieu d'améliorer tout en même temps, il faut identifier la contrainte, cesser de gaspiller son temps, faire en sorte que le reste de l'usine la serve, et ne dépenser de l'argent qu'une fois cela fait. La méthode du tambour-tampon-corde traduit cette logique en planning, la gestion par les tampons la traduit en priorités quotidiennes, et la comptabilité par le débit la traduit en décisions financières que les rapports de coûts standard peuvent fausser.

L'exemple détaillé montre l'ampleur de ce qui est souvent possible sans investissement : 22 % de temps de contrainte supplémentaire grâce à la couverture des pauses, aux changements de série, à la préparation des matières et aux contrôles qualité, ainsi qu'un changement de mix produit que la méthode des coûts standard n'aurait pas suggéré. Il montre aussi les limites : une fois la contrainte exploitée, elle se déplace, et les anciennes règles deviennent le problème suivant. La TOC est plus efficace avec une contrainte unique et clairement identifiée, et elle a besoin d'autres outils (optimisation, APS, équilibrage de lignes en lean) lorsque les contraintes se déplacent ou interagissent. La base de preuves repose surtout sur des retours d'expérience positifs ; vérifiez donc les affirmations dans votre propre usine.

**Vos premières étapes dans les 30 prochains jours**

- [ ] Établir un tableau de charge pour votre principale famille de produits (demande × temps de process vs. temps disponible) et nommer le candidat contrainte
- [ ] Le confirmer par le comptage des files d'attente et trois parcours de goulot par équipe pendant une semaine
- [ ] Démarrer un journal des pertes de la contrainte (modèle 2) sur le candidat et le remplir à chaque équipe pendant deux semaines
- [ ] Calculer le débit par minute de contrainte pour vos 10 produits principaux (modèle 3) avec votre contrôleur de gestion
- [ ] Choisir les deux plus grosses pertes et agir dessus (couverture des pauses, changement de série externe, qualité avant la contrainte)
- [ ] Abandonner au moins un objectif de taux d'utilisation sur un poste non contraint
- [ ] Informer les représentants syndicaux ou du personnel des objectifs, de la couverture des pauses et du rôle de la capacité excédentaire
- [ ] Demander à la DSI si les données machine peuvent distinguer « en attente de matière » et « bloqué » de « à l'arrêt » pour la méthode des périodes actives
- [ ] Tenir une réunion quotidienne de 10 minutes au niveau de la contrainte (modèle 8)

---

## Pour aller plus loin sur m365.fm

**Guides associés**
- [Ordonnancement de production et APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Cartographie du flux de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Indicateurs KPI de production](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/)
- [Management de l'atelier et Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Jumeau numérique en production](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT industrielle avec Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planification de production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Nouveaux guides de cette série**
- [SMED et réduction des changements de série](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM et TRS](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban et systèmes tirés](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma et analyse des causes racines](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP et planification de production](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Maintenance prédictive et IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Simulation de production](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Dimensionnement des lots](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestion des stocks en production](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Termes du glossaire (entités)**
[Théorie des contraintes](https://www.m365.fm/entity/theory-of-constraints/) · [Ordonnancement fondé sur les contraintes](https://www.m365.fm/entity/constraint-based-scheduling/) · [Gestion par les tampons](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Cartographie du flux de valeur](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Système tiré](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la production allégée, l'excellence opérationnelle, la planification de production et la transformation numérique de la production, en mettant l'accent sur la manière dont les modèles de chaîne de valeur, la simulation et l'analyse des KPI aident les sites à identifier et gérer leurs contraintes.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
