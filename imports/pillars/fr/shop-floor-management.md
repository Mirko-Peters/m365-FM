# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gestion de l'atelier et gemba walks : un guide pratique |
| Meta description | La gestion de l'atelier expliquée : réunions par niveaux, tableaux SQDCP, KPI, liste de contrôle du gemba walk, feuille de route et tableau numérique dans Microsoft 365. |
| Slug | `shop-floor-management` |

# Gestion de l'atelier et gemba walks : le guide complet pour diriger là où le travail se fait

*Dernière mise à jour : 20 novembre 2026 · Les détails Microsoft ont été vérifiés sur Microsoft Learn à cette date*

> **Réponse courte :** Le shop floor management (également écrit shopfloor management, souvent appelé système de management quotidien ou management à plusieurs niveaux) est un système de management dans lequel les responsables pilotent les opérations là où la valeur est réellement créée : sur la ligne de production, dans l'entrepôt ou au laboratoire. Il combine la présence des managers au gemba (le « lieu réel »), des KPI visuels sur un tableau de pilotage d'atelier, de courtes réunions quotidiennes par niveau qui remontent les problèmes dans l'organisation, et une résolution de problèmes structurée, de sorte que les écarts soient détectés chaque jour et corrigés durablement. La visite gemba est la routine managériale au cœur du dispositif.

Presque tous les industriels ont quelque part un tableau blanc rempli de chiffres. Peter Gelbrich, cité par l'institut allemand de formation CETPM, estime à partir de visites d'entreprises qu'environ 80 % des entreprises manufacturières disposent d'un outil de shop floor management visuel [3]. La vraie question n'est donc plus de savoir si vous avez un tableau, mais s'il fonctionne. Les écarts sont-ils traités en quelques heures plutôt qu'en quelques semaines ? Les managers viennent-ils au gemba pour poser des questions ou pour apporter des réponses ? Et les problèmes que l'équipe ne peut pas résoudre remontent-ils de manière fiable au niveau supérieur le jour même ?

Ce guide explique les origines et les principes, décrit en détail chaque élément et fournit une matrice de réunions par niveau, une disposition du tableau, un guide de visite gemba avec une check-list, le standard de travail du management, une feuille de route de déploiement et une architecture de référence pour un tableau d'atelier numérique construit avec Microsoft Teams, Power BI, Power Apps et Microsoft Fabric. Une grande partie de la recherche sur le shop floor management provient d'Allemagne, où le terme « Shopfloor Management » est un vocabulaire courant dans les usines ; ce guide s'appuie sur ces sources lorsqu'elles apportent de la valeur et explique le contexte pour les lecteurs américains. Une définition condensée est également disponible sur la page d'entité [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Points clés

- Le shop floor management est un système de management, pas un tableau et pas un logiciel. Il se compose de managers présents sur le terrain, de management visuel, de quelques KPI, d'un rythme de réunions fixe, de résolution de problèmes et de standards.
- Les réunions par niveau au niveau des équipes durent de 10 à 15 minutes et sont échelonnées afin qu'un problème du premier poste atteigne le directeur de site le jour même.
- Un tableau doit présenter quatre à six KPI sur lesquels l'équipe peut réellement agir, généralement organisés selon SQDCP (sécurité, qualité, délais, coûts, personnes).
- La visite gemba est la routine managériale centrale : elle a un thème, repose sur l'observation et des questions ouvertes, et se termine toujours par un suivi.
- Une action n'est clôturée que lorsque son effet apparaît dans le KPI et que le standard a été mis à jour.
- La routine d'abord, le numérique ensuite. Un tableau numérique dans Microsoft 365 est une boîte à outils ; les licences, les intervalles de rafraîchissement, la conception des données et les règles de surveillance des employés déterminent l'effort.

### Parcours de lecture pour les lecteurs pressés

| Vous êtes un(e) … | Lisez d'abord |
|---|---|
| Chef d'équipe, superviseur ou responsable de poste | Section 5 (réunions par niveau), 6 (tableau), 9 (visite gemba), 10 (standard de travail du management) |
| Directeur de site ou vice-président des opérations | Section 3 (bénéfices), 13 (culture et règles de surveillance des employés), 14 (déploiement), 15 (erreurs courantes) |
| Administrateur Microsoft 365 ou Azure | Section 16 (analogique ou numérique), 17 (Microsoft 365, y compris le plan de mise en œuvre), 18 (intégration des données) |
| Coach Lean, responsable amélioration continue ou chef de projet | Section 4 (éléments), 8 (résolution de problèmes), 14 (feuille de route avec contrôle de maturité) |

## Table des matières

1. [Qu'est-ce que le management de production (shop floor management) ? Définition et périmètre](#quest-ce-que-le-management-de-production-shop-floor-management--définition-et-périmètre)
2. [Origines : gemba, genchi genbutsu et le Toyota Production System](#origines--gemba-genchi-genbutsu-et-le-toyota-production-system)
3. [Objectifs et avantages](#objectifs-et-bénéfices)
4. [Les six éléments du management de production](#les-six-éléments-du-management-de-latelier)
5. [Réunions échelonnées : la cascade quotidienne](#réunions-à-plusieurs-niveaux--la-cascade-quotidienne)
6. [Le tableau de production : structure, champs et exemple de mise en page](#le-tableau-de-bord-datelier--structure-champs-et-exemple-de-mise-en-page)
7. [KPI d'atelier : choisir des indicateurs SQDCP efficaces](#kpi-datelier--choisir-des-indicateurs-sqdcp-efficaces)
8. [Résolution de problèmes à l'atelier : de la mise en sécurité au standard](#résolution-de-problèmes-à-latelier--du-confinement-au-standard)
9. [La marche gemba : étapes, questions et liste de contrôle](#la-marche-gemba--étapes-questions-et-liste-de-contrôle)
10. [Standard de travail du responsable : le leadership comme routine](#standard-work-pour-les-dirigeants--le-leadership-comme-routine)
11. [Andon : rendre les écarts visibles en temps réel](#andon--rendre-les-écarts-visibles-en-temps-réel)
12. [Rôles et responsabilités](#rôles-et-responsabilités)
13. [Culture, sécurité psychologique et règles de suivi des salariés](#culture-sécurité-psychologique-et-règles-de-surveillance-des-employés)
14. [Mettre en œuvre le management de production : une feuille de route en six phases](#comment-mettre-en-œuvre-le-management-visuel-en-atelier--une-feuille-de-route-en-six-phases)
15. [Erreurs courantes et comment les corriger](#häufige-fehler-und-wie-man-sie-behebt)
16. [Analogique ou numérique ? Comparaison du management de production numérique](#analogique-ou-numérique--comparaison-du-management-visuel-datelier-numérique)
17. [Construire un tableau de production numérique avec Microsoft 365](#construire-un-tableau-de-bord-numérique-datelier-avec-microsoft-365)
18. [Intégration des données : MES, ERP et données machines](#intégration-des-données--mes-erp-et-données-machines)
19. [Support logiciel : l'exemple d'iFAKT Polaris](#support-logiciel--lexemple-difakt-polaris)
20. [Glossaire](#glossaire)
21. [FAQ : management de production et marches gemba](#faq--management-en-atelier-et-visites-gemba)
22. [Conclusion](#conclusion)

## Qu'est-ce que le management de production (shop floor management) ? Définition et périmètre

Le terme associe « shop floor » (l'atelier de production, plus largement le lieu où la valeur est créée) et « management ». Dans les usines américaines, cette pratique porte souvent d'autres noms : daily management system, tiered accountability, tier meetings ou huddle boards. L'idée sous-jacente reste la même.

L'ifaa (Institut allemand pour le travail appliqué, un institut de recherche en ingénierie industrielle et en ergonomie) décrit le management de production comme le pilotage au point de création de valeur, qui réunit planification, contrôle, amélioration et exécution des tâches à l'atelier afin de mobiliser le savoir des « experts sur site » [2]. La WGP (Association académique allemande de technologie de production) le présente comme un système de management intégré destiné au développement systématique des processus et des collaborateurs à l'atelier [4]. Remco Peters, dont l'ouvrage de 2009 est une référence dans les pays germanophones, souligne que le management de production n'est « pas seulement un outil de contrôle mais un instrument de leadership global » [1][6].

Trois caractéristiques découlent de ces définitions et distinguent un véritable management de production d'un simple mur d'indicateurs :

1. **Lieu :** le leadership s'exerce là où la valeur est créée, et non dans la salle de réunion.
2. **Rythme :** la communication est planifiée, courte et standardisée. Elle suit une cascade fixe à travers les niveaux de l'organisation.
3. **Effet :** chaque écart conduit à une action avec un responsable et une échéance, et l'effet est vérifié.

### Ce que le management de production n'est pas

Dans la pratique, le management de production est souvent confondu avec des notions voisines. Aux États-Unis en particulier, l'expression « shop floor management » désigne aussi, chez les éditeurs d'ERP et de planification, le shop floor control : lancement, séquencement et suivi des ordres de fabrication. Le tableau ci-dessous sépare ces concepts.

| Terme | Ce que cela recouvre | Lien avec le management de production |
|---|---|---|
| Pilotage d'atelier / contrôle de production | Séquencement, lancement des ordres, équilibrage des capacités, suivi des ordres de fabrication | Une sous-tâche ; le management de production utilise ses résultats mais constitue un système de pilotage |
| MES (manufacturing execution system) | Système informatique d'enregistrement et de contrôle de la production | Source de données et outil, pas le système de pilotage lui-même |
| Gestion visuelle | Rendre visibles l'état et les écarts | Un élément du management de production |
| Gemba walk | Le responsable se rend là où le travail est réalisé, observe et pose des questions | Un élément et une routine de pilotage du management de production |
| Amélioration continue / kaizen | Amélioration par petites étapes permanentes | Résultat et moteur ; le management de production fournit la plateforme quotidienne |
| Lean manufacturing | Philosophie globale d'élimination des gaspillages | Le cadre plus large ; le management de production en est le système de pilotage quotidien |

Pour le cadre plus large, voir la page d'entité [Lean management](https://www.m365.fm/entity/lean-management/) et le compendium m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). En Allemagne, ce cadre est souvent appelé « système de production holistique » (Ganzheitliches Produktionssystem). La série de directives VDI 2870 de l'Association des ingénieurs allemands (VDI) en décrit les fondements (partie 1, juillet 2012) et un catalogue de méthodes (partie 2, février 2013). Le VDI a classé les deux parties comme partiellement à réviser, et une nouvelle édition de la partie 2 est en cours [27].

### Atelier, bureaux et autres domaines

Le management de production est né dans l'industrie manufacturière, mais il se transpose à tout domaine comportant un travail récurrent et un résultat mesurable : logistique, maintenance, laboratoires, services hospitaliers, service client, ingénierie. Pour les fonctions indirectes, le terme « office floor management » s'est imposé [3]. Les principes restent les mêmes ; les KPI changent. Au lieu de la production et des rebuts, le tableau affiche par exemple le délai de traitement des dossiers, la livraison à temps des plans ou l'arriéré des tickets.

## Origines : gemba, genchi genbutsu et le Toyota Production System

### Gemba : le « lieu réel »

« Gemba » (parfois écrit « genba ») signifie en japonais « le lieu réel ». En lean, il désigne le lieu où le travail créateur de valeur est effectivement réalisé, généralement l'atelier [7][8]. Étroitement lié, **genchi genbutsu** signifie en gros « lieu réel, chose réelle ». Le Lean Lexicon du Lean Enterprise Institute (LEI) le définit comme le fait d'aller à la source pour vérifier les faits par soi-même [8]. Michael Ballé, du LEI, établit la distinction ainsi : le gemba est un lieu, le genchi genbutsu est une action [8].

Le caractère central de ce principe chez Toyota apparaît dans « The Toyota Way 2001 ». En avril 2001, Toyota a présenté deux piliers (amélioration continue et respect des personnes) et cinq valeurs clés. Aux côtés du défi, du kaizen, du respect et du travail d'équipe, le genchi genbutsu figure explicitement parmi elles, traduit par « aller à la source pour trouver les faits » [9].

### Taiichi Ohno et le cercle à la craie

Taiichi Ohno (1912–1990) est considéré comme l'architecte du Toyota Production System ; son livre « Toyota Production System: Beyond Large-Scale Production » a été publié en anglais par Productivity Press en 1988 [13]. Une anecdote bien connue lui est attachée : il aurait placé de jeunes ingénieurs dans un cercle tracé à la craie sur le sol de l'atelier et les aurait fait observer pendant des heures jusqu'à ce qu'ils voient réellement les problèmes du processus. L'histoire est peut-être enjolivée [12], mais elle exprime l'essentiel : la compréhension vient de l'observation sur place, et non des rapports.

### Masaaki Imai et le « Gemba Kaizen »

Masaaki Imai a fait connaître le terme en Occident avec son livre « Gemba Kaizen: A Commonsense, Low-Cost Approach to Management » (McGraw-Hill, 1997) [10]. Les « règles d'or du management gemba » associées se présentent ainsi dans la synthèse du Kaizen Institute [11] :

1. Lorsqu'un problème survient, rendez-vous d'abord au gemba.
2. Examinez le gembutsu (machine, outil, matière, pièce défectueuse).
3. Prenez des contre-mesures provisoires sur place.
4. Recherchez la cause profonde.
5. Standardisez pour éviter la récurrence.

Ces cinq étapes restent aujourd'hui le modèle de résolution de problèmes dans le management de production (voir la section 8).

### Suzaki et la diffusion du terme

Kiyoshi Suzaki est considéré comme le pionnier du terme « shop floor management » avec son livre « The New Shop Floor Management: Empowering People for Continuous Improvement » (Free Press, 1993) [5]. L'institut de formation allemand CETPM cite Constantin May, qui qualifie Suzaki de « père du shop floor management » [3]. Suzaki a ajouté au leadership sur site une bonne communication entre managers et employés, une compréhension du client à l'échelle de l'entreprise, la capacité d'apprendre et une exigence de qualité maximale [1]. Dans les pays germanophones, Remco Peters (2009) [6] et les travaux de la Technische Universität Darmstadt (notamment Hertle et al. sur le développement des compétences dans le shop floor management [26]) ont façonné le débat. Aux États-Unis, les mêmes pratiques se sont diffusées surtout sous les appellations lean management system, daily management et leader standard work, notamment à travers le livre de David Mann « Creating a Lean Culture » [19].

### Quelle est sa diffusion aujourd'hui ?

Selon une étude de 2018 citée par WGP, environ 82,5 % des entreprises participantes avaient introduit le shop floor management, soit une hausse d'environ 20 % par rapport à trois ans plus tôt. Il était surtout utilisé dans la production et les domaines voisins, mais pas à tous les niveaux de la hiérarchie [4]. WGP ne nomme pas l'étude, de sorte que l'échantillon et la méthode ne peuvent pas être vérifiés. Ce constat met en évidence un problème central dans de nombreuses usines, que traite la section 5 : un tableau au niveau d'une équipe, sans cascade fonctionnelle au-dessus, a peu d'effet. Des chiffres américains comparables et représentatifs n'ont pas été trouvés dans les recherches pour cet article.

## Objectifs et bénéfices

Le shop floor management poursuit cinq objectifs qui dépendent les uns des autres :

| Objectif | Ce qui se passe réellement | Mesuré par |
|---|---|---|
| Transparence | Cible et réel sont visibles de tous d'un coup d'œil | Actualité du tableau, part des KPI disposant d'une cible |
| Réaction rapide | Les écarts sont repérés et traités dans le même poste | Délai entre écart et action, délai d'escalade |
| Résolution durable des problèmes | Les causes racines sont éliminées, pas les symptômes | Taux de récurrence du même défaut |
| Implication des collaborateurs | Le savoir des personnes qui réalisent le travail alimente les décisions | Nombre d'idées mises en œuvre, participation aux points quotidiens |
| Développement du leadership | Les responsables passent du rôle de pompier à celui de coach | Part des standards de travail des leaders réalisés, taux de gemba walks |

### Quelles sont les preuves ?

Des chiffres solides et indépendants sur le bénéfice du shop floor management sont rares, car son effet est difficile à isoler des autres mesures lean. Les exemples documentés restent néanmoins instructifs :

- **fischer (fabricant allemand de fixations, fischerwerke) :** Après un projet de neuf mois, le taux de réclamations a baissé de 13 % et les coûts de processus de 9 % ; le nombre de livraisons a augmenté de 11 %, avec les mêmes effectifs et dans les délais [3].
- **Schinko (fabricant autrichien de boîtiers en tôle) :** Après l'introduction d'un shop floor management numérique, la productivité en découpe a augmenté de 20 % ; en pliage, où le système était plus récent, la hausse au moment du rapport était de 10 %. L'article a été rédigé par le responsable marketing de l'éditeur logiciel concerné, GFT, et doit être lu en conséquence [42].
- **Recherche sur le shop floor management numérique :** L'étude de l'institut wbk Institute of Production Science du Karlsruhe Institute of Technology (KIT) et de l'institut IPRI dans le projet ShopfloorPulse indique que les informations numériques quasi temps réel peuvent réduire « considérablement » le délai de correction d'une panne, tandis que le suivi analogique des actions dépend de la discipline individuelle [24][25]. L'étude repose sur 18 entreprises ; c'est donc un instantané qualitatif plutôt qu'une enquête représentative.

De nombreuses pages d'éditeurs sur google.com citent des gains bien plus importants (par exemple 25 à 35 % de productivité en plus) sans nommer de source. Ce guide ne reprend pas ces chiffres. La conclusion prudente : le shop floor management n'est pas un outil au retour sur investissement garanti, mais un système de leadership dont l'effet dépend de la constance avec laquelle il est mis en œuvre. Les sections suivantes montrent de quoi cette constance dépend.

## Les six éléments du management de l'atelier

La littérature structure le management de l'atelier de différentes manières. L'ifaa distingue quatre éléments visibles (gestion visuelle, KPI, communication standardisée, résolution systématique des problèmes) et trois fondations « invisibles » (principes de travail, compréhension des rôles, durabilité) [2]. Peters a identifié quatre éléments centraux : diriger sur site, reconnaître les écarts, résoudre les problèmes de manière durable et utiliser les ressources de façon optimale [1]. Le WGP désigne la stabilité et la standardisation comme prérequis, et la gestion des performances, la résolution de problèmes et la gestion des améliorations, le leadership sur site, la gestion visuelle et le développement des compétences comme éléments de management [4]. De nombreuses pages américaines énumèrent généralement cinq « piliers » au contenu similaire.

Le modèle suivant rassemble ces approches et a fait ses preuves en pratique :

| Élément | Question clé | Outils principaux |
|---|---|---|
| 1. Responsables présents sur le terrain | Les responsables voient-ils la réalité par eux-mêmes ? | Gemba walk, travail standard du responsable |
| 2. Gestion visuelle | Chacun peut-il dire en quelques secondes si les choses sont conformes au plan ? | Tableau d'atelier, andon, 5S, voyants d'état |
| 3. KPI | Mesurons-nous ce que l'équipe peut influencer ? | SQDCP, TRS, taux de bon premier coup |
| 4. Cadence des réunions (communication à plusieurs niveaux) | L'information circule-t-elle de manière fiable, vers le haut et vers le bas, chaque jour ? | Réunions tiers, règles d'escalade |
| 5. Résolution de problèmes | Les causes racines sont-elles éliminées durablement ? | PDCA, 5 Pourquoi, diagramme en arête de poisson (Ishikawa), A3 |
| 6. Standardisation | Ce que nous avons appris est-il ancré ? | Travail standard, instructions de travail |

### Élément 1 : Responsables présents sur le terrain

Le LEI décrit ainsi l'état d'esprit du gemba : on va au gemba pour comprendre le travail, pour diriger et pour apprendre [15]. Fujio Cho, anciennement président puis président du conseil d'administration de Toyota, a résumé l'attitude des responsables lean en trois impératifs : « Aller voir, demander pourquoi, montrer du respect » [15]. Être présent ne signifie pas contrôler ; cela signifie être accessible et intéressé. La section 9 décrit en détail à quoi ressemble cette présence sous la forme d'une gemba walk.

### Élément 2 : Gestion visuelle

Le LEI définit la gestion visuelle comme le fait de placer en « vue claire » tous les outils, pièces, activités de production et indicateurs de performance, afin que chaque personne concernée puisse comprendre l'état du système d'un seul coup d'œil [20]. La gestion visuelle va donc bien au-delà du tableau : les marquages au sol, les panneaux d'ombre, les cartes kanban, les voyants andon et les colonnes lumineuses sur les machines en font tous partie. La [5S](https://www.m365.fm/entity/5s/) constitue souvent le fondement, car les écarts ne ressortent que dans un environnement ordonné. Pour aller plus loin : [Gestion visuelle](https://www.m365.fm/entity/visual-management/).

### Élément 3 : KPI

Les KPI rendent les écarts objectifs. Ils doivent répondre à trois critères : l'équipe peut les influencer, ils sont disponibles rapidement et ils disposent d'une cible. La section 7 explique comment les choisir. Les bases figurent sur la page d'entité [Indicateur clé de performance](https://www.m365.fm/entity/key-performance-indicator/) et dans le recueil [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Élément 4 : Cadence des réunions

La cadence des réunions (les sources allemandes parlent de « Regelkommunikation », communication standard) désigne de courtes réunions planifiées et standardisées devant le tableau. Sa caractéristique essentielle est la cascade : l'information et les problèmes remontent du niveau équipe au niveau service puis au niveau site, et le soutien et les décisions redescendent [3][58]. La section 5 fournit une matrice complète.

### Élément 5 : Résolution de problèmes

Sans résolution de problèmes, le management de l'atelier se réduit à une séance de reporting. L'essentiel est de distinguer le confinement rapide de l'élimination durable des causes racines. La section 8 retrace le parcours depuis un point rouge sur le tableau jusqu'à un standard mis à jour.

### Élément 6 : Standardisation

Les standards sont à la fois un prérequis et un résultat. Sans standard, il n'y a pas d'écart, et sans mise à jour du standard, chaque amélioration se perd à nouveau. Le WGP désigne donc explicitement la stabilité et la standardisation comme prérequis [4]. Pour aller plus loin : [Travail standard](https://www.m365.fm/entity/standard-work/).

## Réunions à plusieurs niveaux : la cascade quotidienne

> **En bref :** Chaque niveau se réunit brièvement devant son tableau, traite ce qu'il peut résoudre et transmet le reste au niveau suivant le même jour. Cela suppose des horaires de réunion fixes, des critères d'escalade clairs et une obligation de réponse.

Les réunions à plusieurs niveaux (aussi appelées tier meetings, huddles à plusieurs niveaux, stand-ups ou réunions quotidiennes de responsabilisation) constituent l'ossature de la cadence des réunions. Le principe : chaque niveau se réunit brièvement, examine ses KPI, résout ce qu'il peut et fait remonter le reste au niveau supérieur, qui se réunit un peu plus tard. Le Kaizen Institute décrit la structure typique aux États-Unis comme une organisation en quatre niveaux, des équipes de terrain (niveau 1) aux superviseurs (niveau 2), puis aux responsables de département (niveau 3) et à la direction de l'usine (niveau 4), les problèmes étant escaladés le jour même vers un responsable désigné [58]. CETPM décrit la cadence classique dans les usines allemandes : quotidienne ou par équipe au niveau des équipes, hebdomadaire au niveau des départements, mensuelle ou trimestrielle au niveau de l'usine [3]. Dans de nombreuses usines lean, une réunion quotidienne est aujourd'hui également courante aux niveaux 2 et 3, afin qu'un problème survenu en première équipe parvienne au directeur d'usine dès le matin. L'étude ShopfloorPulse décrit la même structure : les réunions remontent depuis l'atelier selon des rythmes quotidien, hebdomadaire ou mensuel [25]. Pour en savoir plus sur le terme, voir la page d'entité [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Quelle doit être la durée d'une réunion à plusieurs niveaux ?

Il existe des valeurs de référence documentées. Gelbrich cite environ 10 à 12 minutes au niveau opérationnel et 20 à 30 minutes au niveau de la direction ; Orth cite 10, au plus 20 minutes pour les stand-ups dans les zones indirectes ; Schwarz cite un maximum de 15 minutes dans son exemple pratique, mais souligne que les premières réunions lors du déploiement durent souvent 30 minutes ou plus [3]. Gelbrich compte les réunions qui s'éternisent, surtout pendant le déploiement, parmi les dix raisons les plus fréquentes de l'échec du management de l'atelier (shop floor management) [3].

### Matrice des réunions à plusieurs niveaux (conception type)

La matrice suivante est une conception type pour une usine fonctionnant en équipes, fondée sur les pratiques courantes. La cadence et la durée suivent les valeurs de référence documentées ci-dessus ; les heures et les participants sont des suggestions à adapter à votre modèle d'équipes et à votre organisation.

| Caractéristique | Niveau 1 : équipe | Niveau 2 : zone / superviseur | Niveau 3 : département / responsable de production | Niveau 4 : usine |
|---|---|---|---|---|
| Cadence | à chaque équipe, en début de poste | quotidienne | quotidienne (sinon hebdomadaire) | quotidienne ou hebdomadaire, plus une revue mensuelle |
| Horaire (exemple : première équipe à 6 h 00) | de 6 h 10 à 6 h 30, décalées par ligne | 8 h 30 | 9 h 15 | 10 h 00 |
| Durée | 10 à 15 minutes | 15 minutes | 15 à 20 minutes | 20 à 30 minutes |
| Lieu | tableau à côté de la ligne | tableau de zone | tableau du département sur le plateau | tableau de l'usine (salle obeya ou plateau) |
| Animateur | chef d'équipe | superviseur / chef d'équipe de poste | responsable de production ou de département | directeur d'usine |
| Participants | équipe de la ligne ou de la cellule | chefs d'équipe de la zone, maintenance et qualité si nécessaire | superviseurs, représentants de la qualité, de la maintenance, de la logistique, HSE (environnement, santé et sécurité) | responsables de département, fonctions support (qualité, chaîne d'approvisionnement, achats, RH, finance) |
| Horizon temporel | dernière équipe, équipe en cours | 24 dernières heures, aujourd'hui | hier, aujourd'hui, cette semaine | semaine, mois, tendance |
| KPI types | événements sécurité, objectif vs réel en unités par heure, rebut, arrêts, présence | production, TRS des goulots, taux de première passe, backlog | livraison à l'heure, coût de la non-qualité, productivité, escalades ouvertes | vue SQDCP de l'usine, réclamations clients, coût, état des projets |
| Décisions | effectifs, confinement, idées | réaffectation du personnel entre lignes, priorités de maintenance | ressources entre zones, équipes supplémentaires, groupes de résolution de problèmes | dépenses d'investissement, priorités, modifications d'objectifs |
| Escalader vers le haut lorsque | le problème ne peut pas être résolu dans l'équipe ou des ressources manquent | le problème touche plusieurs lignes ou nécessite une fonction support | le problème touche les clients, le budget ou plusieurs départements | groupe, client, fournisseur |

**Deuxième et troisième équipes :** le niveau 1 fonctionne à chaque équipe ; les niveaux 2 à 4 fonctionnent en général uniquement de jour. Pour que les problèmes des deuxième et troisième équipes ne se perdent pas, le chef d'équipe saisit les escalades ouvertes sur le tableau ou dans le journal de poste et les transmet en personne à la première équipe. La réunion de niveau 2 du matin commence par ces points.

### Règles d'escalade qui fonctionnent

Une cascade n'est aussi efficace que ses règles d'escalade. Quatre principes ont fait leurs preuves :

1. **Déclencheurs clairs plutôt que l'intuition.** Définissez pour chaque KPI quand escalader, par exemple : « ligne à l'arrêt depuis plus de 30 minutes », « rebut au-dessus de la limite pendant deux heures consécutives », « blessure ou presque-accident : toujours ».
2. **Un calendrier qui s'emboîte.** La réunion du niveau supérieur a lieu après celle du niveau inférieur, afin que les escalades arrivent le même jour. L'animateur de la réunion inférieure transmet l'escalade en personne ou via le tableau.
3. **Obligation de répondre.** Chaque escalade reçoit une réponse, au plus tard lors de la prochaine réunion du niveau inférieur. Le silence est le moyen le plus rapide de détruire une culture de l'escalade.
4. **La sécurité avant tout.** Les problèmes de sécurité sont escaladés immédiatement, indépendamment de la cascade.

CETPM décrit un lien défaillant entre les niveaux du management de terrain comme un écueil typique [3]. Cela correspond à l'étude du KIT et de l'IPRI : lorsque les actions sont suivies sur papier, l'escalade vers les niveaux supérieurs se rompt et le suivi des actions « dépend de la discipline des individus » [24].

### Ordre du jour standard d'une réunion de niveau 1 (15 minutes au maximum)

L'ordre du jour utilise la limite supérieure de 15 minutes. Les équipes bien rodées le parcourent en 10 à 12 minutes, la fourchette que Gelbrich cite pour le niveau opérationnel [3].

| Minute | Point | Question directrice |
|---|---|---|
| 0–2 | Sécurité | Y a-t-il des blessures, des presque-accidents ou des conditions dangereuses ? |
| 2–6 | KPI d'hier / du dernier poste | Où sommes-nous en rouge, et pourquoi ? |
| 6–9 | Plan du jour | Quel est l'objectif du jour ? Y a-t-il des contraintes sur les personnes, les matières, les équipements ? |
| 9–12 | Actions | Quelles actions ouvertes arrivent à échéance, qu'est-ce qui est fait, où faut-il de l'aide ? |
| 12–14 | Escalades | Qu'est-ce que nous transmettons au niveau 2 ? |
| 14–15 | Clôture | Qui fait quoi, et pour quand ? Y a-t-il une reconnaissance pour un bon travail ? |

Important : la réunion de niveau nomme les problèmes, désigne les responsables et convient des mesures de confinement. L'analyse des causes profondes se fait ensuite, dans un petit groupe, directement près de l'équipement.

## Le tableau de bord d'atelier : structure, champs et exemple de mise en page

> **En bref :** Un bon tableau se lit à environ 3 m, présente quatre à six KPI avec leurs objectifs, suit l'ordre du jour de la réunion de gauche à droite et relie chaque KPI en rouge à une action. L'équipe le tient à jour elle-même.

Le tableau de bord d'atelier (aussi appelé huddle board, tier board, tableau SQDCP ou performance board) est l'outil central du rythme de réunions. L'ifaa en décrit ainsi les tâches : il visualise les KPI choisis d'une zone, présente les actions d'amélioration avec leur statut afin que leur effet sur les KPI soit traçable, et contient les informations de pilotage quotidiennes, avant tout la situation actuelle des commandes et des capacités [2]. Comme catégories d'exemple, l'ifaa cite la qualité, le coût, la logistique, la sécurité, le personnel, la capacité et la situation des commandes, ainsi que les objectifs et actions (amélioration continue) ; parmi les KPI d'exemple figurent le taux de bon du premier coup, les taux en ppm, le TRS, le respect des délais, les chiffres d'accidents, l'état des 5S et le taux de présence [2].

### Règles de conception

- **Lisible à environ 3 m :** code couleur rouge/vert et grands chiffres, pas de tableaux à trente colonnes.
- **Quatre à six KPI :** CETPM recommande environ quatre à six KPI que l'équipe peut influencer [3] ; le prestataire de formation allemand Haufe Akademie en cite cinq à sept comme limite haute [43].
- **Objectif à côté du réel :** chaque KPI a un objectif et une tendance.
- **Raconter l'histoire de gauche à droite :** le tableau suit l'ordre du jour, l'animateur n'a qu'à se déplacer de gauche à droite.
- **Actions visibles :** chaque KPI en rouge est relié à une action ou à une fiche de résolution de problème.
- **Possédé par l'équipe :** l'équipe tient le tableau à jour elle-même. Un tableau rempli par la finance ou l'informatique que personne dans l'équipe ne comprend sera ignoré.

### Exemple de mise en page d'un tableau de niveau 1

La mise en page suivante présente un tableau pour une ligne d'assemblage, avec trois rangées et cinq colonnes. Elle fonctionne aussi bien sur un tableau blanc (environ 2 × 1,2 m) que sur un écran.

| | Colonne A : Sécurité (S) | Colonne B : Qualité (Q) | Colonne C : Livraison (D) | Colonne D : Coût / productivité (C) | Colonne E : Personnes (P) |
|---|---|---|---|---|---|
| **Ligne 1 : état actuel** | Croix de sécurité (calendrier mensuel, chaque jour vert, jaune ou rouge) | Rebuts et retouches par équipe vs. objectif | Objectif du plan journalier vs. réalisé, retard | Objectif d'unités par heure vs. réalisé (graphique heure par heure) | Présence, matrice de compétences (qui sait faire quoi) |
| **Ligne 2 : tendance** | Presque-accidents sur les 4 dernières semaines | Taux de bon du premier coup, 3 principaux types de défauts (Pareto) | Livraison à la date prévue cette semaine | TRS du goulot, 3 principales causes d'arrêt, [micro-arrêts](https://www.m365.fm/entity/micro-stops/) | Plan de congés et de formation |
| **Ligne 3 : actions** | Actions de sécurité ouvertes | Fiches de résolution de problèmes / A3 en cours | Escalades vers le niveau 2 et réponses | Liste d'actions (quoi, qui, pour quand, statut) | Idées et suggestions avec leur statut |

La plupart des tableaux comportent aussi un en-tête avec le nom de l'équipe, l'objectif de zone et l'heure de la dernière mise à jour, ainsi qu'une case « standards et audits » (par exemple, le résultat du dernier audit 5S). Remarque sur l'ordre des colonnes : l'original allemand de ce guide utilise SQCDP, qui place le coût avant la livraison ; les usines américaines écrivent plus souvent SQDCP. L'ordre de C et D compte moins que de placer la sécurité en premier.

### Contenu du tableau selon le niveau

À mesure que l'on monte dans la hiérarchie, le tableau devient plus agrégé et l'horizon temporel plus long. Le fournisseur de MES Symestic décrit cela comme deux règles de cohérence : les KPI sont condensés et revus moins souvent à mesure que l'on monte, mais ils doivent remonter aux mêmes données à chaque niveau [41].

| Niveau | Détail | Horizon temporel typique | Exemple qualité |
|---|---|---|---|
| Niveau 1 | poste, heure | équipe | défauts par heure au poste 3 |
| Niveau 2 | ligne, équipe | jour | taux de rebut par ligne |
| Niveau 3 | zone, jour | semaine | taux de bon du premier coup et coût de la non-qualité par zone |
| Niveau 4 | usine, semaine | mois | réclamations clients en ppm, coût de la non-qualité |

## KPI d'atelier : choisir des indicateurs SQDCP efficaces

La plupart des tableaux suivent un ordre fixe de dimensions. Le plus courant est **SQDCP** (ou SQCDP) : sécurité, qualité, délais (livraison), coût et personnes [41]. Les variantes sont SQDC (sans P), SQDCM (M pour moral) ou SQDCE avec environnement. CETPM liste les thèmes sécurité, qualité, coût, fiabilité des livraisons et personnes comme dimensions typiques [3]. L'ordre est délibéré : la sécurité passe toujours en premier.

### Trois questions directrices pour choisir les KPI

Gelbrich propose trois questions à partir desquelles dériver des KPI pertinents [3] :

1. À quoi doit ressembler la sortie de mon processus en termes de délai et de qualité ?
2. Comment montrer l'efficacité de mes actions en termes de coût et de ressources ?
3. Qu'est-ce qui reflète une exécution responsable de mon processus en termes de sécurité et d'environnement ?

Son principe central, formulé en variante d'une célèbre citation de Drucker : ce que l'équipe ne peut pas influencer ne devrait pas être mesuré sur son tableau [3].

### Catalogue de KPI pour le tableau d'atelier

| Dimension | KPI | Définition / calcul | Niveau |
|---|---|---|---|
| S | Jours depuis le dernier accident avec arrêt | jours calendaires depuis le dernier cas déclarable OSHA (voir note ci-dessous) | 1–4 |
| S | Taux total d'accidents déclarables (TRIR) | nombre d'accidents et de maladies déclarables × 200 000 / total des heures travaillées ; 200 000 heures équivalent à 100 salariés à temps plein pendant un an [51] | 3–4 |
| S | Presque-accidents (signalés) | signalements par semaine (davantage de signalements est d'abord un bon signe) | 1–3 |
| Q | Taux de rebut | quantité rebutée / quantité totale ; voir [taux de rebut](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | Taux de bon du premier coup (FPY) | pièces bonnes au premier passage / pièces lancées | 1–3 |
| Q | Réclamations clients | nombre ou ppm | 3–4 |
| D | Objectif vs. réalisé en unités | par heure ou par équipe | 1–2 |
| D | Livraison à la date prévue | commandes livrées à temps / total des commandes | 2–4 |
| D | Retard | quantité ouverte vs. plan | 1–3 |
| C | TRS | disponibilité × performance × qualité [22] | 1–3 |
| C | Productivité | pièces bonnes par heure de main-d'œuvre | 2–4 |
| C | Temps de changement de série | temps entre la dernière bonne pièce de l'ordre précédent et la première bonne pièce du suivant | 1–2 |
| P | Présence / effectifs | salariés présents / salariés planifiés | 1–2 |
| P | Niveau de polyvalence | part des tâches couvertes dans la matrice de compétences | 1–2 |
| P | Idées mises en œuvre | suggestions d'amélioration mises en œuvre par mois | 1–3 |

**Remarque sur les KPI de sécurité dans les usines américaines :** les compteurs « jours sans accident » sont populaires, mais l'OSHA a averti que les incitations fondées sur des taux (par exemple, une récompense pour un mois sans accident) peuvent décourager la déclaration. Dans son mémo du 11 octobre 2018, l'OSHA indique que de tels programmes sont admissibles au titre de 29 CFR 1904.35(b)(1)(iv) seulement s'ils ne sont pas mis en œuvre d'une manière qui décourage la déclaration, et qu'une politique de non-représailles seule « peut, à elle seule, ne pas être suffisante » [50]. L'OSHA recommande un processus de déclaration des accidents du travail, des maladies professionnelles, des quasi-accidents et des situations dangereuses, avec une option anonyme [49]. Pour le comité de direction, cela signifie qu'il faut afficher les quasi-accidents et les signalements de situations dangereuses à côté du nombre d'accidents, et ne jamais lier une récompense d'équipe au seul bilan de sécurité sans accident.

Le TRS (taux de rendement synthétique, en anglais OEE pour overall equipment effectiveness) découle de la maintenance productive totale ; le LEI énumère six grandes pertes : pannes, réglages et mises en train, petits arrêts, ralentissements, rebuts et reprises [22]. Au tableau de bord, le chiffre du TRS lui-même compte moins que la répartition par type de perte, car c'est elle qui permet à l'équipe de déduire des actions. Le recueil m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) traite ces indicateurs en détail.

### Ce que la recherche montre sur les KPI en management visuel d'atelier

Dans l'étude KIT et IPRI, 94 % des entreprises interrogées suivaient des KPI de qualité et de productivité dans le management d'atelier, tandis que les KPI de coûts étaient rarement utilisés [24][25]. L'utilisation numérique des KPI en quasi-temps réel faisait exception, avec un peu plus de 15 % des mentions, et la prévision des écarts n'était une réalité dans aucune des entreprises interrogées [24].

## Résolution de problèmes à l'atelier : du confinement au standard

Un voyant rouge au tableau de bord est un début, pas une fin. La résolution de problèmes en management d'atelier suit un schéma dérivé directement des règles d'or du management gemba [11] :

| Étape | Ce qui se passe | Qui | Quand |
|---|---|---|---|
| 1. Détecter | L'écart devient visible au tableau ou via l'andon | équipe | immédiatement ou lors de la réunion de niveau |
| 2. Contenir | Le confinement protège le client (par ex. contrôle à 100 %, mise en quarantaine, pièce de rechange) | chef d'équipe | dans le même poste |
| 3. Comprendre | Vérifier le gembutsu sur place, collecter les données, observer le processus | petite équipe au poste | après la réunion |
| 4. Trouver la cause racine | 5 Pourquoi, diagramme d'Ishikawa, A3 pour les problèmes complexes | équipe de résolution de problèmes | de quelques jours à quelques semaines |
| 5. Corriger | Mettre en œuvre la contre-mesure permanente | responsable selon la liste d'actions | selon le planning |
| 6. Vérifier l'effet | Suivre le KPI sur une période définie | chef d'équipe | après la mise en œuvre |
| 7. Standardiser | Mettre à jour le standard, l'instruction de travail et la formation ; partager entre lignes (yokoten) | superviseur, responsable de processus | une fois l'effet prouvé |

Une action n'est considérée comme clôturée que lorsque son effet apparaît dans le KPI. La règle paraît évidente, mais de nombreuses usines la transgressent : les listes d'actions sont déclarées « vertes » alors que le défaut revient la semaine suivante.

### Quelle méthode pour quel problème ?

| Type de problème | Caractéristique | Méthode | Temps nécessaire |
|---|---|---|---|
| Simple, cause évidente | cause et correctif clairs en réunion | action directe avec échéance | quelques minutes |
| Récurrent, cause incertaine | se reproduit, l'équipe ne connaît pas la cause | 5 Pourquoi, Ishikawa | quelques heures |
| Complexe, transverse | plusieurs causes, plusieurs services | résolution de problèmes A3 fondée sur le PDCA | quelques semaines |
| Systémique, stratégique | affecte le flux de valeur, l'implantation, le produit | événement kaizen, cartographie du flux de valeur | de quelques semaines à quelques mois |

L'A3 est particulièrement précieux car il réunit problème, état actuel, analyse de la cause racine, état cible, contre-mesures et suivi sur une seule feuille A3 (297 × 420 mm, proche du format tabloïd US de 11 × 17 po que la plupart des usines américaines utilisent à la place). La page d'entité [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) propose une introduction, et le recueil [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) traite du niveau systémique. Le cycle PDCA (planifier, faire, vérifier, agir), généralement attribué à W. Edwards Deming (Deming lui-même en créditait Walter A. Shewhart), est le fondement de tous les processus de résolution de problèmes [1].

## La marche gemba : étapes, questions et liste de contrôle

> **En bref :** Une marche gemba a un thème, commence au tableau, observe le travail sur plusieurs cycles, pose des questions ouvertes et se termine par un retour engagé envers l'équipe. Sans thème ni suivi, ce n'est qu'une promenade.

La marche gemba est la routine de management la plus importante dans la gestion de l'atelier. Le Lean Lexicon la définit comme « une pratique managériale qui consiste à appréhender la situation actuelle par l'observation directe et le questionnement avant d'agir » [7]. Une introduction concise est également disponible dans l'article [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) et sur la page d'entité [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Trois types de marches gemba

Jim Womack, fondateur de LEI, indique que lui et Dan Jones ont employé pour la première fois le terme « gemba walk » au début des années 1990, à l'origine pour des managers parcourant l'ensemble de la chaîne de valeur d'un produit à travers les départements et les entreprises [14]. Aujourd'hui, il distingue deux formes et en isole une troisième, utilisation désormais répandue du terme [14] :

| Type | Objectif | Fréquence typique | Qui |
|---|---|---|---|
| Marche de chaîne de valeur | sensibiliser à l'amélioration fondamentale de bout en bout | au besoin, par ex. trimestriellement | direction de l'usine et des secteurs, toutes les fonctions le long de la chaîne de valeur |
| Marche du système de management | vérifier que le système de management peut maintenir la stabilité (tableaux, standards, escalades) | hebdomadaire à quotidienne | responsables à tous les niveaux |
| Marche centrée sur un problème (genchi genbutsu) | aller au fond d'un problème précis sur place | au besoin | propriétaires du problème, spécialistes |

Womack critique la troisième utilisation et la rapproche du « management by walking around » : si le management quotidien fonctionne, les problèmes devraient déjà être résolus dans la cascade, au lieu que les cadres supérieurs et le personnel d'amélioration se précipitent au gemba pour éteindre des incendies. Leur temps est mieux investi dans les marches de chaîne de valeur et du système de management [14].

### Les trois questions directrices de LEI : objectif, processus, personnes

LEI recommande de structurer la marche gemba autour de trois dimensions [7] :

1. **Objectif :** quel problème ce processus résout-il pour le client ?
2. **Processus :** comment le travail se déroule-t-il réellement, par opposition à la manière dont le standard le décrit ?
3. **Personnes :** les salariés sont-ils engagés dans la création, le maintien et l'amélioration du processus ?

LEI recommande également de suivre une famille de produits ou un processus orienté client du début à la fin et d'y associer toutes les personnes concernées, car la valeur circule horizontalement entre les départements [7].

### Marche gemba et management by walking around

La marche gemba est souvent assimilée au « management by walking around » (MBWA). Cette pratique est née chez Hewlett-Packard ; le cofondateur David Packard l'avait découverte chez General Electric. Elle est devenue célèbre grâce au livre « In Search of Excellence » de Tom Peters et Robert Waterman (1982) [16]. Les différences restent considérables :

| Caractéristique | Marche gemba | Management by walking around |
|---|---|---|
| Objectif | comprendre le processus, repérer les écarts par rapport au standard, développer la capacité de résolution de problèmes | proximité avec les salariés, échange informel, perception de l'ambiance |
| Structure | thème, parcours, questions directrices, suivi | surtout non structurée et spontanée |
| Point de référence | standard, KPI, tableau | personnes et conversation |
| Résultat | observations précises, accompagnement, actions | relation, information |
| Ancrage | travail standard du leader, rythme fixe | style de leadership personnel |

Les deux ne s'excluent pas : un échange informel en passant ne remplace pas une marche gemba, mais il ne lui nuit pas non plus. L'article [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) compare plus en détail les deux concepts.

### Comment réaliser une marche gemba en sept étapes

**1. Définir un thème.** Chaque marche gemba a un axe, par exemple « changement de série sur la ligne 4 », « utilisation de la nouvelle instruction de contrôle » ou « effet des actions issues de la réunion de niveau 3 ». Sans thème, la marche devient une visite.

**2. Préparer.** Examiner les KPI et le tableau du secteur, vérifier les actions ouvertes, apporter le standard (instruction de travail, fiche de travail standard). Prévenir l'équipe à l'avance afin que la visite ne soit pas perçue comme un contrôle surprise. L'article [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) contient des conseils.

**3. Commencer au tableau.** Le tableau montre ce que l'équipe elle-même considère comme un problème. Demandez : « Que vous dit votre tableau aujourd'hui ? »

**4. Observer.** Restez à un même poste de travail et observez plusieurs cycles. Comparez ce que vous voyez avec le standard. Notez des faits, pas des interprétations.

**5. Poser des questions.** Des questions ouvertes et respectueuses à la personne qui fait le travail. Ne proposez pas de solutions toutes faites.

**6. Résumer et remercier.** À la fin, reformulez brièvement ce que vous avez appris et convenez de la suite à donner aux observations.

**7. Assurer le suivi.** Documentez les observations, intégrez les actions dans la réunion de niveau hiérarchique approprié, donnez un retour à l'équipe. Une visite sans retour érode la confiance.

**Ne pas oublier la deuxième et la troisième équipe.** Dans une usine à trois équipes, les responsables qui ne font leurs visites que pendant l'équipe de jour ne voient qu'un tiers de l'exploitation. Planifiez au moins occasionnellement une visite sur les équipes de nuit et de week-end ; les problèmes de dotation en personnel, de soutien de maintenance et de passation de consignes apparaissent souvent en premier à ces moments-là (recommandation de pratique).

**Combien de temps doit durer une visite gemba ?** Les sources utilisées ici ne donnent pas de valeur fixe. En pratique, une visite ciblée du système de management dans un secteur dure de 20 à 45 minutes ; une visite de flux de valeur sur toute une famille de produits peut prendre une demi-journée. La journée type de la section 10 prévoit 30 minutes. Ce sont des valeurs de pratique, non des affirmations des sources.

### Banque de questions pour la visite gemba

**Objectif et buts**
- Qui est le client de ce processus, et que lui faut-il ?
- Quel est l'objectif de votre équipe aujourd'hui, et comment savez-vous si vous l'atteignez ?
- Quel KPI compte le plus pour vous en ce moment, et pourquoi ?

**Processus et standard**
- Comment cette étape se déroule-t-elle normalement ? Pouvez-vous me la montrer ?
- Où le standard est-il écrit, et correspond-il à la réalité ?
- Comment voyez-vous immédiatement que quelque chose ne va pas ici ?
- Que se passe-t-il quand la matière manque ou que la machine s'arrête ?
- Où attendez-vous, cherchez-vous des éléments ou devez-vous refaire un travail ?

**Problèmes et résolution de problèmes**
- Quel a été le dernier problème que vous avez résolu ici ?
- Quel problème vous fait perdre le plus de temps en ce moment ?
- Que se passe-t-il lorsque vous signalez un problème ? Combien de temps faut-il pour obtenir de l'aide ?
- Quelle action du tableau est en retard, et que lui faut-il ?

**Personnes**
- Qu'est-ce qui vous empêche de bien faire votre travail ?
- Que changeriez-vous si la décision vous revenait ?
- Qui, à part vous, peut effectuer cette tâche ?
- Que puis-je faire pour vous soutenir ?

### Liste de contrôle de la visite gemba

Imprimez-la ou transformez-la en formulaire numérique (voir la section 17). Une version plus longue, avec des questions par rôle, figure dans l'article [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Le sujet et le secteur sont définis.
- [ ] Les KPI, l'état du tableau et les actions ouvertes ont été examinés à l'avance.
- [ ] Le standard concerné est à disposition (imprimé ou sur tablette).
- [ ] L'équipe ou le chef d'équipe a été informé.
- [ ] Les équipements de protection individuelle (EPI) et les règles de sécurité du secteur sont respectés.
- [ ] Au moins un poste de travail a été observé sur plusieurs cycles.
- [ ] Les questions étaient ouvertes ; aucune solution n'a été imposée.
- [ ] Les observations sont notées comme des faits (lieu, heure, ce qui a été vu).
- [ ] Les bonnes pratiques ont été reconnues.
- [ ] Les accords ont été résumés.
- [ ] Les actions sont saisies dans la liste d'actions ou la réunion de niveau suivant.
- [ ] Un retour à l'équipe est planifié.

### Erreurs courantes lors des visites gemba

| Erreur | Pourquoi c'est nuisible | Mieux vaut |
|---|---|---|
| Visite gemba vécue comme un contrôle | les personnes cachent les problèmes | interroger plutôt qu'auditer ; considérer les problèmes comme un cadeau |
| Imposer des solutions sur le moment | l'équipe désapprend la résolution de problèmes, le responsable devient un goulot d'étranglement | accompagner par des questions, laisser l'équipe élaborer la solution |
| Pas de sujet, pas de parcours | la visite reste superficielle | fixer un axe, apporter le standard |
| Seuls les responsables parlent | le savoir des experts n'est pas utilisé | écouter 80 % du temps |
| Pas de suivi | perte de confiance, « de toute façon rien ne se passe jamais » | retour dans la semaine |
| Visites irrégulières | la visite ressemble à un événement exceptionnel | rythme fixe dans le standard de travail du responsable |
| Recherche de coupables | peur, problèmes dissimulés | interroger le processus et le système, pas les personnes |

Beaucoup de ces erreurs ont une cause commune : la visite est comprise comme un contrôle. L'article [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) approfondit ce point. Womack décrit ainsi sa propre attitude : « Je n'ai jamais rien inventé. Je fais simplement des tournées, je commente ce que je vois et j'encourage les gens à essayer » (cité dans la préface de John Shook) [15].

## Standard work pour les dirigeants : le leadership comme routine

Le standard work pour les dirigeants applique le principe du travail standardisé aux managers. LEI le décrit comme « kaizen pour le management » : associé aux bons comportements de leadership, il fait passer le rôle des responsables de celui de principaux résolveurs de problèmes à celui de développement de la capacité de résolution de problèmes de leurs équipes [18].

Dans « Creating a Lean Culture », David Mann identifie quatre éléments principaux d'un système de management lean : le standard work pour les dirigeants, les contrôles visuels, un processus quotidien de responsabilisation et la discipline de leadership [19]. La part du travail standardisé diminue à chaque niveau hiérarchique : les opérateurs peuvent travailler selon le standard 100 % du temps, un superviseur environ 80 % de la journée ; aux niveaux supérieurs, cette part baisse encore [19].

### Exemple : standard work pour un superviseur de production

| Horaire | Activité | Preuve |
|---|---|---|
| 6 h 00–6 h 10 | Relève de poste, contrôle du tableau sur toutes les lignes | Journal de relève signé |
| 6 h 10–6 h 30 | Participer à deux des réunions de niveau 1 échelonnées (en rotation) | Liste de présence |
| 6 h 30–6 h 45 | Confirmation de processus : vérifier un standard sur une ligne | Fiche d'audit |
| 6 h 45–8 h 15 | Présence sur le terrain : soutien en cas de panne, résolution des manques de matières et de personnel, contrôle des tableaux | Notes, liste d'actions |
| 8 h 30–8 h 45 | Animer la réunion de niveau 2 | Tableau de niveau 2 |
| 8 h 45–9 h 00 | Préparer les escalades pour le niveau 3 | Liste d'escalades |
| 9 h 15–9 h 35 | Participer à la réunion de niveau 3 | Tableau de niveau 3 |
| 10 h 00–11 h 00 | Accompagner une équipe de résolution de problèmes (A3) | Statut A3 |
| 13 h 00–13 h 30 | Marche gemba sur un thème prioritaire | Notes, actions |
| 13 h 30–14 h 00 | Préparer la relève de poste | Journal de relève |

Ce plan est un exemple pratique, et non une déclaration de référence. Sur un poste de 6 h à 14 h, il structure plus des deux tiers de la journée ; Mann décrit environ 80 % comme réalisable à ce niveau [19]. Le reste reste volontairement libre pour l'imprévu, les questions humaines et les projets. Le standard work des dirigeants est lui-même visible : de nombreuses usines affichent les routines standard de leurs dirigeants sur le tableau et cochent les points réalisés. Cela crée une responsabilisation dans les deux sens.

### Confirmation de processus (audit de processus à plusieurs niveaux)

Un élément clé du standard work pour les dirigeants est la confirmation de processus : des responsables de différents niveaux vérifient brièvement, selon un rythme fixe, si un standard est respecté et s'il est toujours adapté. Plusieurs niveaux contrôlent les mêmes processus à des fréquences différentes, par exemple le chef d'équipe quotidiennement, le superviseur chaque semaine, le directeur d'usine chaque mois. Dans les usines américaines, notamment dans les chaînes d'approvisionnement automobiles, cette pratique porte généralement le nom de layered process audit (LPA). Les écarts ne sont pas sanctionnés ; ils sont considérés comme le signe d'un standard inadapté ou d'une formation manquante.

## Andon : rendre les écarts visibles en temps réel

LEI définit l'andon comme un outil de management visuel qui montre d'un coup d'œil l'état des opérations dans une zone et signale toute anomalie [17]. Le signal est déclenché par un cordon ou un bouton au poste de travail, ou automatiquement par un capteur de machine. Chez Toyota, la ligne continue de tourner après le tirage du cordon pendant que l'équipe tente de résoudre le problème ; si cela ne réussit pas dans le temps de cycle, la ligne s'arrête à une position fixe en fin de poste [17]. Le numéro de poste allumé appelle le chef d'équipe, dont on attend une réaction rapide [17].

Dans le management de proximité (shop floor management), l'andon comble l'écart entre les réunions planifiées : la réunion de tier examine la veille et planifie le jour, l'andon traite le moment présent. Chez Toyota, un chef d'équipe (hancho) dirige une équipe de cinq à huit personnes, réagit aux arrêts de ligne et aux appels andon, anime les activités d'amélioration et contrôle chaque jour le respect du travail standard à l'aide de feuilles d'audit [21]. Ce point est important lors du transfert du modèle vers les usines occidentales : le chef d'équipe Toyota est un salarié horaire, sans pouvoir disciplinaire et sans poste fixe sur la ligne ; il maîtrise l'ensemble des tâches de l'équipe et remplace en cas de pause, d'absence ou de retard [21]. Si vous ajoutez ce rôle à un opérateur référent entièrement lié au temps de cycle de la ligne, vous n'obtiendrez pas une réaction rapide à l'andon. Il en va de même pour un chef d'équipe responsable de 25 personnes.

Les événements andon ont leur place sur le tableau : nombre d'appels par équipe, temps de réponse moyen et motifs les plus fréquents. Beaucoup d'appels ne sont pas au départ un mauvais signe ; ils montrent que l'équipe rend les problèmes visibles.

## Rôles et responsabilités

| Rôle | Tâches dans le management de proximité |
|---|---|
| Directeur d'usine | modèle de comportement, anime le tier 4, se rend régulièrement au gemba, décide des ressources pour les escalades, déploie les objectifs (par exemple via hoshin kanri) |
| Responsable de département / de production | anime le tier 3, accompagne les superviseurs, veille à la cohérence entre les niveaux |
| Superviseur / chef d'équipe de quart | anime le tier 2, confirmation de processus, accompagne les chefs d'équipe |
| Chef d'équipe | anime le tier 1, tient le tableau avec l'équipe, réagit à l'andon, met en place les actions de confinement |
| Opérateurs et techniciens | signalent les écarts, apportent des idées, portent les actions, entretiennent certaines parties du tableau |
| Fonctions support (qualité, maintenance, supply chain, EHS) | participent aux tiers 2 et 3, prennent en charge les problèmes escaladés, fournissent les données |
| Coach de terrain / spécialiste lean ou CI | assiste aux réunions, donne un retour sur l'animation, forme à la résolution de problèmes |
| Représentants du personnel (syndicat, comité de sécurité ; en Allemagne, le comité d'entreprise) | associés en amont ; veillent à ce que les KPI ne servent pas à surveiller le comportement ou la performance des individus (voir section 13) |

CETPM décrit des coachs de terrain qui observent les réunions et donnent un retour après coup [3]. Ce rôle est souvent sous-estimé lors du déploiement : un chef d'équipe qui n'a jamais animé de réunion a besoin d'un retour concret dès les premières semaines.

### Comment le rôle du manager change

| Avant | Dans le management de proximité |
|---|---|
| résout personnellement les problèmes | développe la capacité de résolution de problèmes de l'équipe |
| reçoit les comptes rendus au bureau | voit la réalité sur le terrain |
| demande « Qui a fait ça ? » | demande « Qu'est-ce, dans le processus, a permis cela ? » |
| répond aux escalades par e-mail | répond aux escalades lors de la réunion suivante |
| juge les KPI | utilise les KPI pour engager la discussion |

## Culture, sécurité psychologique et règles de surveillance des employés

La gestion de proximité ne fonctionne que lorsque les problèmes sont nommés ouvertement. Cela semble évident, mais ce n'est pas le cas dans de nombreuses organisations. Un champ rouge sur le tableau qui entraîne des critiques envers l'équipe sera repeint en vert la fois suivante.

La chercheuse en organisation Amy Edmondson, de Harvard, a façonné le concept de sécurité psychologique d'équipe : « une conviction partagée par les membres d'une équipe selon laquelle l'équipe est un lieu sûr pour prendre des risques interpersonnels » [23]. Son étude portant sur 51 équipes de travail d'un fabricant de meubles employant environ 5 000 personnes a paru dans Administrative Science Quarterly en 1999 [23] ; elle compte parmi les travaux les plus cités sur les comportements d'apprentissage en équipe. Pour la gestion de proximité, l'implication est la suivante : seules les équipes psychologiquement sûres signalent les erreurs, documentent les quasi-accidents et remettent en question les standards.

### Comment les responsables construisent la sécurité psychologique au tableau

- **Le rouge est bienvenu.** Remerciez chaque personne pour chaque problème rendu visible. La réaction au premier champ rouge détermine tous ceux qui suivent.
- **Le processus, pas la personne.** Interrogez-vous sur les conditions, pas sur les coupables.
- **Montrez vos propres erreurs.** Les responsables qui reconnaissent ouvertement leurs propres ratés abaissent le seuil de signalement.
- **Répondez aux escalades.** Les personnes qui escaladent un problème sans jamais obtenir de réponse cessent d'escalader.
- **Mettez les idées en œuvre.** La mise en œuvre visible des suggestions est la forme de reconnaissance la plus forte. L'étude de KIT et IPRI critiquait le fait que les salariés ne pouvaient souvent pas voir l'état de leurs suggestions, ce qui réduit la motivation [24].
- **Ne sanctionnez pas les signalements de sécurité.** L'OSHA attend que les travailleurs « ne subissent pas de représailles » lorsqu'ils signalent des blessures, des maladies et des dangers [49] ; la réaction au tableau est l'endroit où cette attente devient réalité.

L'article [Culture d'excellence opérationnelle sur le terrain](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) décrit comment ancrer durablement une telle culture ; le recueil [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/) la replace dans un contexte plus large. Haufe Akademie désigne le hansei, la pratique japonaise de la réflexion autocritique, comme un élément constitutif d'une culture positive de l'erreur [43].

### Règles de surveillance des employés : droit du travail américain et comités d'entreprise allemands

Un tableau numérique qui affiche les données des machines à côté des identifiants de connexion des utilisateurs peut être perçu comme un système de surveillance. L'importance de ce point dépend du lieu où se trouve le site. Ce qui suit constitue une information générale, et non un avis juridique ; faites examiner tout déploiement numérique par un conseil en droit du travail.

**Aux États-Unis.** Il n'existe pas de droit général de cogestion comparable à celui de l'Allemagne, mais plusieurs règles s'appliquent :

- **Sites syndiqués :** Le NLRB a considéré l'installation et l'utilisation de caméras de surveillance dissimulées comme un sujet obligatoire de négociation (Colgate-Palmolive, 1997), position que la Cour d'appel du septième circuit a confirmée dans l'affaire National Steel Corp. c. NLRB (2003) [54]. La question de savoir si un tableau numérique spécifique traitant des données personnelles relève de l'obligation de négocier se tranche au cas par cas ; la voie la plus sûre consiste à associer le syndicat avant le déploiement.
- **Sites non syndiqués :** En octobre 2022, le Conseiller général du NLRB de l'époque a publié le mémorandum GC 23-02, qui affirmait qu'une surveillance électronique intrusive peut porter atteinte aux droits protégés des salariés au titre de la section 7 du NLRA et recommandait la divulgation des technologies de surveillance [52]. Le 14 février 2025, le Conseiller général par intérim a retiré ce mémorandum (GC 25-05) [53]. Le NLRA lui-même n'a pas changé ; une surveillance susceptible de dissuader une activité protégée reste donc un risque.
- **Lois d'États sur l'information préalable :** Certains États exigent une information sur la surveillance électronique. New York, par exemple, impose aux employeurs de notifier par écrit, dès l'embauche, les salariés dont l'utilisation du téléphone, de la messagerie ou d'Internet est surveillée [55]. Une application d'atelier qui enregistre l'utilisation individuelle du système peut relever de ces règles.
- **Signalement des incidents de sécurité :** Comme indiqué à la section 7, les règles de l'OSHA protègent les salariés qui signalent des blessures [49][50]. Un tableau qui désigne nommément la personne ayant signalé un incident affaiblit cette protection.

**En Allemagne (pertinent pour les entreprises américaines disposant d'usines en Allemagne ou d'une maison mère allemande).** Associer le comité d'entreprise (Betriebsrat, l'organe élu des salariés doté de droits légaux de cogestion) n'est pas une simple formalité. L'ifaa recommande de l'impliquer dès le départ et de concevoir les KPI de manière à ne pas susciter de crainte de surveillance [2]. Avec des tableaux de bord numériques qui exploitent des données machines et personnelles, le paragraphe 87(1) n° 6 de la loi allemande sur la constitution des entreprises (BetrVG) s'applique : le comité d'entreprise a son mot à dire sur « l'introduction et l'utilisation de dispositifs techniques conçus pour surveiller le comportement ou les performances des salariés » [44]. Selon la Cour fédérale du travail (BAG), il suffit qu'un système soit objectivement apte à collecter des données de comportement ou de performance ; l'intention de l'employeur de surveiller n'entre pas en ligne de compte [48]. Cela vaut en général pour Power BI, Power Apps ou un MES avec des identifiants utilisateur. Le RGPD s'applique en complément. Dans la pratique, un accord d'entreprise (Betriebsvereinbarung) règle les détails.

**Ce qui fonctionne dans les deux pays :** une règle écrite qui définit quelles données sont affichées à quel niveau d'agrégation, qui peut consulter quels rapports, combien de temps les données sont conservées, et précise que les KPI évaluent des processus et non des personnes. C'est le même contenu que celui d'un accord d'entreprise allemand, et il apporte à un syndicat ou à des salariés américains une réponse claire à la question : « Cela sera-t-il utilisé contre nous ? »

## Comment mettre en œuvre le management visuel en atelier : une feuille de route en six phases

> **En bref :** commencer par une zone pilote, concevoir le tableau avec l'équipe, le faire fonctionner pendant environ trois mois avec un accompagnement, et ne construire le niveau suivant que lorsque le niveau inférieur fonctionne de manière fiable.

L'ifaa a décrit un modèle de déploiement en six phases et l'a testé dans plusieurs petites et moyennes entreprises ; l'évaluation a montré que le concept peut être introduit avec des moyens simples [2]. La feuille de route ci-dessous s'appuie sur ce modèle et y ajoute la marche gemba, la cascade et la numérisation.

| Phase | Contenu | Participants | Durée (valeur indicative du guide) |
|---|---|---|---|
| 1. Fixer les objectifs | définir les objectifs, la zone pilote et les critères de réussite ; visite de l'usine | direction générale, responsables de production, chef de projet, animateur | une demi-journée selon l'ifaa [2] |
| 2. Informer et sensibiliser | séance d'information avec questions-réponses ; associer les représentants des salariés | direction, encadrement, salariés de la zone pilote, syndicat ou comité d'entreprise le cas échéant | une demi-journée selon le chiffre de l'ifaa [2] |
| 3. Introduire | concevoir le tableau avec l'équipe, choisir les KPI, s'entraîner à l'animation | encadrement et salariés de la zone pilote, 6 à 8 personnes | deux blocs d'une demi-journée de quatre heures maximum chacun selon l'ifaa [2] |
| 4. Phase d'essai | réunions quotidiennes en atelier, accompagnement, amélioration itérative du tableau | équipe pilote, coach | environ 3 mois selon l'ifaa [2] |
| 5. Bilan intermédiaire | observation neutre des réunions, retours | observateurs internes ou externes | régulièrement pendant la phase d'essai [2] |
| 6. Valider et déployer | atelier d'évaluation, standardiser le tableau et la réunion, construire la cascade, autres zones | tous les participants au projet, puis autres zones | atelier de 2 à 3 heures selon l'ifaa [2], déploiement selon la taille de l'usine |

### Recommandations pratiques pour chaque phase

**Phase 1 :** Choisir une zone pilote dotée d'un processus stable, d'une direction motivée et d'un problème visible. L'ifaa parle d'un « phare » qui porte le déploiement ultérieur [2]. Une zone plongée dans le chaos ne convient pas, car la stabilité doit d'abord être acquise.

**Phase 2 :** Expliquer le pourquoi, pas seulement le quoi. Préciser clairement que les KPI évaluent des processus et non des personnes.

**Phase 3 :** Laisser l'équipe concevoir le tableau. Commencer par quatre à six KPI au maximum [3] et une liste d'actions simple. Un tableau parfait dès le premier jour n'est ni nécessaire ni utile.

**Phase 4 :** Les premières semaines sont décisives. Les réunions durent d'abord plus longtemps qu'il ne le faudrait [3]. Un coach observe la réunion et donne ensuite un retour en privé à l'animateur. Orth évoque environ 15 minutes pour cela, couvrant un point fort, un axe de progression et une mission concrète [3]. Pendant les premières semaines, cela porte ses fruits chaque jour, puis chaque semaine. Les marches gemba du niveau de direction suivant commencent également durant cette phase.

**Phase 5 :** Utiliser une évaluation simple (voir le contrôle de maturité ci-dessous) pour vérifier que le système fonctionne.

**Phase 6 :** Construire le niveau 2 uniquement lorsque le niveau 1 fonctionne de manière fiable, puis les niveaux 3 et 4. Remplacer les réunions existantes plutôt qu'en ajouter de nouvelles. Gelbrich désigne cela comme une erreur typique lorsque le management visuel n'est pas utilisé pour remplacer les réunions existantes [3].

### Voraussetzungen und Erfolgsfaktoren nach ifaa

Die ifaa nennt als Voraussetzungen das Engagement der Geschäftsführung, ein Budget an Zeit und Geld, die unternehmensweite Kommunikation des Projekts, einen definierten Zielzustand (Vision und Mission), die Überzeugung der beteiligten Personen sowie die Einbindung des Betriebsrats [2]. Für den Erfolg betont sie außerdem eine Führungsebene, die an den Besprechungen vor Ort teilnimmt, klar kommunizierte und auf alle Ebenen heruntergebrochene Ziele, die Beteiligung und Qualifizierung der Mitarbeitenden sowie Disziplin, Beständigkeit und Ausdauer, denn Shopfloor Management ist keine einmalige Kampagne [2]. In Werken ohne Betriebsrat gilt dieselbe Logik für die Gewerkschaft oder, in einem nicht gewerkschaftlich organisierten Werk, für eine frühzeitige und offene Kommunikation mit der Belegschaft.

### Reifegradprüfung: Funktioniert Ihr Shopfloor Management?

- [ ] Das Board wurde heute aktualisiert, und das Team kann jede KPI erläutern.
- [ ] Jede rote KPI hat eine Maßnahme mit verantwortlicher Person und Fälligkeitstermin.
- [ ] Besprechungen beginnen pünktlich und bleiben im vorgegebenen Zeitrahmen.
- [ ] Eskalationen erreichen die nächste Ebene noch am selben Tag und werden beantwortet.
- [ ] Führungskräfte machen Gemba-Walks in einem festen Rhythmus.
- [ ] Maßnahmen werden erst geschlossen, wenn ihre Wirkung nachgewiesen ist.
- [ ] Die Zahl der gemeldeten Probleme und Beinahe-Unfälle ist gestiegen, nicht gesunken.
- [ ] Mindestens eine bestehende Besprechung wurde durch die Tier-Besprechung ersetzt.
- [ ] Verbesserte Prozesse sind in aktualisierten Standards dokumentiert.
- [ ] Mitarbeitende können den Status ihrer Ideen einsehen.

Acht oder mehr Ja-Antworten deuten auf ein wirksames System hin; weniger als fünf deuten auf ein Board hin, das eher Ritual als Führungsinstrument ist.

## Häufige Fehler und wie man sie behebt

Aus Beobachtungen seit 2015 in rund 50 deutschen Unternehmen verschiedener Branchen leitete Gelbrich zehn typische Gründe ab, warum Shopfloor Management scheitert [3]. Die Tabelle stellt sie den Gegenmaßnahmen gegenüber.

| Fehler (nach Gelbrich [3]) | Gegenmaßnahme |
|---|---|
| unrealistisch hohe Erwartungen ohne direktes Engagement der Führung | der Werksleiter moderiert Tier 4 persönlich und geht regelmäßig in den Gemba |
| fehlerhafte Verknüpfung der Ebenen des Shopfloor Managements | ineinandergreifende Kaskade, definierte Eskalationsauslöser, Reaktionspflicht |
| Inhaltsüberlastung durch unnötige Informationen | vier bis sechs KPIs, alles Übrige vom Board entfernen |
| komplizierte, zeitaufwendige Aktualisierung der Informationen | Datenerfassung vereinfachen, dort automatisieren, wo es sinnvoll ist |
| für den Prozess irrelevante KPIs | KPIs mit den drei Leitfragen neu ableiten |
| KPIs, die das Team nicht beeinflussen kann | auf die nächsthöhere Ebene verlagern |
| lange Aktualisierungsschleifen und veraltete Informationen | Aktualisierung als fester Punkt der Schichtübergabe |
| keine Gegenmaßnahmen bei festgestellten Abweichungen | Regel: kein Rot ohne Maßnahme |
| Shopfloor-Besprechungen, die zu lang dauern, besonders in der Einführungsphase | Zeitrahmen festlegen, im Stehen durchführen, Problemlösung aus der Besprechung auslagern |
| Shopfloor Management ersetzt bestehende Besprechungen nicht | Inventur der Besprechungen, Doppelungen streichen |

Drei weitere Fehler treten in der Praxis häufig auf:

- **KPI-Theater:** KPIs werden präsentiert, aber nicht besprochen. Die Frage „Was tun wir jetzt?“ fehlt.
- **Gemba-Tourismus:** Führungskräfte gehen ohne Thema, ohne Fragen und ohne Nachverfolgung durch das Werk.
- **Zu früh digitalisieren:** Ein Werk führt Software ein, bevor die Routinen etabliert sind. Digitalisiert wird dann ein Prozess, den niemand lebt.

## Analogique ou numérique ? Comparaison du management visuel d'atelier numérique

La question « tableau blanc ou écran ? » est souvent traitée comme une affaire de principe. Elle peut pourtant recevoir une réponse sobre. Les travaux disponibles suggèrent que la situation actuelle reste largement analogique : dans l'étude KIT et IPRI (18 entreprises), le management d'atelier était mené principalement sur papier et seulement en partie avec un support numérique ; seulement environ 10 % des réunions utilisaient un tableau d'atelier numérique, et l'affichage numérique des KPI ne commençait généralement qu'au niveau de l'encadrement intermédiaire [24][25]. L'étude décrit également des passages de relais défaillants entre le papier, Excel et OneNote, sans système directeur, ce qui complique le suivi entre les niveaux [24].

| Critère | Tableau analogique | Tableau numérique |
|---|---|---|
| Coût initial | très faible | licences, matériel, intégration |
| Appropriation concrète | l'équipe écrit dessus, forte identification | risque que l'équipe ne fasse que consommer l'information |
| Actualité | dépend de la mise à jour manuelle | automatique, quasi temps réel |
| Qualité des données | erreurs de saisie, lacunes | cohérentes, à condition que les sources soient fiables |
| Remontée entre niveaux | manuelle, sujette aux erreurs | de bout en bout, traçable |
| Suivi des actions | discipline individuelle | suivi par le système avec échéances et rappels |
| Équipes réparties, plusieurs sites | impossible | possible |
| Historique et analyse | photos, classeurs | analysable, tendances, schémas |
| Résilience | fonctionne toujours | dépend du réseau et des systèmes |
| Règles de surveillance des salariés | généralement peu critiques | règles écrites sur les données recommandées (syndicats, droit national ; accord d'entreprise en Allemagne) |
| Sécurité OT | non concernée | segmentation du réseau et contrôle des accès nécessaires (voir section 18) |

### Quelle approche selon la situation ?

- **Commencer en analogique** lorsque les routines sont nouvelles, que l'équipe est petite et que les KPI se relèvent facilement à la main. Le tableau blanc oblige à garder l'ensemble simple.
- **Passer en hybride** lorsque les données machines circulent automatiquement vers un écran, mais que les actions et les idées sont encore tenues à la main au tableau. Pour de nombreux sites, c'est le meilleur compromis.
- **Étendre au numérique** lorsqu'il faut relier plusieurs niveaux, équipes ou sites, lorsque la saisie manuelle demande trop d'efforts, ou lorsque des actions se perdent entre les niveaux.

CETPM se réfère à un modèle en cinq phases de Müller-Seegers pour la numérisation : définition du projet et des objectifs, test des fournisseurs et choix de l'outil, pilote (quatre semaines au maximum), phase d'ajustement (seulement si nécessaire), déploiement et exploitation ; il prévoit au total environ six mois [3]. Plus important que l'outil est l'ordre des étapes : d'abord la routine, ensuite le numérique. L'article [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) montre comment améliorer en parallèle le flux de matières.

## Construire un tableau de bord numérique d'atelier avec Microsoft 365

> **En bref :** Teams fournit l'espace, Power BI le mur des KPI, Power Apps la saisie de données, Lists la liste d'actions et Fabric les alertes en temps réel. Les leviers les plus importants sont les licences des lecteurs, l'intervalle d'actualisation de Power BI et le modèle de données.

De nombreux industriels utilisent déjà Microsoft 365 pour la messagerie, Teams et les documents. Il est logique de construire le tableau de bord numérique d'atelier là où les employés travaillent déjà. Les briques décrites ci-dessous sont documentées sur Microsoft Learn ; vérifiez les exigences de licence et la disponibilité pour votre propre locataire avant tout projet. Les fournisseurs du secteur public et de la défense américains sur les clouds gouvernementaux de Microsoft (GCC, GCC High) doivent vérifier séparément la disponibilité des fonctionnalités sur ces environnements.

### Architecture de référence en un coup d'œil

| Fonction du tableau | Brique Microsoft | Ce qu'elle fait (selon la documentation Microsoft) |
|---|---|---|
| Espace de communication par zone | Microsoft Teams (une équipe par zone, un canal par ligne ou niveau) | canaux avec onglets pour le tableau, les actions et les applications |
| Visualiser les KPI | Power BI, intégré comme onglet dans Teams | rapports interactifs dans les canaux et les conversations, aperçus de liens, notifications dans le flux d'activité [28] |
| KPI avec objectifs | Métriques Power BI (tableaux de bord) | métriques avec responsables, valeur actuelle et objectif, statut, points de contrôle ; sous forme d'onglet dans les canaux ou les réunions [31] |
| Saisie de données au poste de travail | Power Apps (application canevas en onglet Teams) | écrans de saisie personnalisés, par exemple pour les motifs d'arrêt, la mise au rebut, les idées [30] |
| Liste d'actions, suivi des anomalies | Microsoft Lists (par exemple le modèle « Suivi des problèmes ») ou Planner | listes avec vues, règles et notifications, stockées dans SharePoint [38] |
| Tâches standard sur plusieurs sites | Planner avec publication de tâches | diffuser des listes de tâches à de nombreuses équipes et suivre l'achèvement par site [37] |
| Communication de poste | Applications Teams pour les travailleurs de première ligne (Shifts, Walkie Talkie, Approbations, Mises à jour) | plannings de poste, communication à l'alternat, approbations, mises à jour récurrentes [35][36] |
| Données en temps réel et alertes | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Tableau de bord en temps réel, Activator) | capturer, analyser et visualiser les données en flux et agir automatiquement selon des conditions [32][33] |

### Power BI comme mur des KPI

Les rapports Power BI peuvent être intégrés comme onglet dans un canal Teams, de sorte que l'équipe voit et discute des KPI là où elle communique déjà [28]. Trois points comptent en pratique :

1. **Autorisations :** L'intégration d'un rapport dans Teams n'accorde pas automatiquement aux utilisateurs l'autorisation de le consulter ; les autorisations doivent être attribuées explicitement [28].
2. **Licences :** Les utilisateurs disposant d'une licence Fabric gratuite peuvent consulter le contenu d'un espace de travail sur une capacité Premium (référence P) ou une capacité Fabric F64 ou supérieure ; la création et le partage nécessitent Power BI Pro ou Premium par utilisateur [28]. En dessous de F64, chaque lecteur a donc besoin d'une licence Pro ou PPU. Avec de nombreux lecteurs sur le terrain, c'est le principal facteur de coût ; clarifiez la licence des écrans d'affichage en ligne avec votre partenaire de licences Microsoft.
3. **Limites :** Les tableaux de bord Power BI (par opposition aux rapports) ne peuvent pas être intégrés dans l'onglet Power BI, et cet onglet ne prend pas en charge les filtres d'URL [28].

**À quelle fréquence un tableau Power BI peut-il être mis à jour ?** L'actualisation automatique de page fonctionne pour les sources DirectQuery, Direct Lake et certains scénarios de connexion en direct, mais pas en mode importation [29]. En capacité partagée (typique avec les seules licences Pro), l'intervalle minimal est de 30 minutes et la détection des modifications n'est pas disponible. En capacité dédiée (Fabric F, Premium P) et avec Premium par utilisateur, des intervalles descendant jusqu'à une seconde sont possibles avec DirectQuery si l'administrateur de la capacité l'autorise ; l'intervalle minimal par défaut est de cinq minutes, et de cinq secondes pour la détection des modifications [29]. Cela suffit pour un tableau affichant les unités par heure ; pour de véritables fonctions de signalisation andon, Real-Time Intelligence est la meilleure option.

### Power Apps pour la saisie de données au poste de travail

Les applications canevas créées avec Power Apps peuvent être ajoutées à un canal Teams via l'onglet « Power Apps », à condition que l'application ait d'abord été partagée avec les utilisateurs [30]. Applications typiques en atelier :

- saisie du motif d'arrêt avec quelques grands boutons (par exemple « matière manquante », « casse d'outil », « qualité »),
- saisie des rebuts et des retouches par heure,
- idées et suggestions d'amélioration avec une photo,
- une liste de contrôle numérique de visite gemba avec observations et actions,
- confirmation de process (audit de processus en couches) sur tablette.

Microsoft répertorie des limitations connues, par exemple que les capteurs tels que la localisation ou la boussole ne sont pas pris en charge dans l'application de bureau Teams, et que les pièces jointes ne peuvent pas être téléchargées dans l'application mobile Teams [30]. Point important pour la décision d'architecture : les environnements Dataverse pour Teams sont obsolètes [30]. Selon Microsoft, aucun nouvel environnement Dataverse pour Teams ne peut être créé à partir du 15 novembre 2026 ; les environnements qui n'ont pas été mis à niveau sont suspendus le 15 septembre 2027 et désaffectés le 30 octobre 2027 [45]. Les nouvelles solutions doivent donc être développées sur un environnement Dataverse standard, des listes SharePoint ou d'autres sources de données.

**La question des licences Power Apps :** les tables Dataverse, les connecteurs premium et les passerelles de données locales (par exemple, pour une base de données MES dans l'usine) nécessitent des droits Power Apps premium [46]. Une application de saisie basée sur des listes SharePoint fonctionne généralement avec les droits inclus dans Microsoft 365 ; le Power Platform Licensing Guide décrit le périmètre exact. Cet embranchement détermine souvent le coût par utilisateur sur la ligne.

### Actions et tâches

Microsoft Lists, utilisable comme onglet dans Teams, convient bien à la liste d'actions. Microsoft décrit Lists comme un outil de suivi d'informations telles que les anomalies, les équipements, les routines ou les incidents, avec des vues, des règles et des notifications personnalisables ; un modèle « Suivi des anomalies » est disponible, et les données sont stockées sur le site d'équipe SharePoint [38]. Une liste comportant les colonnes problème, KPI, cause racine, action, responsable, échéance, statut, efficacité vérifiée et niveau d'escalade reprend la colonne actions du tableau. Un filtre par niveau affiche exactement les éléments pertinents pour chaque réunion de niveau.

Les routines standardisées, comme les contrôles 5S quotidiens ou les confirmations de processus hebdomadaires sur toutes les lignes, peuvent être diffusées avec la publication de tâches dans Planner. Microsoft décrit comment les responsables des opérations peuvent publier des listes de tâches vers des équipes selon une hiérarchie définie et suivre l'achèvement à travers des rapports par tâche et par liste ; les tâches peuvent contenir des listes de contrôle allant jusqu'à 20 éléments [37].

### Temps réel et alertes avec Microsoft Fabric

Pour les usines qui souhaitent exploiter les données machines en temps réel, Microsoft Fabric Real-Time Intelligence propose plusieurs briques [32] :

- **Eventstream** capture, transforme et achemine de grands volumes de données en temps réel sans code ; les connecteurs comprennent MQTT, Apache Kafka et la capture des modifications de bases de données. Les sources Azure telles que Event Hubs et IoT Hub sont disponibles dans le hub Temps réel.
- **Eventhouse** est optimisé pour les événements de streaming horodatés ; les requêtes utilisent KQL (Kusto Query Language) ou, dans le jeu de requêtes KQL, T-SQL.
- **Tableau de bord en temps réel** visualise les données en mouvement.
- **Activator** surveille les flux de données avec une faible latence (inférieure à la seconde pour les règles sans état sur les données en streaming) et déclenche des actions lorsque des seuils sont atteints ou que des schémas sont détectés, y compris l'absence de données. Les actions comprennent les messages Teams à des personnes, des groupes ou des canaux, les e-mails, les flux Power Automate et les éléments Fabric tels que les pipelines ou les notebooks [33].

Microsoft cite explicitement la fabrication et l'IoT comme scénarios [32]. Pour le management visuel de l'atelier, cela signifie qu'une règle Activator peut, par exemple, publier un message dans le canal Teams de la ligne lorsqu'une machine est à l'arrêt depuis plus longtemps qu'une durée définie. C'est un andon numérique qui parvient au chef d'équipe sur son smartphone. Il complète le tirage de cordon et le feu de signalisation sur la ligne, sans les remplacer, tant que tous les chefs d'équipe ne disposent pas d'un téléphone professionnel.

### Exemple : un tableau de niveau 1 dans Teams

| Onglet du canal | Contenu | Brique |
|---|---|---|
| « Tableau » | page SQDCP avec statut rouge/vert, objectif horaire vs réel, 3 principales causes d'arrêt | Rapport Power BI |
| « Saisie » | causes d'arrêt, rebuts, idées | Application canevas Power Apps |
| « Actions » | liste d'actions filtrée au niveau 1 | Microsoft Lists |
| « Routines » | contrôles quotidiens, 5S, confirmation de processus | Planner (tâches publiées) |
| « Objectifs » | objectifs de zone avec points d'étape | Power BI Metrics |
| Messages du canal | escalades, messages andon, relève de poste | Teams, Activator, Power Automate |

### Plan de mise en œuvre : six étapes vers votre premier tableau numérique de niveau 1

Pour les administrateurs Microsoft 365, l'ordre suivant a fait ses preuves. Il suppose que l'équipe pilote travaille déjà avec un tableau analogique.

1. **Photographier le tableau et définir les KPI.** Reprendre les champs et les KPI du tableau analogique ; pour chaque KPI, définir la formule, la source, la cible et le besoin de rafraîchissement.
2. **Créer l'équipe et les canaux.** Une équipe par domaine, un canal par ligne ou par niveau ; les autorisations passent par des groupes et non par des personnes individuelles.
3. **Construire la liste d'actions dans Microsoft Lists.** Colonnes comme dans « Actions et tâches » ci-dessus, une vue par niveau, rappel à la date d'échéance.
4. **Créer l'application de saisie.** Une application canevas avec quelques grands boutons pour les motifs d'arrêt et les rebuts ; données dans des listes SharePoint ou Dataverse (attention à la question des licences).
5. **Connecter le rapport Power BI.** Une page de rapport par tableau, logique rouge/vert par rapport aux cibles, DirectQuery ou Direct Lake si un rafraîchissement de page est nécessaire ; intégrer comme onglet dans le canal et accorder un accès en lecture.
6. **Tester pendant quatre semaines dans la réunion, puis étendre.** Ce n'est que lorsque l'équipe fait fonctionner le tableau numérique dans la réunion de niveau 1 elle-même que suivent les alertes Activator, les routines Planner et le lien vers le niveau 2.

Convenir des règles de données avec les représentants des salariés avant l'étape 4 (et, en Allemagne, avec le comité d'entreprise), car à partir de cette étape, des données pouvant être rattachées à des personnes peuvent être créées.

### Ce que Microsoft 365 ne remplace pas

Microsoft 365 est une boîte à outils, et non un système finalisé de management visuel d'atelier. Vous devez concevoir vous-même la logique de cascade, les règles d'escalade, le lien entre KPI, action et effet vérifié, ainsi que la discipline d'animation. Sans modèle de données clair, on aboutit rapidement à un ensemble de listes et de rapports non reliés, précisément les ruptures de transmission entre outils que la recherche critique dans le management visuel analogique [24]. Vérifiez tôt la question du matériel également : grands écrans en ligne, tablettes robustes et comptes d'appareils partagés génèrent leur propre effort.

## Intégration des données : MES, ERP et données machines

> **En bref :** Les unités et les arrêts proviennent automatiquement de la machine ou du MES ; les motifs d'arrêt et les idées sont saisis simplement à la main. Chaque KPI est défini une seule fois et calculé de la même manière à chaque niveau.

Un tableau numérique n'est aussi bon que ses données. Sources typiques :

| Source | Données pour le tableau | Voie typique |
|---|---|---|
| ERP (p. ex. SAP, Microsoft Dynamics 365) | commandes, quantités planifiées, dates d'échéance, carnet de commandes | export de données ou connecteur vers Power BI ou Fabric |
| MES / collecte de données de production et machines | unités, arrêts, motifs d'arrêt, TRS, rebuts | connexion base de données ou API, réplication dans Fabric |
| Commandes machines (automates programmables, OPC UA) | états, compteurs, valeurs de process | passerelle edge, p. ex. Azure IoT Operations avec le connecteur OPC UA, puis via MQTT |
| Système de gestion de la qualité (QMS) | résultats de contrôle, réclamations | connexion base de données ou API |
| Systèmes RH et de planification / équipes | présence, planning de postes | interface, agrégé |
| Saisie manuelle | motifs d'arrêt, idées, événements de sécurité | Power Apps, Microsoft Lists |

En termes ISA-95 (ANSI/ISA-95, internationalement IEC 62264), le tableau se situe au-dessus du niveau 3 (management des opérations de fabrication, comme le MES) et du niveau 4 (planification d'entreprise et logistique, comme l'ERP) ; la norme traite principalement de l'interface entre ces deux niveaux [56]. Utiliser son vocabulaire pour les commandes, les matières et les équipements facilite l'alignement du modèle de données du tableau avec le MES et l'ERP.

Pour la connexion des machines, Microsoft décrit le connecteur OPC UA dans Azure IoT Operations : il se connecte à des serveurs OPC UA, lit les données et les publie sous forme de messages JSON au format OPC UA PubSub vers le broker MQTT ; il peut aussi découvrir automatiquement les actifs [34]. De là, les flux de données d'Azure IoT Operations acheminent les données vers des destinations telles que Microsoft Fabric OneLake, Azure Data Explorer ou un point de terminaison Kafka [47]. La documentation examinée ici ne décrit pas directement de connecteur OPC UA dans Fabric ; la voie passe par la passerelle edge.

Dès que les réseaux machines sont connectés à des services cloud, la sécurité OT fait partie du projet. La série ISA/IEC 62443 traite de la sécurité des systèmes d'automatisation et de contrôle industriels et relie exploitation et informatique [57] ; le NIST Cybersecurity Framework (CSF) 2.0, publié le 26 février 2024, se décrit comme une taxonomie de résultats de cybersécurité de haut niveau et peut servir de référence pour piloter ce travail [59]. Un tableau d'atelier doit lire les données du réseau OT, et non ouvrir un accès vers celui-ci.

### Principes de l'architecture des données

1. **Une seule vérité par KPI.** Définissez chaque KPI une seule fois (formule, source, granularité) et utilisez cette définition à tous les niveaux. Ainsi, le TRS affiché au tableau de bord de niveau 1 correspond au TRS du rapport d'usine.
2. **Automatiser ce qui est stable.** Les quantités et les arrêts proviennent de la machine ou du MES. Les motifs d'arrêt qui exigent un jugement humain sont saisis manuellement, de façon simple et rapide.
3. **Une latence adaptée à la décision.** Le niveau 1 a besoin de valeurs horaires ou en temps réel, le niveau 4 de valeurs quotidiennes ou hebdomadaires. Tout n'a pas besoin d'être en temps réel.
4. **Respect de la vie privée et des règles relatives aux salariés dès le départ.** Les données personnelles sont agrégées ; les rôles et les droits d'accès sont documentés.

Le recueil [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) traite en profondeur ces questions d'informatique industrielle, et [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) montre où mènent ensuite les données de l'usine en temps réel.

## Support logiciel : l'exemple d'iFAKT Polaris

> **Remarque : l'auteur travaille chez iFAKT GmbH.**

Outre la création de votre propre tableau avec Microsoft 365, il existe des logiciels spécialisés dans le management lean numérique. Un exemple est [Polaris](https://www.m365.fm/entity/polaris/) de [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), dont le siège se trouve à Stuttgart, en Allemagne. Les solutions Polaris sont référencées sur Microsoft AppSource, notamment Polaris VSM pour la cartographie numérique de la chaîne de valeur [39] et Polaris BSM pour la modélisation des processus métier dans le management lean numérique [40]. Le recueil [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) décrit en détail la gamme de produits.

Selon le fournisseur, deux modules sont pertinents pour le management en atelier [unverified: information non vérifiée] :

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** achemine les tâches directement vers l'atelier, par exemple les actions issues des réunions par niveaux ou des gemba walks, afin qu'elles parviennent aux responsables sur la ligne et que leur réalisation puisse être suivie.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** affiche les KPI dans des tableaux de bord et alimente le mur des KPI du tableau aux différents niveaux.

Évaluation : une solution spécialisée ne conçoit pas davantage à votre place votre cascade, vos règles d'escalade et la discipline d'animation qu'une solution développée en interne. Elle peut en revanche pré-structurer le lien entre KPI, action et effet vérifié, et ainsi réduire le travail de conception de votre propre modèle de données. L'essentiel est de savoir si la solution s'intègre à votre environnement informatique existant ; la fiche AppSource indique un accent mis sur l'écosystème Microsoft.

Outre Polaris, de nombreux autres éditeurs existent, comme les modules d'atelier des éditeurs de MES ou les plateformes autonomes de lean et de réunions par niveaux. Quel que soit l'éditeur, ces questions aident à la sélection :

- Le logiciel modélise-t-il la cascade avec escalade et réaction sur plusieurs niveaux ?
- Une action ne peut-elle être clôturée qu'une fois son effet prouvé ?
- Quelles interfaces existent avec l'ERP, le MES et les machines, et qui les maintient ?
- Le logiciel peut-il agréger les KPI selon les règles de données qui vous sont imposées (convention collective, législation d'un Land, accord d'entreprise) ?
- Que se passe-t-il lorsque le réseau de la ligne tombe en panne ?
- Comment les utilisateurs en lecture sont-ils licenciés, et combien coûte un écran à la ligne ?

À propos de l'entreprise : iFAKT GmbH a son siège Curiestrasse 2, 70563 Stuttgart, Allemagne (registre du commerce de Stuttgart HRB 22661) [61]. Selon la société, elle a été fondée en 2001 et compte environ 25 salariés (informations de l'entreprise, non vérifiées de manière indépendante). Son site affiche un sceau TÜV SÜD attestant la certification ISO 9001 et ISO/IEC 27001 [61], et elle a obtenu la deuxième place dans la catégorie production du Best of Technology Award 2025 du magazine économique allemand WirtschaftsWoche avec son système Polaris IMS [60].

## Glossaire

| Terme | Signification |
|---|---|
| A3 | résolution de problème sur une seule feuille A3 (aux États-Unis, généralement 11 × 17 in.) : problème, état actuel, cause racine, objectif, contre-mesures, suivi |
| Andon | signal (cordon, bouton, voyant) qui rend immédiatement un écart visible et appelle à l'aide |
| Escalade | transmission d'un problème au niveau hiérarchique supérieur lorsque l'équipe ne peut pas le résoudre seule |
| Gemba | en japonais, « le lieu réel » ; là où la valeur est créée |
| Gembutsu | la « chose réelle » au gemba : machine, outil, matière, pièce défectueuse |
| Genchi genbutsu | aller voir par soi-même et vérifier les faits sur place |
| Hoshin kanri | méthode de déploiement des objectifs de l'entreprise à tous les niveaux (aussi appelée déploiement de politique) |
| Audit de processus à plusieurs niveaux (confirmation de processus) | contrôle bref d'un standard par des responsables de plusieurs niveaux, selon un rythme fixe |
| Travail standard du responsable | routines quotidiennes fixes et visibles pour les responsables |
| Obeya | « grande salle » ; salle de réunion où tous les KPI et projets sont affichés sur les murs |
| OEE | efficacité globale des équipements : disponibilité × performance × qualité |
| SQDCP | structure du tableau par sécurité, qualité, délais, coûts, personnel (aussi SQCDP) |
| Réunion de niveau | courte réunion régulière au tableau à un niveau précis de la hiérarchie |
| TRIR | taux total d'incidents enregistrables : cas déclarables OSHA × 200 000 / heures travaillées |
| Yokoten | transfert d'une solution éprouvée vers d'autres lignes ou usines |
| DirectQuery / Direct Lake | modes de connexion Power BI dans lesquels les données sont interrogées directement au lieu d'être importées ; nécessaires à l'actualisation automatique des pages |
| F64 | taille d'une capacité Microsoft Fabric permettant aux lecteurs de voir le contenu sans licence Power BI payante |

## FAQ : management en atelier et visites gemba

### Qu'est-ce que le management en atelier, en termes simples ?

Le management en atelier signifie que les responsables dirigent là où le travail est effectué. L'équipe se réunit brièvement chaque jour devant un tableau comportant quelques KPI, discute des écarts, convient d'actions et transmet à l'échelon supérieur les problèmes qu'elle ne peut pas résoudre. Les responsables se rendent régulièrement sur le terrain pour voir par eux-mêmes.

### Quels sont les éléments du management en atelier ?

Six éléments : des responsables présents sur le terrain (gemba), la gestion visuelle, quelques KPI sur lesquels l'équipe peut agir, une cadence de réunion fixe en réunions de niveau, une résolution structurée des problèmes et la standardisation. Des instituts de recherche allemands les regroupent un peu différemment [2][4], et les pages de fournisseurs américains évoquent souvent cinq piliers, mais le contenu est le même.

### Que signifie gemba ?

Gemba (aussi genba) est un mot japonais qui signifie « le lieu réel ». Dans le lean, il désigne le lieu où la valeur est créée, généralement l'atelier [7][8]. Genchi genbutsu, « aller voir par soi-même », en est l'action associée : le gemba est un lieu, le genchi genbutsu est ce que l'on y fait [8].

### Qu'est-ce qu'une visite gemba ?

Une visite gemba est une visite planifiée d'un responsable sur le lieu où la valeur est créée. Le responsable observe le travail, le compare au standard et pose des questions ouvertes pour comprendre la situation avant d'agir [7]. Une bonne visite a un thème, commence au tableau et se termine par un retour à l'équipe.

### Quels sont les trois principes d'une visite gemba ?

La version la plus citée vient de Fujio Cho, ancien président de Toyota : « Aller voir, demander pourquoi, faire preuve de respect » [15]. LEI ajoute trois points à observer lors de la visite : la finalité (quel problème le processus résout pour le client), le processus (comment il fonctionne réellement) et les personnes (si elles sont impliquées dans son amélioration) [7].

### Quelle est la différence entre le management en atelier et une visite gemba ?

Le management en atelier est l'ensemble du système de direction : tableau, KPI, réunions de niveau, résolution de problèmes et standards. La visite gemba n'en est qu'une routine : le responsable se rend là où le travail est effectué, observe et pose des questions pour comprendre la situation avant d'agir [7].

### Combien de temps doit durer une réunion d'atelier ?

Environ 10 à 15 minutes au niveau de l'équipe et 20 à 30 minutes au niveau de la direction. Gelbrich cite 10 à 12 minutes au niveau opérationnel et 20 à 30 minutes au niveau de la direction ; pendant le déploiement, les réunions durent souvent plus longtemps [3].

### Qu'est-ce qu'une réunion de niveau 1, 2 ou 3 ?

Une réunion de niveau est une courte réunion standardisée au tableau, à un niveau donné de l'organisation. Le niveau 1 correspond à l'équipe de terrain, le niveau 2 aux superviseurs d'un secteur, le niveau 3 aux responsables de département et le niveau 4 à la direction de l'usine [58]. Les réunions sont échelonnées afin que les problèmes puissent remonter dans la journée.

### Qu'est-ce qu'un tableau de gestion d'atelier ?

Un tableau de gestion d'atelier (également appelé tableau de réunion rapide ou tableau SQDCP) est le tableau blanc ou l'écran autour duquel l'équipe se réunit pour la réunion de niveau. Il présente quelques KPI avec cible et tendance, les actions ouvertes avec leurs responsables et leurs échéances, ainsi que les escalades vers le niveau supérieur. Une mise en page type comporte des colonnes par SQDCP et des lignes pour le statut, la tendance et les actions.

### Que signifie SQDCP ?

SQDCP signifie sécurité, qualité, délais, coûts et personnel (également écrit SQCDP). L'ordre est le message : la sécurité est abordée en premier dans chaque réunion. Les variantes sont SQDC, SQDCM (moral) ou SQDCE (environnement).

### Quels KPI doivent figurer sur un tableau de gestion d'atelier ?

Quatre à six KPI sur lesquels l'équipe peut agir [3], organisés selon SQDCP : sécurité (accidents avec arrêt déclarables, presqu'accidents), qualité (rebuts, rendement au premier passage), délais (objectif vs réel, livraison à l'heure), coûts ou productivité (TRS, unités par heure) et personnel (présence, polyvalence, idées).

### À quelle fréquence faut-il faire une marche gemba ?

Il n'existe pas de chiffre universel. Ce qui compte est un rythme fixe et fiable, ancré dans le travail standard des responsables. En pratique, les superviseurs et chefs d'équipe font une marche thématique quotidienne, les responsables de département plusieurs fois par semaine et le directeur d'usine au moins une fois par semaine ; les marches de chaîne de valeur ont lieu selon les besoins. Les chefs d'équipe sont de toute façon sur le gemba toute la journée et utilisent à la place la confirmation quotidienne du processus. Plus important que la fréquence : chaque marche doit avoir un thème et un suivi.

### Qui doit faire une marche gemba ?

Les responsables à tous les niveaux, chacun avec un axe différent : les superviseurs et responsables de département font surtout des marches sur le système de management (les tableaux, les standards et les escalades fonctionnent-ils ?), la direction de l'usine fait des marches de chaîne de valeur transversales, et les spécialistes des marches centrées sur les problèmes [14]. Les chefs d'équipe travaillent de toute façon sur le gemba et utilisent la confirmation de processus. Associez les personnes qui interviennent sur le processus, comme le recommande LEI [7].

### Combien de temps doit durer une marche gemba ?

Les sources consultées ne donnent pas de durée fixe. Une marche ciblée dans un seul secteur dure en général 20 à 45 minutes ; une marche de chaîne de valeur sur une famille de produits peut durer une demi-journée. Observer plusieurs cycles à un même poste compte davantage que couvrir beaucoup de terrain.

### Quelles questions poser lors d'une marche gemba ?

Les questions ouvertes sont les plus efficaces, par exemple « Comment se déroule normalement cette étape ? », « Comment voyez-vous qu'il y a un problème ? », « Quel est le dernier problème que vous avez résolu ici ? » et « Que puis-je faire pour vous soutenir ? ». La banque complète de questions figure dans la section sur la marche gemba.

### La marche gemba est-elle la même chose que le management by walking around ?

Non. Le MBWA vient de Hewlett-Packard et a été rendu célèbre par « Le prix de l'excellence » (1982) [16] ; il porte surtout sur la proximité et les échanges informels. La marche gemba est plus structurée, se réfère aux standards et aux KPI, et sert à comprendre le processus et à développer la capacité de résolution de problèmes.

### Le management d'atelier fonctionne-t-il dans les petites entreprises ?

Oui. L'ifaa a testé son modèle de déploiement dans plusieurs petites et moyennes entreprises et a constaté qu'il peut être introduit avec des moyens simples [2]. Dans les petites entreprises, deux niveaux suffisent souvent : une réunion d'équipe et une réunion de direction.

### Ai-je besoin d'un logiciel pour le management d'atelier ?

Pas pour commencer. Un tableau blanc, des aimants et des marqueurs suffisent pour mettre en place les routines. Un logiciel devient rentable lorsque plusieurs niveaux, équipes ou sites doivent être reliés, lorsque la saisie manuelle des données demande trop d'efforts, ou lorsque des actions se perdent entre les niveaux [24].

### Puis-je construire un tableau d'atelier numérique avec Microsoft Teams et Power BI ?

Oui. Les rapports Power BI peuvent être intégrés en onglets dans les canaux Teams [28], Power Apps assure la saisie des données au poste de travail [30], Microsoft Lists gère la liste des actions [38] et Microsoft Fabric Real-Time Intelligence les alertes en temps réel [32][33]. Tenez compte des exigences de licence pour les lecteurs (lecteurs gratuits uniquement à partir de Fabric F64 ou d'une capacité Premium), des intervalles minimaux d'actualisation automatique des pages dans Power BI (30 minutes en capacité partagée) et de l'abandon de Dataverse pour Teams [28][29][45].

### Combien de temps faut-il pour mettre en place le management d'atelier ?

Pour une zone pilote, le modèle de l'ifaa prévoit une phase d'essai d'environ trois mois après la définition des objectifs et les ateliers d'information et de lancement [2]. Un déploiement sur l'ensemble d'une usine, avec une cascade fonctionnelle à tous les niveaux, prend nettement plus de temps selon la taille du site, car chaque niveau doit fonctionner de façon fiable avant de construire le suivant.

## Conclusion

Le management de l'atelier n'est ni un tableau ni un logiciel, mais un système de leadership aux mécanismes clairs : les responsables se rendent là où la valeur est créée, l'équipe rend les écarts visibles à l'aide de quelques KPI qu'elle peut influencer, de courtes réunions de niveau planifiées font remonter les problèmes le jour même jusqu'à l'endroit où ils peuvent être résolus, et chaque solution ne devient le nouveau standard qu'une fois son effet prouvé. La visite gemba est la routine par laquelle les responsables comprennent au lieu de supposer.

L'expérience documentée montre deux choses. Premièrement, le management de l'atelier est répandu mais échoue souvent selon les mêmes schémas : liens manquants entre les niveaux, tableaux surchargés, réunions qui durent trop longtemps et manque d'implication de la direction [3]. Deuxièmement, la situation actuelle est majoritairement analogique, avec des transmissions défaillantes entre les outils qui rendent l'escalade et le suivi des actions plus difficiles [24]. La numérisation peut aider, mais seulement lorsque les routines sont déjà ancrées dans les pratiques.

Pour les entreprises qui utilisent Microsoft 365, un tableau numérique avec Teams, Power BI, Power Apps, Lists et Fabric constitue une option évidente. Planifiez le modèle de données, les licences, les intervalles d'actualisation et les règles relatives aux données des employés dès le départ. Et commencez là où tout déploiement devrait commencer : avec une équipe pilote, un tableau simple, une plage horaire de 15 minutes et un responsable qui écoute.

## Pour aller plus loin sur m365.fm

**Articles de blog**
- [Qu'est-ce qu'une visite gemba ?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Liste de contrôle et questions pour la visite gemba](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Visite gemba vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Préparation d'une visite gemba : équipe et rôles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Erreurs lors d'une visite gemba : quand la visite devient un contrôle](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Culture de l'excellence opérationnelle dans l'atelier](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Optimisation de l'atelier : moyens d'améliorer le flux](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Termes**
[Management de l'atelier](https://www.m365.fm/entity/shop-floor-management/) · [Visite gemba](https://www.m365.fm/entity/gemba-walk/) · [Réunion de niveau](https://www.m365.fm/entity/tier-meeting/) · [Gestion visuelle](https://www.m365.fm/entity/visual-management/) · [Résolution de problèmes A3](https://www.m365.fm/entity/a3-problem-solving/) · [Travail standard](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Indicateur clé de performance](https://www.m365.fm/entity/key-performance-indicator/) · [Micro-arrêts](https://www.m365.fm/entity/micro-stops/) · [Taux de rebut](https://www.m365.fm/entity/scrap-rate/) · [Management Lean](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Guides associés**
- [Fabrication Lean](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/)
- [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Cartographie du flux de valeur](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Jumeau numérique dans la fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT de fabrication avec Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) à Stuttgart, en Allemagne. Sur m365.fm, il écrit sur le management lean, l'excellence opérationnelle et la numérisation de la production avec Microsoft 365 et Azure. Son objectif est de montrer comment des routines lean éprouvées, comme la gestion de l'atelier et le gemba walk, peuvent fonctionner avec des plateformes de données modernes sans perdre leur essence.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version; sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German page; English page: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/
