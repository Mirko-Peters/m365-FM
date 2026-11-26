# SEO metadata

| Field | Value |
|---|---|
| Meta title | Cybersécurité OT et IEC 62443 : guide pour industriels |
| Meta description | Cybersécurité OT pour industriels : ISA/IEC 62443 expliquée avec zones, conduits, niveaux de sécurité, exemple d'usine, feuille de route, KPI et FAQ. |
| Slug | `ot-cybersecurity-iec-62443` |

# Cybersécurité OT et ISA/IEC 62443 : guide pratique pour les industriels

> **Réponse courte :** La cybersécurité OT (sécurité des technologies opérationnelles) protège les systèmes qui font fonctionner la production physique, comme les automates programmables (PLC), les systèmes SCADA, les IHM, les robots, les variateurs et les systèmes de sécurité, afin qu'une usine reste sûre, disponible et capable de produire des pièces conformes. La référence internationale en la matière est la série ISA/IEC 62443 : elle attribue des responsabilités aux propriétaires d'actifs, aux intégrateurs et aux fournisseurs de produits, regroupe les actifs en zones reliées par des conduits, fixe un niveau de sécurité cible (SL 1 à 4) pour chaque zone et vérifie chaque zone au regard de sept exigences fondamentales [1][2]. Aux États-Unis, on l'associe en général au NIST Cybersecurity Framework 2.0 et à la publication NIST SP 800-82 [9][11].

> **Points clés**
> - En OT, la disponibilité et la sécurité passent en premier. Une règle de pare-feu ou un correctif qui arrête une ligne peut causer plus de dégâts que l'attaque qu'il devait prévenir.
> - La norme ISA/IEC 62443 est une série de normes, et non un document unique. Les parties 2-1 (programme de sécurité), 3-2 (évaluation des risques et zones), 3-3 (exigences système), 4-1 et 4-2 (exigences applicables aux fournisseurs) font l'essentiel du travail dans une usine [1].
> - La méthode de base est simple à énoncer : recenser vos actifs, les regrouper en zones, définir les conduits entre les zones, fixer un niveau de sécurité cible par zone, puis combler l'écart entre le niveau visé et le niveau atteint [2].
> - Dans la plupart des cas documentés, les arrêts de production ont commencé dans l'informatique de bureau, et non dans les automates. Colonial Pipeline, Norsk Hydro et Clorox ont tous arrêté ou ralenti leurs opérations après des attaques contre leur environnement informatique [17][20][35].
> - Une première année pratique pour une usine de taille moyenne : inventaire des actifs, modèle de zones et de conduits, une DMZ industrielle segmentée, un accès distant contrôlé, des sauvegardes hors ligne et un plan de réponse aux incidents OT répété. La détection et les exigences fournisseurs viennent en deuxième année.
> - Le NIST SP 800-82 Rev. 3 (2023) est le guide américain actuel de sécurité OT ; le NIST a publié le projet initial de la révision 4 le 21 septembre 2026, restructurée autour du CSF 2.0, avec des commentaires ouverts jusqu'au 30 novembre 2026 [9][10].
> - Des certifications existent pour les produits (ISASecure CSA, SSA, SDLA) et, depuis juin 2025, pour les sites en exploitation (ISASecure ACSSA, fondée sur les normes 62443-2-1, 2-4, 3-2 et 3-3) [7][8].
> - Budgétez le programme comme la maintenance : une ligne annuelle stable avec des KPI clairs, et non un projet ponctuel.

## Table des matières

1. [Qu'est-ce que la cybersécurité OT ?](#quest-ce-que-la-cybersécurité-ot-)
2. [Sécurité IT et OT : pourquoi la méthode du bureau échoue dans l'atelier](#sécurité-it-vs-ot--pourquoi-le-guide-de-lentreprise-échoue-dans-latelier)
3. [Ce qui arrête réellement les usines : incidents et schémas de menace](#ce-qui-arrête-réellement-les-usines--incidents-et-schémas-de-menace)
4. [Le paysage des référentiels : 62443, NIST, CISA, CMMC, NIS2 et le CRA](#le-paysage-des-référentiels--62443-nist-cisa-cmmc-nis2-et-le-cra)
5. [ISA/IEC 62443 expliquée : structure, rôles et statut](#isaiec-62443-expliqué--structure-rôles-et-statut)
6. [Exigences fondamentales, niveaux de sécurité et niveaux de maturité](#exigences-fondamentales-niveaux-de-sécurité-et-niveaux-de-maturité)
7. [Zones et conduits et le modèle de Purdue](#zones-conduits-et-modèle-de-purdue)
8. [L'évaluation des risques selon la 62443-3-2, étape par étape](#lévaluation-des-risques-selon-62443-3-2-étape-par-étape)
9. [Exemple détaillé : zones et conduits pour une usine de taille moyenne](#exemple-détaillé--zones-et-conduits-pour-une-usine-de-taille-moyenne)
10. [Inventaire des actifs OT](#inventaire-des-actifs-ot)
11. [Segmentation réseau et DMZ industrielle](#segmentation-réseau-et-zone-démilitarisée-industrielle)
12. [Accès distant sécurisé pour les fournisseurs et les ingénieurs](#accès-distant-sécurisé-pour-les-fournisseurs-et-les-ingénieurs)
13. [Gestion des correctifs et des vulnérabilités en OT](#gestion-des-correctifs-et-des-vulnérabilités-dans-lot)
14. [Comptes, durcissement et supports amovibles](#comptes-durcissement-et-supports-amovibles)
15. [Surveillance et détection](#surveillance-et-détection)
16. [Sauvegarde, reprise et réponse aux incidents OT](#sauvegarde-reprise-et-réponse-aux-incidents-ot)
17. [Exigences fournisseurs et achats](#exigences-fournisseurs-et-achats)
18. [Personnel, sécurité et atelier](#personnes-sécurité-et-atelier)
19. [Obligations américaines et européennes : CMMC, SEC, CIRCIA, NIS2 et le CRA](#obligations-américaines-et-européennes--cmmc-sec-circia-nis2-et-cra)
20. [Feuille de route sur 12 à 24 mois](#une-feuille-de-route-sur-12-à-24-mois)
21. [Budget et retour sur investissement : comment bâtir le dossier](#budget-et-roi--comment-justifier-le-projet)
22. [Indicateurs clés de la sécurité OT](#kpi-de-sécurité-ot)
23. [Erreurs courantes](#erreurs-courantes)
24. [Limites de l'IEC 62443 et des programmes de sécurité OT](#limites-de-la-cei-62443-et-des-programmes-de-sécurité-ot)
25. [Glossaire](#glossaire)
26. [FAQ](#faq--cybersécurité-ot-et-iec-62443)
27. [Conclusion](#conclusion)

**Qui doit lire quelle partie**

| Lecteur | Commencer par |
|---|---|
| Directeur d'usine ou directeur des opérations | Sections 1 à 3, 9, 16, 20 et 21 |
| Ingénieur contrôle-commande ou automatisme | Sections 5 à 15 |
| Responsable IT ou sécurité débutant en OT | Sections 2, 7, 11 à 15 |
| Achats et qualité fournisseurs | Section 17 |
| DAF ou contrôleur de gestion de site | Sections 3, 21 et 22 |
| Fournisseur de la défense ou entreprise disposant de sites dans l'UE | Section 19 |

## Qu'est-ce que la cybersécurité OT ?

La technologie opérationnelle (OT, *operational technology*) désigne le matériel et les logiciels qui surveillent et contrôlent les processus physiques. Le NIST décrit l'OT comme « un large éventail de systèmes et de dispositifs programmables qui interagissent avec l'environnement physique » et cite comme exemples les systèmes de contrôle industriels, l'automatisation des bâtiments, les systèmes de transport, le contrôle d'accès physique et la surveillance environnementale [9]. Dans une usine, cela recouvre les automates programmables industriels (API) d'une ligne d'emboutissage, le système de contrôle distribué (DCS) d'une cabine de peinture, le serveur de supervision et d'acquisition de données (SCADA) pour les utilités, les interfaces homme-machine (IHM) installées aux postes, les contrôleurs de robots, les variateurs, les systèmes de vision, les postes d'ingénierie qui programment l'ensemble, ainsi que les systèmes instrumentés de sécurité (SIS) qui amènent le procédé dans un état sûr.

La cybersécurité OT est l'ensemble des politiques, des mesures techniques et des routines qui empêchent ces systèmes d'être perturbés, manipulés ou utilisés comme passerelle vers le reste de l'entreprise. L'objectif diffère de la sécurité informatique classique. Au bureau, la première question est généralement « les données sont-elles confidentielles ? ». Dans l'atelier, les premières questions sont « quelqu'un peut-il être blessé ? » et « la ligne va-t-elle continuer à tourner et à produire de bonnes pièces ? ».

### OT, ICS, IACS, SCADA : démêler les termes

Le domaine emploie plusieurs termes qui se recouvrent. Ils comptent, car les normes les utilisent avec précision.

| Terme | Signification | Où on le rencontre |
|---|---|---|
| OT (technologie opérationnelle) | Terme générique pour les systèmes qui interagissent avec le monde physique | Le NIST SP 800-82 Rév. 3 l'utilise dans son titre [9] |
| ICS (système de contrôle industriel) | Systèmes de contrôle dans l'industrie : API, DCS, SCADA et leurs réseaux | Anciens documents du NIST et de la CISA, MITRE ATT&CK for ICS [15] |
| IACS (système d'automatisation et de contrôle industriel) | Terme utilisé par la norme ISA/IEC 62443 : personnes, matériels, logiciels et politiques intervenant dans l'exploitation d'un procédé industriel | Toutes les parties de la 62443 [1][2] |
| SCADA | Supervision de sites distribués (pipelines, réseaux d'utilités, eau) | Services publics, systèmes énergétiques à l'échelle de l'usine |
| DCS | Système de contrôle distribué, typique des usines de procédés continus | Chimie, agroalimentaire, pharmacie, cabines de peinture |
| API | Automate programmable industriel, pilier de la fabrication discrète | Machines, convoyeurs, lignes d'assemblage |
| SIS | Système instrumenté de sécurité ; exécute les fonctions instrumentées de sécurité | Sécurité des procédés, presses, brûleurs |
| IIoT | Internet industriel des objets : capteurs et dispositifs qui envoient des données vers des plateformes en périphérie ou dans le cloud | Maintenance prédictive, suivi énergétique ; IEC PAS 62443-1-6 [5] |

Dans la pratique, « sécurité OT », « cybersécurité OT », « sécurité ICS » et « cybersécurité industrielle » sont utilisés comme synonymes. Ce guide emploie « sécurité OT » pour la discipline et « IACS » lorsqu'il s'agit de ce qu'exige la 62443.

### Pourquoi la fabrication est-elle concernée ?

De nombreux directeurs d'usine supposent encore que les cyberattaques sont un problème informatique et que leurs machines sont « isolées du réseau ». Dans la plupart des usines, ce n'est plus vrai depuis des années. Les MES, les historiens, les interfaces avec l'ERP, la maintenance à distance assurée par les constructeurs de machines, les tableaux de bord dans le cloud et les capteurs IIoT relient l'atelier à l'entreprise et à Internet. La CISA classe la fabrication critique (métallurgie primaire, machines, équipements électriques et matériel de transport) parmi les secteurs d'infrastructures critiques américaines, dont le ministère de la Sécurité intérieure est l'agence de gestion des risques sectoriels [32] ; on la compte généralement parmi 16 secteurs [unverified: la page CISA citée n'indique pas ce nombre].

Le coût d'une usine à l'arrêt est facile à comprendre pour quiconque en a dirigé une. Chaque heure d'arrêt coûte de la marge sur coûts variables, des heures supplémentaires pour rattraper le retard, des rebuts liés aux lots interrompus, des frais d'accélération et, au pire, des pénalités clients. Les cas de la section 3 montrent que les attaquants le savent. Les groupes de rançongiciels n'ont pas besoin de comprendre un API pour arrêter la production ; il leur suffit de chiffrer les systèmes sans lesquels l'usine ne peut pas fonctionner.

Pour un contexte plus approfondi sur le volet données de l'usine, consultez les guides sur [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) et [Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/), qui décrivent comment les données de l'atelier atteignent les systèmes d'entreprise et le cloud. Chacune de ces connexions constitue un conduit au sens de la 62443.

## Sécurité IT vs OT : pourquoi le guide de l'entreprise échoue dans l'atelier

Les sécurités IT et OT utilisent beaucoup des mêmes outils : pare-feux, comptes, journalisation, sauvegardes. Mais les systèmes, les priorités et les conséquences diffèrent suffisamment pour que copier le guide du bureau dans l'atelier provoque des arrêts de production. Le guide de démarrage rapide de l'ISAGCA condense la priorité de l'atelier dans un concept : les **fonctions essentielles** qui doivent être maintenues « pour préserver la santé, la sécurité, l'environnement et la disponibilité de l'Équipement sous contrôle ». Il énumère la fonction instrumentée de sécurité, la fonction de commande et la capacité de l'opérateur à observer et manipuler l'équipement ; leur perte signifie perte de protection, perte de contrôle ou perte de visibilité [2].

| Aspect | IT de bureau typique | OT d'atelier typique |
|---|---|---|
| Priorité absolue | Confidentialité et intégrité des données | Sécurité, disponibilité et intégrité du procédé ; la confidentialité compte, mais vient généralement en second |
| Conséquence d'une défaillance | Perte de données, amendes, atteinte à la réputation | Blessures, rejets dans l'environnement, dommages matériels, rebuts, pertes de production |
| Durée de vie des systèmes | 3 à 5 ans pour les ordinateurs portables et serveurs | 15 à 25 ans pour les automates et machines est courant en pratique [fourchette issue de la pratique, unverified as an industry statistic] |
| Fenêtres de changement | Nuit ou semaine | Arrêts planifiés, parfois une ou deux fois par an |
| Correctifs | Automatisés, mensuels | Seulement après approbation et test du fournisseur ; certains appareils ne peuvent pas être corrigés du tout |
| Redémarrages | Acceptables | Un redémarrage peut arrêter une ligne ou détruire un lot |
| Protocoles | Authentifiés, chiffrés (HTTPS, Kerberos) | De nombreux protocoles industriels historiques ont été conçus sans authentification ni chiffrement |
| Antivirus et agents | Standard sur chaque poste | Souvent non pris en charge par le fournisseur du IHM ou de l'automate ; la liste blanche est plus sûre |
| Performance | Des délais de quelques secondes sont gênants | Des délais de quelques millisecondes peuvent faire basculer un procédé |
| Responsabilité | Service informatique | Maintenance, ingénierie des automatismes, production, souvent le constructeur de machines |
| Qui modifie quoi | Administrateurs | Techniciens, intégrateurs, fournisseurs, parfois opérateurs |

### Ce que cela signifie en pratique

Trois règles découlent du tableau.

1. **Pas de scan actif des automates sans test.** Un scanner de vulnérabilités inoffensif sur un serveur de fichiers peut faire planter un ancien PLC ou IHM. La découverte d'actifs en OT commence par l'écoute passive (surveillance du trafic réseau) ou utilise les outils d'ingénierie du fournisseur.
2. **Les changements de sécurité nécessitent l'accord de la production.** Toute règle de pare-feu, modification de compte ou correctif dans une zone à fonctions essentielles suit la gestion des changements (MOC), exactement comme une modification de recette ou de verrouillage de sécurité.
3. **La mesure compensatoire est le cas normal.** Lorsqu'une IHM sous Windows 7 ne peut être remplacée qu'au prochain renouvellement de la ligne, on la protège en la plaçant dans une petite zone, en restreignant ses conduits, en supprimant l'accès USB et en surveillant son trafic. Accepter une mesure compensatoire dans cette situation est précisément ce que prévoit la méthode 62443.

### Là où l'IT et l'OT doivent travailler ensemble

L'erreur inverse consiste à déclarer la sécurité OT affaire d'atelier, dont l'IT devrait rester à l'écart. Les incidents présentés dans la section suivante montrent que les attaquants entrent souvent par les systèmes d'identité, la messagerie ou le support, gérés par l'IT. Un programme efficace comporte un seul responsable des risques au niveau du site, une équipe mixte sécurité IT et ingénierie des automatismes, et des responsabilités clairement attribuées pour chaque zone. Le tableau des rôles de la section 18 montre une façon de les répartir.

## Ce qui arrête réellement les usines : incidents et schémas de menace

Les cas documentés ci-dessous ne visent pas à effrayer qui que ce soit. Ils montrent par où les attaques sont entrées, pourquoi la production s'est arrêtée et ce qui a aidé à la reprise. Chaque chiffre provient d'une source primaire ou d'une source secondaire fiable ; lorsqu'une entreprise n'a jamais divulgué de chiffre, le tableau le précise.

| Incident | Ce qui s'est passé | Effet sur les opérations | Chiffres communiqués | Enseignement pour la sécurité OT |
|---|---|---|---|---|
| NotPetya chez Merck (juin 2017) | Un logiciel destructeur s'est propagé dans le monde entier à partir d'une mise à jour compromise d'un logiciel de comptabilité ukrainien | Plus de 40 000 ordinateurs de Merck endommagés [18] | Merck a réclamé 1,4 milliard de dollars à ses assureurs ; en mai 2023, une cour d'appel du New Jersey a jugé que la clause d'exclusion de guerre ne s'appliquait pas ; les parties ont transigé en janvier 2024, aux conditions non divulguées [18] | Un réseau à plat permet aux logiciels malveillants d'atteindre les systèmes de production ; l'assurance ne remplace pas la capacité de reprise |
| Norsk Hydro (mars 2019) | Une attaque par rançongiciel a touché l'ensemble de l'organisation mondiale dans la nuit du 19 mars 2019 | Extruded Solutions a subi les plus lourdes pertes opérationnelles ; les autres secteurs d'activité ont continué à produire à peu près normalement grâce à des « solutions de contournement à forte intensité de main-d'œuvre et procédures manuelles » [17] | Hydro a estimé le coût total à environ 800 millions de couronnes norvégiennes [17] | Les procédures manuelles de repli et une communication ouverte ont raccourci la crise |
| Colonial Pipeline (mai 2021) | Attaque par rançongiciel du groupe DarkSide le 7 mai 2021 ou vers cette date | Les opérations du pipeline ont été arrêtées [35] | Colonial a payé environ 75 bitcoins ; le ministère américain de la Justice a saisi 63,7 bitcoins, valorisés à environ 2,3 millions de dollars à l'époque [16] | Un incident de rançongiciel a conduit à l'arrêt d'une exploitation physique. Le PDG de Colonial a expliqué au Sénat que les attaquants avaient chiffré les systèmes informatiques et que l'entreprise avait arrêté l'ensemble du système pour empêcher le logiciel malveillant de gagner le réseau OT, faute de connaître l'origine et l'étendue de l'attaque [36] |
| Clorox (août 2023) | Le 11 août 2023, des attaquants ont obtenu la réinitialisation des identifiants et de l'authentification multifacteur en appelant le service d'assistance informatique externalisé [20] | Clorox a arrêté la fabrication et est passé à une gestion manuelle des commandes ; le volume des ventes a baissé de 6 % dans les six mois suivant l'attaque [20] | La plainte de Clorox contre Cognizant (juillet 2025) réclame 380 millions de dollars de dommages et intérêts, dont 49 millions de dollars de coûts de remédiation ; Clorox a fait état de 100 millions de dollars de recouvrements d'assurance ; Cognizant conteste sa responsabilité [19][20] | L'identité et les processus du service d'assistance font partie de la sécurité OT ; un appel d'ingénierie sociale peut arrêter une usine |
| Jaguar Land Rover (août/septembre 2025) | Cyberattaque ayant interrompu la production de véhicules | Les lignes de production ont été arrêtées pendant plusieurs semaines ; le Cyber Monitoring Centre britannique a recensé plus de 5 000 organisations au Royaume-Uni touchées [21] | Le Cyber Monitoring Centre a estimé l'impact financier au Royaume-Uni à 1,9 milliard de livres sterling (environ 2,55 milliards de dollars) [21] | Des chaînes d'approvisionnement très étroitement couplées propagent l'arrêt d'une seule usine à des milliers de fournisseurs |

### Les schémas derrière les cas

Lus côte à côte, les cas révèlent quatre schémas qui structurent la suite de ce guide.

- **Entrée par l'IT, impact sur l'OT.** Dans aucun des cinq cas, les sources citées ne décrivent une attaque directe contre des automates. Les opérations se sont arrêtées parce que des réseaux partagés, des identités partagées ou des systèmes métier dépendants ont défailli. C'est pourquoi la frontière de zone entre l'entreprise et l'usine (la DMZ industrielle) et l'hygiène des identités figurent en tête de la feuille de route.
- **Arrêts décidés par l'exploitant.** Clorox a mis des systèmes hors ligne et arrêté la fabrication après avoir détecté l'intrusion, puis a traité les commandes manuellement [20] ; le pipeline de Colonial a été arrêté après l'attaque par rançongiciel [35]. Une usine qui connaît les systèmes métier dont elle dépend, et qui peut fonctionner en mode dégradé, dispose de plus de choix.
- **La reprise prend des semaines.** Même des entreprises bien préparées ont eu besoin de plusieurs semaines pour retrouver une production normale. Les sauvegardes, la reconstruction des postes d'ingénierie et la vérification de la logique des automates déterminent la durée de cet écart.
- **Les tiers font partie de la surface d'attaque.** Les mises à jour logicielles (NotPetya), les services d'assistance externalisés (Clorox) et les intégrateurs (voir la fiche CISA/FBI en section 12) figurent tous dans le recensement [14][18][20].

### Attaques visant les contrôleurs

Les attaques qui manipulent le procédé industriel lui-même sont plus rares, mais elles existent, et ce sont elles qui justifient l'existence des niveaux de sécurité 3 et 4 de la norme 62443. MITRE tient une base de connaissances publique sur le comportement des adversaires contre les systèmes de contrôle industriels, ATT&CK for ICS. Sa matrice (version de contenu 20.1) regroupe les techniques en 12 tactiques, de l'accès initial (Initial Access) jusqu'à l'impact (Impact), en passant par Inhibit Response Function et Impair Process Control [15]. Deux tactiques sont propres à l'OT : **Inhibit Response Function** (empêcher les fonctions de sécurité et de protection de réagir) et **Impair Process Control** (manipuler la commande du procédé) [15].

Pour les défenseurs, ATT&CK for ICS est utile de trois manières :

1. Comme liste de contrôle pour la détection : quelles techniques votre supervision pourrait-elle voir ?
2. Comme vocabulaire commun entre les analystes de sécurité IT et les ingénieurs d'automatisme.
3. Comme donnée d'entrée pour les scénarios de menace de l'évaluation des risques de la norme 62443-3-2 (section 8).

Ce guide reste du côté défensif. Il ne décrit pas comment mettre en œuvre une technique quelle qu'elle soit.

## Le paysage des référentiels : 62443, NIST, CISA, CMMC, NIS2 et le CRA

Les industriels américains font face à un ensemble de référentiels très fourni. Ils ne se font pas autant concurrence qu'il y paraît ; ils répondent à des questions différentes.

| Référentiel | Éditeur | Question à laquelle il répond | Contraignant ? | Statut (novembre 2026) |
|---|---|---|---|---|
| Série ISA/IEC 62443 | ISA (comité ISA99) et IEC | Comment les propriétaires d'actifs, les intégrateurs et les fournisseurs sécurisent-ils un IACS sur tout son cycle de vie ? | Volontaire ; devient contraignant via les contrats, les exigences des clients ou les régulateurs | Parties principales publiées ; plusieurs en révision (section 5) [1][6] |
| NIST Cybersecurity Framework (CSF) 2.0 | NIST | Comment l'organisation gouverne-t-elle et gère-t-elle globalement le risque cyber ? | Volontaire | Publié le 26 février 2024 ; six fonctions : Govern, Identify, Protect, Detect, Respond, Recover [11] |
| NIST SP 800-82 Rév. 3, Guide to OT Security | NIST | Comment les architectures OT, les menaces et les contre-mesures s'inscrivent-elles dans un cadre de contrôle américain ? | Volontaire (référence pour les agences fédérales) | Version finale en septembre 2023 ; Rév. 4, projet initial de diffusion publique du 21 septembre 2026 [9][10] |
| NIST IR 8183 Rév. 2, CSF 2.0 Manufacturing Profile | NIST | Quels résultats du CSF comptent le plus pour les industriels ? | Volontaire | Projet initial de diffusion publique du 29 septembre 2025 [12] |
| CISA Cybersecurity Performance Goals (CPG) 2.0 | CISA | Quel socle de base mesurable pour les infrastructures critiques ? | Volontaire | CPG 2.0 publié le 10 décembre 2025, avec une nouvelle composante de gouvernance [13] |
| CMMC 2.0 | Département de la Défense américain | Un sous-traitant de la défense protège-t-il les FCI et les CUI ? | Contractuel pour les marchés du DoD | Règle du programme en vigueur depuis le 16 décembre 2024 ; règle DFARS depuis le 10 novembre 2025, déployée par phases [28][29] |
| Règles de divulgation cyber de la SEC | Securities and Exchange Commission américaine | Quand et comment les sociétés cotées doivent-elles divulguer les incidents significatifs ? | Obligatoire pour les émetteurs enregistrés auprès de la SEC | Adoptées le 26 juillet 2023 [26] |
| CIRCIA | CISA | Quand les entités d'infrastructures critiques concernées doivent-elles signaler les incidents ? | Obligatoire dès l'entrée en vigueur de la règle finale | Règle finale en cours d'examen par la Maison-Blanche depuis le 1er octobre 2026, non encore publiée au 9 novembre 2026 [27][39] |
| Directive NIS2 | Union européenne (lois des États membres) | Quelles entités essentielles et importantes de l'UE doivent-elles gérer le risque cyber et signaler les incidents ? | Obligatoire pour les entités de l'UE concernées | Loi de transposition allemande en vigueur depuis le 6 décembre 2025 [24] |
| Cyber Resilience Act (CRA) | Union européenne | Quelles exigences de sécurité les produits comportant des éléments numériques doivent-ils respecter sur le marché de l'UE ? | Obligatoire pour les produits mis sur le marché de l'UE | Obligations de notification applicables depuis le 11 septembre 2026 [22] |

### Comment les pièces s'articulent

Une combinaison opérationnelle pour un industriel américain se présente ainsi :

- **CSF 2.0 pour la gouvernance et le conseil d'administration.** Il offre aux directions, aux auditeurs, aux assureurs et aux clients un langage commun. La nouvelle fonction Govern couvre les rôles, l'appétence au risque et le risque fournisseur [11].
- **62443 pour la conception des sites et la chaîne d'approvisionnement.** C'est le seul référentiel du tableau qui attribue des responsabilités concrètes aux propriétaires d'actifs, aux intégrateurs et aux fournisseurs de produits, et qui définit les zones, les conduits et les niveaux de sécurité [1][2].
- **SP 800-82 comme pont.** Il traduit les spécificités OT dans l'univers des contrôles NIST. Le projet de Rév. 4 est restructuré autour de CSF 2.0 et ajoute des recommandations sur la gestion des actifs, la surveillance du réseau et les principes du zero trust pour les fonctions de gestion des systèmes [10].
- **CPG comme contrôle de cohérence.** Ils sont courts et mesurables ; utiles pour établir une base de référence rapide avant de lancer le programme complet 62443 [13].
- **CMMC, SEC, CIRCIA, NIS2 et CRA** uniquement lorsqu'ils vous concernent (section 19).

Le NIST Manufacturing Extension Partnership (MEP) aide les petites et moyennes entreprises industrielles à réaliser des auto-évaluations fondées sur CSF, des analyses d'écarts et des plans de réponse aux incidents [30]. Pour de nombreux sites de moins de 500 salariés, c'est le moyen le plus abordable de démarrer.

## ISA/IEC 62443 expliqué : structure, rôles et statut

### L'origine de la norme

L'International Society of Automation (ISA) a créé son comité ISA99 en 2002 pour rédiger des normes de cybersécurité pour les systèmes d'automatisation et de contrôle. Vers 2010, le comité a commencé à travailler étroitement avec la Commission électrotechnique internationale (CEI), et les documents ont été renumérotés ISA/IEC 62443 [3]. Les documents ISA sont publiés sous la forme ANSI/ISA-62443-x-y ; la CEI publie le même contenu sous la forme IEC 62443-x-y. L'ISA indique que la série est approuvée par les Nations unies, et la CEI l'a désignée en 2021 comme norme horizontale, c'est-à-dire applicable à tous les secteurs plutôt qu'à un seul [1].

Pour un lecteur américain, le point pratique est que les éditions ANSI/ISA s'achètent auprès de l'ISA et les éditions CEI sur la boutique en ligne de la CEI ; elles sont techniquement alignées. Les dates et les numéros d'édition diffèrent parfois entre les deux éditeurs, citez donc toujours l'édition exacte dans les contrats.

### Les quatre groupes de documents

La série est organisée en quatre groupes [1][2] :

1. **Général (1-x) :** terminologie, concepts, modèles, indicateurs.
2. **Politiques et procédures (2-x) :** ce que le propriétaire de l'actif et les prestataires de services doivent faire en tant qu'organisation.
3. **Système (3-x) :** évaluation des risques, zones et conduits, et exigences techniques pour l'ensemble de la solution d'automatisation.
4. **Composant (4-x) :** processus de développement sécurisé et exigences techniques pour les produits individuels.

### Les parties et leur statut

Le tableau combine le catalogue ISA [1], la boutique en ligne de la CEI [4][5] et un aperçu secondaire [3]. Statut au mois de novembre 2026.

| Partie | Titre (court) | Public principal | Édition actuelle (ISA / IEC) | Note sur le statut |
|---|---|---|---|---|
| 1-1 | Terminologie, concepts et modèles | Tous | ISA-62443-1-1 (2007) ; IEC TS 62443-1-1 (2009) | Deuxième édition en préparation depuis longtemps [3] |
| 1-5 | Schéma des profils de sécurité 62443 | Organismes sectoriels, fournisseurs | IEC TS 62443-1-5 (2023) [3] | Profils pour des secteurs spécifiques |
| 1-6 | Application de la série 62443 à l'IIoT | Propriétaires d'actifs, prestataires de services | IEC PAS 62443-1-6 (19 décembre 2025) [5] | PAS, retirée automatiquement après quatre ans [5] |
| 2-1 | Exigences relatives au programme de sécurité pour les propriétaires d'actifs IACS | Propriétaires d'actifs | ANSI/ISA-62443-2-1 (2024) [1] ; IEC 62443-2-1 Ed. 2.0 (2024) [3] | Deuxième édition ; la norme centrale pour les propriétaires d'actifs |
| 2-2 | Schéma de protection de la sécurité IACS | Propriétaires d'actifs | ISA-TR62443-2-2 (2025) [1] ; IEC PAS 62443-2-2 (11 mars 2025) [4] | Recommandations pour l'exploitation d'un schéma de protection de la sécurité |
| 2-3 | Gestion des correctifs dans l'environnement IACS | Propriétaires d'actifs, fournisseurs | ISA-TR62443-2-3 (2015) [1] | Rapport technique |
| 2-4 | Exigences relatives au programme de sécurité pour les prestataires de services IACS | Intégrateurs, prestataires de maintenance | ANSI/ISA-62443-2-4 (2018) [1] ; IEC 62443-2-4 Ed. 2.0 (décembre 2023) [3] | Base des contrats d'intégration |
| 3-1 | Technologies de sécurité pour IACS | Tous | ISA-TR99.00.01 (2007) [1] ; IEC TR 62443-3-1 (2009) [3] | Vue d'ensemble des technologies, datée |
| 3-2 | Évaluation des risques de sécurité pour la conception des systèmes | Propriétaires d'actifs, intégrateurs | ANSI/ISA-62443-3-2 (2020) [1] | Deuxième édition en cours [6] |
| 3-3 | Exigences de sécurité système et niveaux de sécurité | Intégrateurs, propriétaires d'actifs | ISA-62443-3-3 (2013) [1] | Deuxième édition en cours [6] |
| 4-1 | Exigences relatives au cycle de vie de développement sécurisé des produits | Fournisseurs de produits | ANSI/ISA-62443-4-1 (2018) [1] | Base de l'ISASecure SDLA [7] |
| 4-2 | Exigences techniques de sécurité pour les composants IACS | Fournisseurs de produits | ANSI/ISA-62443-4-2 (2018) [1] | Deuxième édition en cours [6] ; base de l'ISASecure CSA [7] |
| 6-1 | Méthodologie d'évaluation de la sécurité pour la norme 62443-2-4 | Organismes de certification | IEC TS 62443-6-1 (2024) [3] | Pour l'évaluation des prestataires de services |

Deux remarques pratiques. Premièrement, les dates des parties principales (3-3 de 2013, 4-2 de 2018) ne signifient pas que leur contenu est obsolète ; ce sont toujours les éditions auxquelles la certification et les contrats font référence. Deuxièmement, des révisions sont en cours pour 3-2, 3-3 et 4-2 [6]. Si vous rédigez des contrats fournisseurs à long terme, faites référence à « l'édition en vigueur à la date de commande » ou nommez l'édition et ajoutez une clause de révision.

Une mise en garde concernant les sources secondaires : en 2026, certains sites web ont annoncé une nouvelle « IEC 62443-4-2:2026 » intégrant une détection d'anomalies par IA obligatoire. Nous n'avons trouvé aucune publication de ce type dans le catalogue ISA ni dans la boutique IEC en novembre 2026 [1][4]. Vérifiez chaque affirmation relative à une édition auprès de l'éditeur.

### Les rôles : qui doit faire quoi

La norme 62443 attribue des responsabilités à des rôles, et non à des services. Le guide de démarrage rapide ISAGCA définit ces rôles comme suit [2] :

| Rôle | Définition (ISAGCA) | Entreprise type | Principales parties 62443 |
|---|---|---|---|
| Propriétaire d'actifs | « L'organisation qui est responsable et imputable de l'IACS » | Le fabricant qui exploite l'usine | 2-1, 2-2, 2-3, 3-2 |
| Prestataire de services d'intégration | « L'organisation qui fournit les activités d'intégration d'une solution d'automatisation » | Intégrateur système, constructeur de machines livrant une ligne, ingénierie interne | 2-4, 3-2, 3-3 |
| Prestataire de services de maintenance | Fournit les activités de support d'une solution d'automatisation conformément aux politiques du propriétaire d'actifs | Prestataire de service, service après-vente de l'OEM, maintenance interne | 2-4 |
| Fournisseur de produits | « L'organisation qui fabrique et assure le support d'un produit matériel et/ou logiciel » | Fournisseurs d'automates, d'IHM, de réseaux, de variateurs et de logiciels | 4-1, 4-2 |

Une même entreprise peut tenir plusieurs rôles. Un constructeur de machines est fournisseur de produits pour les logiciels de son armoire de commande et prestataire de services d'intégration lorsqu'il installe la ligne. Un grand industriel disposant de son propre service d'ingénierie des commandes est à la fois propriétaire d'actifs et intégrateur. L'intérêt du modèle de rôles est que le contrat et l'audit peuvent préciser exactement les exigences dont chaque partie est responsable.

### Les deux cycles de vie

La norme 62443 distingue le **cycle de vie du développement produit** du fournisseur du **cycle de vie de la solution d'automatisation** sur site, qui comporte une phase d'intégration et une phase d'exploitation et de maintenance [2]. Un automate PLC sécurisé (4-2) ne fait pas une ligne sécurisée : l'intégrateur doit le configurer correctement (3-3), et le propriétaire de l'actif doit l'exploiter en toute sécurité pendant vingt ans (2-1). La plupart des problèmes en usine surviennent à la troisième étape.

## Exigences fondamentales, niveaux de sécurité et niveaux de maturité

### Les sept exigences fondamentales

Toutes les exigences techniques de 3-3 (système) et de 4-2 (composant) sont regroupées sous sept exigences fondamentales (FR, *foundational requirements*) [2]. Mémorisez-les : elles constituent l'ossature de toute analyse des écarts.

| FR | Nom | Ce qu'elle demande, en langage d'usine | Mesures typiques en usine |
|---|---|---|---|
| FR 1 | Contrôle d'identification et d'authentification (IAC) | Savons-nous qui ou quoi se connecte ? | Comptes nominatifs au lieu de comptes « opérateur » partagés, MFA pour l'accès à distance, certificats d'appareil pour OPC UA |
| FR 2 | Contrôle d'utilisation (UC) | Chacun ne peut-il faire que ce que son rôle exige ? | Droits basés sur les rôles sur les IHM et les outils d'ingénierie, comptes administrateur distincts, audit des modifications de logique |
| FR 3 | Intégrité du système (SI) | Pouvons-nous détecter ou empêcher les modifications non autorisées des logiciels, de la logique et des données ? | Liste blanche d'applications, micrologiciels signés, clé du contrôleur en position RUN, détection des changements de logique |
| FR 4 | Confidentialité des données (DC) | Les informations sensibles sont-elles protégées en utilisation, en transit et au stockage ? | Sessions à distance chiffrées, protection des recettes et des plans, traitement des CUI pour les travaux de défense |
| FR 5 | Flux de données restreints (RDF) | Le trafic est-il limité à ce qui est nécessaire entre zones ? | Segmentation, pare-feu aux conduits, DMZ industrielle, passerelles unidirectionnelles lorsque c'est justifié |
| FR 6 | Réponse rapide aux événements (TRE) | Remarquons-nous les incidents et réagissons-nous à temps ? | Collecte des journaux, surveillance du réseau OT, gestion des alarmes, procédure de réponse aux incidents |
| FR 7 | Disponibilité des ressources (RA) | Les fonctions essentielles continuent-elles de fonctionner sous contrainte ou en cas d'attaque ? | Redondance, sauvegardes, restaurations testées, protection contre les inondations réseau, solution de repli manuelle |

### Niveaux de sécurité (SL 1 à 4)

Un niveau de sécurité décrit la force de l'attaquant qu'une zone ou un composant peut supporter. La norme 62443-3-3 définit quatre niveaux [2] :

| SL | Protection contre | Exemple de menace en usine |
|---|---|---|
| SL 0 | Aucune protection particulière requise | Rarement justifié ; ce n'est pas un objectif de conception |
| SL 1 | Violation fortuite ou occasionnelle | Un technicien branche un ordinateur portable sur le mauvais port de commutateur |
| SL 2 | Violation intentionnelle à l'aide de moyens simples, de ressources limitées, de compétences génériques et de faible motivation | Rançongiciel banal, attaquant opportuniste disposant d'outils standard |
| SL 3 | Violation intentionnelle à l'aide de moyens sophistiqués, de ressources modérées, de compétences spécifiques aux IACS et d'une motivation modérée | Un groupe criminel qui étudie votre système de contrôle avant d'agir |
| SL 4 | Violation intentionnelle à l'aide de moyens sophistiqués, de ressources étendues, de compétences spécifiques aux IACS et d'une motivation élevée | Une équipe bien financée, soutenue par un État, ciblant un procédé précis |

Chaque niveau de sécurité n'est pas un chiffre unique pour l'ensemble de l'usine, mais un vecteur couvrant les sept FR. Une zone peut nécessiter SL 3 pour la FR 3 (intégrité, car une logique manipulée pourrait blesser quelqu'un) mais seulement SL 1 pour la FR 4 (confidentialité, car les données ne sont pas sensibles). Le document de synthèse secondaire précise que les SL s'évaluent par exigence technique, et non comme une note générale attribuée à un produit [3].

Il existe également trois types de niveaux de sécurité [2] :

- **SL-T (cible) :** le niveau souhaité pour une zone ou un conduit, défini par l'évaluation des risques.
- **SL-C (capacité) :** ce qu'un système (3-3) ou un composant (4-2) peut offrir lorsqu'il est correctement intégré et configuré.
- **SL-A (atteint) :** le niveau réel de la solution installée.

L'ensemble du programme peut se résumer en une phrase : choisir des composants dont le SL-C est au moins égal au SL-T, les configurer de manière à ce que le SL-A atteigne le SL-T, et recourir à des mesures compensatoires lorsque ce n'est pas le cas.

**Comment la plupart des fabricants de taille moyenne fixent leurs cibles.** SL 2 est la cible courante pour les zones de production en fabrication discrète, avec SL 3 pour les zones dont la compromission pourrait causer des blessures, des rejets environnementaux importants ou de longues interruptions, comme les systèmes de sécurité et le contrôle des procédés critiques. Il s'agit d'une expérience de praticiens, et non d'une règle de la norme [unverified: statistique non sourcée]. La décision relève de votre évaluation des risques, documentée et approuvée par le propriétaire de l'actif.

### Niveaux de maturité

Les niveaux de sécurité mesurent la solidité technique. Les niveaux de maturité mesurent la qualité avec laquelle les processus sont appliqués. Le modèle de maturité de la norme 62443 est fondé sur CMMI et utilisé dans les parties 2-1, 2-2, 2-4 et 4-1 [2]. L'aperçu secondaire décrit le NM 1 (initial, ad hoc), le NM 2 (géré, documenté et reproductible), le NM 3 (défini, pratiqué dans toute l'organisation et appuyé par des preuves) et le NM 4 (en amélioration, mesuré et amélioré en continu) [3].

Une lecture pratique : un intégrateur dont les processus 2-4 sont au NM 1 réalise un bon travail lorsque le bon ingénieur est sur site, et un travail médiocre sinon. Exigez au moins le NM 2 dans les contrats, ce qui implique des procédures écrites, un personnel formé et des preuves.

### Les principes de conception à la base des exigences

Le guide de démarrage rapide nomme quatre principes de conception qui traversent toute la série : la sécurité dès la conception, la réduction de la surface d'attaque (contrôle d'accès, segmentation, fonctions minimales, moindre privilège), la défense en profondeur et la protection des fonctions essentielles [2]. La défense en profondeur est définie comme « la mise en place de multiples protections de sécurité, notamment en couches, dans le but de retarder ou d'empêcher une attaque » [2]. Aucun pare-feu isolé n'est censé porter toute la charge.

## Zones, conduits et modèle de Purdue

### Définitions

- **Zone :** « un regroupement de biens logiques ou physiques fondé sur le risque ou sur d'autres critères » [2].
- **Conduit :** « un regroupement logique de canaux de communication partageant des exigences de sécurité communes » [2].

Les biens d'une même zone partagent les mêmes exigences de sécurité ; le trafic entre zones ne circule que par des conduits définis, et chaque conduit reçoit ses propres contrôles (règles de pare-feu, restrictions de protocoles, authentification, supervision). Une zone peut être une cellule unique avec un robot et son automate, une ligne de production complète, le système des utilités ou la zone démilitarisée industrielle.

### Comment dessiner les zones

Regroupez les biens selon ces critères, à peu près dans cet ordre :

1. **Fonction et conséquences :** les systèmes de sécurité dans leur propre zone, séparés du contrôle de procédé de base.
2. **Localisation physique ou logique :** ligne, bâtiment, site.
3. **Propriété et cycle de vie :** une ligne clé en main provenant d'un même constructeur de machines forme souvent une zone naturelle.
4. **Capacité technique :** les systèmes anciens qui ne peuvent pas être durcis peuvent nécessiter leur propre petite zone avec des conduits étroitement contrôlés.
5. **Besoins de connectivité :** les systèmes qui doivent communiquer avec l'entreprise ou le cloud se placent près de la frontière, et non au cœur de l'installation.

Évitez deux extrêmes. Une seule zone pour toute l'usine ne vous offre aucun confinement. Une centaine de zones rend les règles ingérables et crée un pare-feu que personne n'ose toucher. Pour une usine de taille moyenne, 8 à 20 zones sont typiques en pratique [fourchette issue de la pratique, non vérifiée].

### Le modèle de Purdue et ses limites

De nombreuses usines décrivent encore leur architecture avec l'architecture de référence d'entreprise de Purdue, que la norme ISA-95 a adoptée comme hiérarchie fonctionnelle. Ses niveaux constituent une carte de départ utile pour les zones :

| Niveau | Contenu | Systèmes types | Zone type |
|---|---|---|---|
| 4-5 | Entreprise : planification et logistique métier, informatique d'entreprise, internet | ERP, messagerie, Microsoft 365, identité d'entreprise | Zone entreprise |
| 3.5 | Zone démilitarisée industrielle (absente du modèle d'origine ; courante en pratique) | Réplica de l'historien, serveur de correctifs, passerelle d'accès distant, transfert de fichiers | IDMZ |
| 3 | Opérations de site : gestion des opérations de fabrication | MES, historien de site, contrôleur de domaine OT, serveur de sauvegarde | Zone opérations de site |
| 2 | Contrôle de supervision de zone | SCADA, IHM, postes d'ingénierie | Zones de ligne ou d'atelier |
| 1 | Contrôle de base | Automates, contrôleurs DCS, contrôleurs de robots, variateurs | Zones de cellule ou de ligne |
| 0 | Procédé physique | Capteurs, actionneurs, moteurs, vannes | Au sein des zones de cellule |
| Sécurité | Systèmes instrumentés de sécurité | Automate de sécurité, gestion de brûleur, sécurité de presse | Zone de sécurité séparée |

Le modèle de Purdue est une carte de départ, et non le modèle de zones lui-même. Ses limites apparaissent à trois endroits :

- **IIoT et cloud.** Les capteurs sans fil qui envoient directement des données vers une plateforme cloud court-circuitent des niveaux. La norme CEI PAS 62443-1-6 (décembre 2025) donne des indications pour appliquer la série aux systèmes IIoT [5] ; le projet de révision 4 de la NIST SP 800-82 ajoute aussi une couverture de l'IIoT avec convergence vers le cloud [10].
- **Lignes à plat.** De nombreuses machines combinent les niveaux 1 et 2 dans une même armoire. Les zones suivent le risque, et non le schéma.
- **Services partagés.** Un Active Directory qui dessert à la fois le bureau et l'atelier relie les niveaux 4 et 3 d'une façon que le schéma ne montre pas. Cartographiez les dépendances réelles, et non les dépendances prévues.

Pour le volet architecture des données (niveaux ISA-95, espace de noms unifié, clusters edge dans la DMZ industrielle), consultez les guides sur [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) et [Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## L'évaluation des risques selon 62443-3-2, étape par étape

62443-3-2 décrit comment passer de « nous avons un système » à « nous connaissons les zones, les conduits et les niveaux de sécurité cibles ». Le guide de démarrage rapide résume le processus en sept exigences de zone et de conduit (ZCR) [2] :

| Étape | ZCR | Activité | Résultat |
|---|---|---|---|
| 1 | ZCR 1 | Identifier le système considéré (SUC) | Périmètre, liste des actifs, points d'entrée |
| 2 | ZCR 2 | Réaliser une évaluation initiale des risques de cybersécurité | Conséquences du pire cas en supposant que le système est compromis |
| 3 | ZCR 3 | Partitionner le SUC en zones et conduits | Schéma des zones et conduits |
| 4 | ZCR 4 | Décider : le risque initial dépasse-t-il le risque tolérable ? | Liste des zones nécessitant une évaluation détaillée |
| 5 | ZCR 5 | Réaliser une évaluation détaillée des risques de cybersécurité | Menaces, vulnérabilités, probabilité, conséquences, SL-T par zone et conduit |
| 6 | ZCR 6 | Documenter les exigences, hypothèses et contraintes de cybersécurité | Spécification des exigences de cybersécurité (CRS) |
| 7 | ZCR 7 | Approbation par le propriétaire de l'actif | CRS signée |

(Le guide de démarrage rapide désigne à un endroit l'étape de documentation « ZCR 4 » ; dans la séquence, c'est la sixième étape.)

### Mise en œuvre concrète

**Étape 1 : Définir le système.** Choisissez un périmètre qu'une seule équipe peut traiter en quelques semaines, par exemple un bâtiment de production ou une ligne et ses systèmes de support. Incluez les chemins d'accès à distance et les connexions cloud ; ils font partie du système même si les serveurs se trouvent ailleurs.

**Étape 2 : Évaluation initiale selon la logique « compromission supposée ».** Pour chaque zone candidate, demandez-vous quel est le pire résultat plausible si un attaquant prend le contrôle complet. Utilisez votre analyse des risques process (PHA) ou HAZOP comme donnée d'entrée : l'équipe sécurité connaît déjà les écarts qui peuvent blesser des personnes. L'évaluation initiale utilise le risque non atténué : aucun crédit n'est accordé aux contrôles de sécurité existants.

**Étape 3 : Zones et conduits.** Dessinez-les selon les critères de la section précédente. Chaque connexion franchissant la frontière d'une zone devient partie d'un conduit.

**Étape 4 : Risque tolérable.** Votre entreprise a besoin d'une matrice des risques indiquant quelles combinaisons de probabilité et de conséquence sont tolérables. De nombreuses usines en disposent déjà pour la sécurité des procédés ou la gestion des risques d'entreprise ; réutilisez-la plutôt que d'en inventer une nouvelle.

**Étape 5 : Évaluation détaillée.** Pour les zones situées au-dessus de la limite de tolérance, listez les scénarios de menace (ATT&CK for ICS aide en ce sens [15]), les contrôles existants et les vulnérabilités, puis estimez la probabilité et les conséquences. Dérivez le SL-T par FR.

**Étape 6 : Spécification des exigences de cybersécurité.** Consignez par zone et par conduit : le SL-T, les mesures requises, les hypothèses (par exemple « l'armoire est verrouillée et le hall est accessible par badge ») et les contraintes (« le fournisseur de l'IHM ne prend pas en charge l'antivirus »). Le CRS est le document que vous remettez à un intégrateur ou à un constructeur de machines.

**Étape 7 : Approbation.** Le directeur d'usine ou le propriétaire d'actif désigné signe le document. Cette étape est essentielle : elle fait du risque résiduel une décision de management et non une préférence d'ingénierie.

### Un système de notation simple

Utilisez l'échelle en vigueur dans la gestion des risques de votre entreprise. Si vous n'en avez pas, le système 5x5 ci-dessous convient pour une première approche.

| Note | Probabilité (avec les contrôles actuels) | Conséquence (pire cas plausible, par zone) |
|---|---|---|
| 1 | Non plausible sur la durée de vie du système | Aucun effet sur la sécurité, moins de 4 heures d'arrêt, moins de 50 000 $ |
| 2 | Plausible mais improbable | Premiers soins, jusqu'à 1 équipe d'arrêt, jusqu'à 250 000 $ |
| 3 | Pourrait survenir dans les 10 ans | Accident avec arrêt de travail, 1 à 3 jours d'arrêt, jusqu'à 1 million $ |
| 4 | Pourrait survenir dans les 3 ans | Blessure grave ou rejet environnemental, 1 à 2 semaines d'arrêt, jusqu'à 5 millions $ |
| 5 | Attendu dans l'année | Décès ou rejet majeur, plus de 2 semaines, plus de 5 millions $ |

Les seuils en dollars et en durée ci-dessus sont donnés à titre indicatif et doivent être fixés par chaque entreprise en fonction de son propre appétit pour le risque.

Risque = probabilité x conséquence. Une correspondance courante : 1 à 6 tolérable, 8 à 12 nécessite des mesures et une approbation, 15 à 25 non tolérable. Pour le SL-T, une heuristique pratique consiste à attribuer SL-T 3 pour FR 1 à FR 3 et FR 7 aux zones dont la conséquence la plus grave est notée 4 ou 5 ; SL-T 2 aux zones dont la conséquence est 2 ou 3 ; SL-T 1 pour une conséquence de 1. Cette heuristique est notre simplification pour une première passe ; la norme exige une justification documentée, et non une formule.

## Exemple détaillé : zones et conduits pour une usine de taille moyenne

Les définitions abstraites ne suffisent pas. Cette section applique la norme 62443-3-2 à une usine fictive mais typique. Tous les noms et chiffres sont donnés à titre illustratif.

### L'usine

« Midwest Components » fabrique des carters et des ensembles métalliques pour les équipements agricoles et de construction. Un seul site, 420 employés, trois équipes, chiffre d'affaires annuel d'environ 150 millions de dollars. Production :

- **Atelier de presses :** quatre presses servo-commandées avec automatisme de transfert ; une ligne de presse dispose d'un automate de sécurité avec rideaux lumineux et d'une commande bimanuelle.
- **Zone de cellules de soudage :** douze cellules de soudage robotisées provenant de deux constructeurs de machines, chacune dotée de son propre automate, de sa propre armoire robot et de son propre IHM.
- **Atelier de peinture :** ligne de peinture poudre avec four de polymérisation (brûleur au gaz naturel avec système de gestion de brûleur), piloté par un petit DCS.
- **Assemblage :** deux lignes d'assemblage manuel équipées de visseuses à couple contrôlé, d'imprimantes d'étiquettes et d'un automate de ligne pour le convoyeur.
- **Utilités :** air comprimé, eau de refroidissement, CVC et comptage d'énergie sur un système SCADA.
- **Systèmes du site :** MES avec un serveur et 40 postes clients, un historien, un laboratoire qualité avec une machine à mesurer tridimensionnelle (MMT), un Active Directory OT, un serveur de sauvegarde.
- **Entreprise :** ERP hébergé par l'informatique du groupe, Microsoft 365, identité d'entreprise.
- **Accès à distance :** les deux constructeurs de machines de soudage et le fabricant de presses utilisent actuellement chacun leur propre boîtier d'accès distant avec modem cellulaire. L'intégrateur de la ligne de peinture se connecte via un VPN fournisseur.
- **Cloud :** un service de suivi de la consommation énergétique reçoit les données de comptage par internet depuis une passerelle du réseau des utilités.

### Étapes 1 et 2 : évaluation initiale

L'équipe (responsable ingénierie de l'usine, responsable automatismes, responsable sécurité informatique, responsable HSE et superviseur maintenance) parcourt chaque zone en se posant la question : « quel est le pire résultat plausible si un attaquant contrôle ce système ? »

| Zone | Pire résultat plausible (hypothèse de compromission) | Note de conséquence |
|---|---|---|
| Automate de sécurité de la ligne de presse | Fonction de sécurité désactivée en fonctionnement, risque de blessure grave | 5 |
| Commande des presses | Matrices et presses endommagées, plusieurs semaines d'arrêt | 4 |
| Gestion de brûleur du four de peinture | Conditions de combustion dangereuses, risque d'incendie ou d'explosion | 5 |
| DCS de peinture | Lots perdus, plusieurs jours d'arrêt | 3 |
| Cellules de soudage | Gabarits endommagés, défauts qualité, 1 à 3 jours par cellule | 3 |
| Lignes d'assemblage | Mauvais couple ou mauvaises étiquettes, défaut qualité livré aux clients | 3 |
| SCADA des utilités | Perte d'air comprimé et de refroidissement, arrêt de toute l'usine | 4 |
| MES et historien | L'usine peut fonctionner en mode manuel dégradé pendant quelques jours | 3 |
| Laboratoire qualité | Données de mesure erronées, défaut qualité | 2 |
| IT d'entreprise | Perturbation de l'activité ; l'usine s'arrête si les données de commandes et d'expédition sont indisponibles | 4 |

### Étape 3 : le modèle de zones

| Zone | Contenu | SL-T (FR 1-3, FR 5-7 / FR 4) | Justification |
|---|---|---|---|
| Z0 Entreprise | IT d'entreprise, ERP, Microsoft 365 | Géré par l'IT d'entreprise selon le CSF 2.0 | Hors de l'IACS, mais principale source de menaces |
| Z1 DMZ industrielle | Réplique de l'historien, serveur de mises à jour des correctifs et de l'antivirus, passerelle d'accès distant, serveur de transfert de fichiers, serveurs de rebond | SL 3 / SL 2 | Seule zone en contact direct avec Z0 et avec les fournisseurs externes |
| Z2 Opérations du site | Serveur MES, historien du site, Active Directory OT, serveur de sauvegarde, gestion des capteurs de supervision OT | SL 2 / SL 2 | Conséquence 3, mais services centraux pour toutes les lignes |
| Z3 Commande des presses | Automates des presses, automatisation des transferts, IHM, poste d'ingénierie des presses | SL 2, SL 3 pour FR 3 / SL 1 | Conséquence 4 : l'intégrité de la logique est essentielle |
| Z4 Sécurité des presses | Automate de sécurité, rideaux lumineux, commandes bimanuelles | SL 3 / SL 1 | Conséquence 5 ; zone distincte avec un minimum de conduits |
| Z5 Cellules de soudage (constructeur de machines A) | Six cellules | SL 2 / SL 1 | Conséquence 3, clés en main auprès d'un seul fournisseur |
| Z6 Cellules de soudage (constructeur de machines B) | Six cellules | SL 2 / SL 1 | Identique, avec un autre fournisseur et un autre chemin d'accès distant |
| Z7 DCS de peinture | Contrôleurs DCS, postes opérateurs | SL 2 / SL 1 | Conséquence 3 |
| Z8 Gestion de brûleurs | Système de gestion des brûleurs du four de polymérisation | SL 3 / SL 1 | Conséquence 5 ; zone de sécurité distincte |
| Z9 Assemblage | Automates de ligne, contrôleurs de couple, imprimantes d'étiquettes, IHM | SL 2 / SL 1 | Conséquence 3 |
| Z10 Utilités | SCADA, compresseurs, groupes froid, commandes CVC, compteurs | SL 2, SL 3 pour FR 7 / SL 1 | Conséquence 4 : la disponibilité est essentielle |
| Z11 Laboratoire qualité | MMT, PC de laboratoire | SL 2 / SL 2 | Données de mesure et plans clients |
| Z12 Passerelle énergie IIoT | Passerelle de compteurs avec connexion cloud | SL 2 / SL 1 | Accès direct à Internet, isolée du contrôle de Z10 |

Douze zones à l'intérieur de l'usine, plus l'entreprise. Notez ce qu'il advient des boîtiers d'accès distant cellulaires : ils disparaissent. Tous les accès des fournisseurs passent désormais par la passerelle d'accès distant de Z1.

### Les conduits

| Conduit | Entre | Trafic autorisé | Contrôles |
|---|---|---|---|
| C1 | Z0 Entreprise <-> Z1 DMZ | Interface de commandes ERP vers MES via le courtier de la DMZ ; accès des utilisateurs à la réplique de l'historien (lecture seule) ; téléchargements de mises à jour | Paire de pare-feux (côté entreprise et côté usine), aucun trafic direct de Z0 vers Z2 ou en dessous, journalisation |
| C2 | Z1 DMZ <-> Z2 Opérations du site | Réplication de l'historien (Z2 vers Z1), interface MES, distribution des correctifs, sessions des serveurs de rebond | Pare-feu avec règles d'autorisation explicites, MFA pour les serveurs de rebond, enregistrement des sessions |
| C3 | Fournisseurs externes <-> Z1 DMZ | Sessions d'accès distant | Passerelle d'accès distant avec comptes personnels, MFA, approbation par session, durées limitées, enregistrement |
| C4 | Z2 <-> Z3, Z5, Z6, Z7, Z9, Z10, Z11 | MES vers automates et IHM de ligne (protocoles industriels définis), collecte des données de l'historien, sauvegardes, accès d'ingénierie depuis le serveur de rebond | Pare-feu interne ou ACL par zone ; seuls les protocoles et hôtes nommés |
| C5 | Z3 Commande des presses <-> Z4 Sécurité des presses | Signaux d'état uniquement | Réseau de sécurité câblé ou dédié ; aucune connexion routable vers Z2 |
| C6 | Z7 DCS de peinture <-> Z8 Gestion de brûleurs | Signaux d'état et d'autorisation | E/S câblées ; aucun accès d'ingénierie sauf sur place avec MOC |
| C7 | Passerelle IIoT Z12 <-> Internet (service cloud) | Télémétrie chiffrée sortante uniquement | Passerelle dans son propre VLAN, sortante uniquement, aucune connexion entrante |
| C8 | Z10 Utilités -> Z12 | Valeurs des compteurs | Flux de données à sens unique (diode de données ou règle de pare-feu unidirectionnelle), aucun chemin de Z12 vers Z10. Vérifiez d'abord que le protocole des compteurs fonctionne en sens unique ; les protocoles requête-réponse nécessitent une passerelle qui interroge du côté de Z10 |

### Étapes 4 à 7 : des écarts à une spécification des exigences

L'évaluation détaillée de la zone Z4 Sécurité des presses montre : risque initial 5 (conséquence) x 3 (probabilité : l'automate de sécurité est accessible depuis le réseau des IHM des presses et depuis un modem cellulaire du constructeur de machines) = 15, non tolérable. Avec les mesures prévues (zone distincte, aucun conduit routable, modem cellulaire supprimé, commutateur à clé protégé en mode RUN, somme de contrôle de la logique vérifiée chaque semaine), l'équipe estime la probabilité à 1 et le risque résiduel à 5, tolérable. Le propriétaire de l'actif valide.

Pour Z5 et Z6, l'écart concerne principalement FR 1 et FR 2 : des comptes partagés sur les douze IHM et sur les pendants d'apprentissage des robots. Le CRS de l'achat de la cellule suivante exige des comptes nominatifs et une IHM certifiée SL-C 2 ; pour les cellules existantes, la mesure compensatoire consiste en un jump host avec des comptes personnels placé devant elles, et une interdiction des connexions directes par ordinateur portable.

### À quoi ressemble le résultat après un an

| Indicateur | Avant | Après 12 mois |
|---|---|---|
| Chemins d'accès distants non contrôlés | 4 (3 boîtiers cellulaires, 1 VPN fournisseur) | 0 ; une passerelle unique avec MFA et enregistrement |
| Zones | 1 réseau d'usine à plat, VLAN bureautique routé vers celui-ci | 12 zones d'usine plus entreprise, IDMZ entre les deux |
| Actifs avec propriétaire et version de firmware connus | Inconnus | 96 % des 640 actifs connectés au réseau inventoriés |
| Contrôleurs avec sauvegarde hors ligne de la logique actuelle | Environ la moitié (estimation) | 100 % des 58 automates et contrôleurs, restauration testée sur 6 |
| Playbook de gestion d'incident | Aucun | Rédigé, testé lors d'un exercice sur table avec la production |

Ces chiffres sont illustratifs. L'important est la forme du résultat : moins de chemins, des actifs connus, une logique récupérable.

## Inventaire des actifs OT

On ne peut pas protéger ce que l'on ne connaît pas. L'inventaire des actifs est l'étape zéro de 62443-3-2 (identifier le système considéré) et de tous les profils NIST. Le projet de NIST SP 800-82 Rev. 4 développe ses recommandations sur la gestion des actifs [10].

### Ce qu'il faut consigner

Un inventaire utile va au-delà d'une liste d'adresses IP. Le tableau est un modèle ; commencez par les champs en gras et ajoutez les autres au fil du temps.

| Champ | Exemple | Pourquoi c'est important |
|---|---|---|
| **Identifiant et nom de l'actif** | PR3-PLC01 | Référence unique dans les tickets et les plans |
| **Type** | Automate, IHM, contrôleur de robot, commutateur, serveur, poste de travail | Détermine les contrôles applicables |
| **Fabricant, modèle** | (fournisseur), (modèle) | Comparaison avec les avis de sécurité des fournisseurs |
| **Version du firmware / du logiciel** | v32.011 | Décisions sur les vulnérabilités et les correctifs |
| **Zone** | Z3 Commande de presse | Relie l'actif au modèle de zones |
| **Emplacement** | Ligne de presse 3, armoire +A1 | Accès physique et maintenance |
| **Propriétaire** | Ingénierie de commande, presse | Qui décide des modifications |
| **Criticité** | Score de conséquence 4 | Priorisation |
| Adresses réseau et protocoles | 10.30.3.11, EtherNet/IP | Règles de pare-feu, bases de référence de supervision |
| Partenaires de communication | IHM PR3-HMI01, serveur MES | Définition des conduits |
| Accès distant | Via le jump host uniquement | Exposition |
| État de la sauvegarde | Logique sauvegardée le 2026-11-05, restauration testée 2026-06 | Préparation à la reprise |
| Statut de support du fournisseur | Supporté jusqu'à (date) ou fin de vie | Planification du cycle de vie |
| Comptes | Comptes nominatifs oui/non ; mot de passe par défaut modifié oui/non | Écarts FR 1 et FR 2 |
| Vulnérabilités connues | Référence de l'avis, décision | Correctifs et mesures compensatoires |
| Pièces de rechange et remplacement | Pièce de rechange en stock oui/non | Délai de reprise |

### Comment le construire sans rien casser

1. **Partir de l'existant.** Les plans électriques, les fichiers de projet des automates, les configurations des commutateurs réseau, les enregistrements de la GMAO (CMMS), les bons de commande et la documentation des constructeurs de machines contiennent déjà l'essentiel des données.
2. **Découverte passive du réseau.** Les outils commerciaux de supervision OT écoutent une copie du trafic réseau (via un port SPAN ou un TAP réseau) et identifient les équipements, les versions de firmware et les schémas de communication sans envoyer de paquets aux contrôleurs.
3. **Outils fournisseurs et requêtes contrôlées.** Les logiciels d'ingénierie peuvent lire les informations des équipements depuis les contrôleurs de manière sûre. Les requêtes actives sont acceptables lorsque le fournisseur les prend en charge et que la production accepte une fenêtre horaire.
4. **Faire le tour de l'atelier.** Chaque inventaire révèle des équipements absents de tous les plans : un routeur cellulaire oublié, un ordinateur portable dans une armoire, un point d'accès sans fil installé par un sous-traitant.
5. **Le maintenir à jour.** Lier les mises à jour à la gestion des modifications : aucun nouvel équipement n'est mis en service sans entrée dans l'inventaire. Réconcilier chaque mois avec ce que voit la supervision.

### Une remarque sur les outils

Les plateformes spécialisées de sécurité OT automatisent la découverte passive et la correspondance avec les vulnérabilités. Microsoft a annoncé qu'il retirera le composant de sécurité OT de Defender for IoT en octobre 2029 et oriente les clients vers des solutions de partenaires [31] ; le [guide Azure pour l'industrie manufacturière](https://www.m365.fm/en/learn/manufacturing-it-azure/) couvre cette transition. Quel que soit l'outil retenu, l'inventaire appartient au propriétaire de l'actif et doit pouvoir être exporté ; ne l'enfermez pas dans la console d'un seul fournisseur.

## Segmentation réseau et zone démilitarisée industrielle

La segmentation met en œuvre la FR 5 (flux de données restreints). C'est la mesure unique qui aurait limité la propagation dans la plupart des cas de la section 3, et c'est là que la plupart des usines constatent le plus grand écart.

### Architecture cible

- **Frontière à deux couches entre entreprise et usine.** Une zone démilitarisée industrielle (IDMZ) entre l'entreprise et les opérations du site, avec des pare-feux de part et d'autre. Aucun trafic ne passe directement de l'entreprise vers l'usine ; chaque échange se termine dans l'IDMZ (courtier de données, réplica de l'historien, transfert de fichiers, hôte de rebond, serveur de correctifs).
- **Segmentation interne par zone.** À l'intérieur de l'usine, chaque zone est placée dans son propre VLAN ou réseau physique, avec un pare-feu ou des listes de contrôle d'accès au niveau du conduit.
- **Systèmes de sécurité séparés.** Les zones de sécurité n'ont aucune connexion routable vers le reste, ou seulement via un conduit strictement restreint approuvé par la sécurité des procédés.
- **Pas d'ordinateurs à double connexion.** Un PC équipé d'une carte réseau dans le bureau et d'une autre dans l'usine contourne tous les pare-feux.
- **Internet uniquement par des chemins définis.** Les connexions cloud sortent par l'IDMZ ou depuis une zone IIoT dédiée, en sortie uniquement.

### Un projet de segmentation en sept étapes

1. **Cartographier d'abord le trafic réel.** Exécuter une surveillance passive pendant deux à quatre semaines pour voir qui communique avec qui. Les usines sont toujours surprises.
2. **Dessiner le modèle de zones cible** (section 9) et le faire valider par la production.
3. **Construire l'IDMZ** et y déplacer les services traversant la frontière : réplica de l'historien, passerelle d'accès distant, serveur de correctifs, transfert de fichiers.
4. **Configurer d'abord les pare-feux en mode « autoriser et journaliser ».** Installer les pare-feux aux conduits avec des règles qui permettent le trafic actuel et enregistrent tout.
5. **Resserrer les règles par étapes.** Remplacer les règles générales par des règles précises (source, destination, protocole, port), une zone à la fois, pendant des fenêtres planifiées avec des ingénieurs de contrôle sur site.
6. **Passer au « refus par défaut »** une fois que les journaux ne montrent que le trafic attendu.
7. **Placer les règles sous gestion des modifications.** Chaque nouvelle règle nécessite un demandeur, une justification métier, une date d'expiration et une approbation.

### Modèle de règle de pare-feu

| Champ | Exemple |
|---|---|
| ID de règle | C4-017 |
| Conduit | C4 (Z2 Opérations du site -> Z3 Commande de presse) |
| Source | Serveur MES 10.20.1.15 |
| Destination | PR3-PLC01 10.30.3.11 |
| Protocole / port | EtherNet/IP, TCP 44818 |
| Direction | Z2 -> Z3 uniquement |
| Justification métier | Le MES lit les compteurs de pièces et écrit les numéros d'ordre |
| Demandé par / approuvé par | Administrateur MES / responsable contrôle, presse |
| Valide jusqu'au | Date de revue 2027-11 |
| Journalisation | Oui |

### Connexions sans fil et cellulaires

Le Wi-Fi pour les scanners portables, les capteurs sans fil et les modems cellulaires installés dans les armoires machines créent des chemins qui n'apparaissent pas sur le plan du réseau filaire. Traitez chaque réseau sans fil comme sa propre zone ou comme une partie d'un conduit : SSID distincts pour les appareils de l'usine et les invités, authentification par certificat pour les appareils de l'usine, aucun pontage entre réseaux sans fil et réseaux de contrôle, et une étude radio régulière pour détecter les points d'accès et modems non autorisés. Les capteurs IIoT sans fil qui envoient leurs données directement à un service cloud relèvent d'une zone IIoT telle que la Z12 de l'exemple détaillé.

### Problèmes courants de segmentation

- **Ordinateurs portables d'ingénierie** transportés entre les zones et le bureau. Solution : postes d'ingénierie fixes par zone ou hôte de rebond, et ordinateurs portables qui ne quittent jamais le réseau de l'usine.
- **Réseaux de machines plats** livrés par les constructeurs, où l'IHM, l'automate et un routeur d'accès distant se trouvent sur le même commutateur non géré. Solution : traiter la machine comme une seule zone et contrôler le conduit à sa périphérie.
- **Active Directory partagé.** Un domaine d'entreprise étendu à l'usine donne aussi à un attaquant qui contrôle le domaine le contrôle de l'usine. Solution : un domaine OT distinct ou des comptes locaux avec un modèle de confiance défini.
- **Protocoles à forte diffusion** qui se routent mal. Solution : planifier les frontières de VLAN avec le fournisseur des systèmes de contrôle ; certains protocoles exigent des voisins de couche 2.

## Accès distant sécurisé pour les fournisseurs et les ingénieurs

Dans de nombreuses usines, l'accès distant constitue le chemin non maîtrisé le plus important : les constructeurs de machines en ont besoin pour l'assistance, et la production veut une aide rapide lorsqu'une machine s'arrête. L'interdire fonctionne rarement ; la réponse pratique consiste en un chemin unique et maîtrisé, plus simple à utiliser que les contournements.

En septembre 2026, la CISA et le FBI ont publié une fiche d'information à l'intention des exploitants d'infrastructures critiques travaillant avec des intégrateurs tiers de systèmes ICS. Elle cite une analyse du FBI portant sur une intrusion survenue en 2025 chez une entreprise américaine d'automatisation, et recommande de limiter les accès des intégrateurs au minimum nécessaire, d'inscrire des exigences de cybersécurité (notamment en matière d'accès distant et de gestion des correctifs) dans les contrats, de réduire l'exposition à Internet des équipements, et de surveiller et journaliser les accès distants, en privilégiant l'accès à la demande lorsque c'est possible [14].

### Exigences pour l'accès distant (modèle)

| Exigence | Détail | 62443 FR |
|---|---|---|
| Un seul chemin | Toutes les sessions distantes passent par une passerelle dans l'IDMZ ; pas de modems cellulaires, pas de VPN fournisseurs aboutissant dans les zones de production | FR 5 |
| Comptes personnels | Un compte par personne, pas de comptes fournisseur partagés | FR 1 |
| Authentification multifactorielle | Pour chaque session distante | FR 1 |
| Approbation par session | Le contact de l'usine approuve chaque session ; l'accès est désactivé par défaut | FR 2 |
| Moindre privilège | Accès uniquement aux équipements que le fournisseur prend en charge, pendant la durée nécessaire | FR 2 |
| Enregistrement et journalisation des sessions | Sessions enregistrées et conservées pendant une durée définie | FR 6 |
| Supervision des modifications | Modifications de logique uniquement en présence d'un ingénieur de l'usine et sur ordre de travail | FR 3 |
| Transfert de fichiers | Fichiers uniquement via une zone de transfert analysée | FR 3 |
| Contrat | Règles d'accès distant, obligations de notification et responsabilités dans le contrat de service | 2-4 |

### Conseils pratiques

- **Rendre le chemin sécurisé plus simple que le chemin non sécurisé.** Si l'approbation prend deux heures la nuit, quelqu'un branchera un routeur cellulaire. Définissez un approbateur d'astreinte par équipe.
- **Supprimer les boîtiers superflus.** Recensez chaque équipement d'accès distant dans l'inventaire et supprimez ou désactivez ceux qui ne passent pas par la passerelle. De nombreux constructeurs de machines livrent des lignes avec leur propre routeur ; intégrez cette exigence dans le cahier des charges d'achat (section 17).
- **Revoir les comptes chaque trimestre.** Supprimez les comptes des personnels de fournisseurs ayant quitté leur poste.

## Gestion des correctifs et des vulnérabilités dans l'OT

Dans l'informatique de bureau, la règle est « corriger vite ». Dans l'OT, la règle est « décider délibérément ». Un correctif peut exiger une approbation du fournisseur, un redémarrage de contrôleur, une revalidation dans les industries réglementées, ou un test complet de la ligne. Dans les usines soumises à la FDA (pharmacie, dispositifs médicaux, agroalimentaire) et sous les exigences des clients automobiles ou aéronautiques, une modification d'un système validé déclenche généralement votre procédure de gestion des changements et de validation ; prévoyez le temps de revue de l'équipe qualité dans la fenêtre de correctif. La norme ISA-TR62443-2-3 couvre la gestion des correctifs dans l'environnement IACS [1].

### Sources d'information sur les vulnérabilités

- Avis de sécurité des fournisseurs et portails de sécurité produits de vos fournisseurs d'automates programmables (PLC), d'IHM, de variateurs et de logiciels.
- Les avis ICS de la CISA, qui publient les vulnérabilités des produits industriels, souvent coordonnées avec les fournisseurs [unverified as to current volume; check the CISA advisories page]. Le volume actuel n'est pas vérifié ; consultez la page des avis CISA.
- Votre outil de supervision OT, qui compare les versions de firmware de l'inventaire aux avis publiés.

### Tableau de décision pour chaque avis

| Question | Si oui | Si non |
|---|---|---|
| Le produit concerné figure-t-il dans notre inventaire ? | Continuer | Clore, documenter |
| La fonction vulnérable est-elle utilisée ou accessible dans notre configuration ? | Continuer | Documenter la raison ; revérifier à la prochaine modification |
| Est-elle connue comme exploitée ou un exploit public est-il disponible ? | Priorité élevée | Priorité selon le score de conséquence |
| L'équipement est-il accessible depuis une zone de moindre confiance ou à distance ? | Priorité élevée | Priorité moyenne |
| Le fournisseur approuve-t-il le correctif pour notre version ? | Planifier le correctif dans la prochaine fenêtre | Appliquer des mesures compensatoires |
| Le correctif peut-il être appliqué sans arrêt ? | Programmer dans la maintenance normale | Programmer dans un arrêt planifié |

### Mesures compensatoires lorsque vous ne pouvez pas corriger

Lorsque le correctif n'est pas disponible, pas approuvé, ou impossible avant le prochain arrêt :

- Restreindre le conduit : n'autoriser que les hôtes et protocoles nécessaires à l'équipement.
- Désactiver les services et ports inutilisés.
- Placer le commutateur à clé du contrôleur en position RUN pour bloquer les modifications de programme à distance, lorsque le contrôleur le permet.
- Renforcer la supervision de l'équipement (alertes sur les nouvelles connexions ou les téléchargements de programme).
- Documenter le risque résiduel et obtenir l'approbation du responsable de l'équipement.

### Exemple de décision

Un avis décrit une vulnérabilité de déni de service exploitable à distance dans le serveur web du modèle d'automate utilisé pour le contrôle de la presse Z3. L'inventaire montre quatre automates concernés. Le serveur web est activé mais non utilisé. Le correctif du firmware est disponible mais nécessite un redémarrage du contrôleur, et le fournisseur recommande un test fonctionnel. Décision : désactiver le serveur web sur les quatre automates pendant la prochaine fenêtre de week-end (30 minutes par presse), bloquer HTTP et HTTPS vers les automates dans le conduit C4, et installer le firmware lors de l'arrêt planifié dans huit semaines. Le risque intermédiaire est documenté et approuvé par le responsable ingénierie de l'usine.

### Systèmes anciens et en fin de vie

Chaque usine compte des systèmes qui ne recevront plus jamais de correctif : des IHM sous des versions de Windows non supportées, des contrôleurs dont le fournisseur a arrêté la fabrication. Traitez-les comme un problème de cycle de vie doté d'un budget, et non comme une exception de sécurité à renouveler indéfiniment. Le champ d'inventaire « statut de support fournisseur » alimente un plan de remplacement aligné sur les rénovations de lignes et la planification des investissements.

## Comptes, durcissement et supports amovibles

Les FR 1 à FR 3 sont là où les sites industriels présentent les lacunes les plus visibles et où les corrections sont les moins coûteuses.

### Comptes et identités

- **Supprimer les connexions partagées lorsque le système le permet.** Les comptes « Operator », « maint » et « admin » partagés par tout un poste rendent chaque modification intraçable. De nombreux IHM et systèmes SCADA actuels prennent en charge des comptes nominatifs ou une connexion par badge ; les plus anciens peuvent ne pas le permettre.
- **Séparer les comptes d'administration.** Les ingénieurs utilisent un compte standard pour la messagerie et un compte distinct pour l'administration OT, jamais le même.
- **Modifier les mots de passe par défaut** sur tous les équipements qui en possèdent : commutateurs, routeurs, IHM, contrôleurs de robots, caméras. En faire un point de la liste de contrôle de mise en service.
- **Utiliser l'authentification multifacteur (MFA) lorsqu'une personne se connecte à distance ou à l'IDMZ.** Sur l'atelier, la MFA sur un IHM est souvent difficile à mettre en œuvre ; compenser par un contrôle d'accès physique et des verrouillages d'écran courts lorsque le processus le permet.
- **Protéger le service d'assistance informatique.** Le cas Clorox montre qu'un appel d'ingénierie sociale auprès d'un service d'assistance informatique peut conduire à un accès privilégié [20]. Exiger une vérification d'identité pour les réinitialisations de mot de passe et de MFA, avec des contrôles plus stricts pour les comptes privilégiés.

### Durcissement des systèmes OT sous Windows

Les IHM, serveurs SCADA, historiens et postes d'ingénierie sont majoritairement des ordinateurs Windows. Leur durcissement suit les recommandations des fournisseurs :

1. Supprimer les logiciels et services dont le système n'a pas besoin (fonction minimale).
2. Utiliser la liste blanche d'applications à la place de l'antivirus, ou en complément, lorsque le fournisseur le prend en charge.
3. Désactiver ou restreindre les ports USB.
4. Restreindre les droits d'administrateur local.
5. Conserver une image de référence saine et les supports d'installation pour une reconstruction rapide.

### Contrôleurs

- Maintenir le commutateur à clé ou la protection logicielle en position RUN lorsque le contrôleur le propose, et journaliser chaque passage en mode PROGRAM.
- Conserver la logique actuelle hors ligne et comparer régulièrement les sommes de contrôle ou les versions de projet afin de détecter les modifications non autorisées (FR 3).
- Désactiver les services inutilisés (serveurs web, FTP, accès en écriture SNMP).

### Supports amovibles

Les clés USB et les ordinateurs portables introduisent des logiciels malveillants à travers chaque frontière réseau. Un jeu de règles simple :

| Règle | Mise en œuvre |
|---|---|
| Aucun support personnel | Politique écrite, formation, signalisation aux postes |
| Analyse avant utilisation | Une borne d'analyse à l'entrée du site ou dans l'IDMZ |
| Supports de l'entreprise uniquement | Clés USB chiffrées et inventoriées pour l'ingénierie |
| Privilégier le chemin réseau | Transfert de fichiers via le serveur de l'IDMZ plutôt que par USB |
| Application technique | Ports USB désactivés ou restreints par stratégie sur les IHM et serveurs |

## Surveillance et détection

FR 6 (réaction en temps utile aux événements) exige que vous remarquiez les incidents. Dans l'OT, la détection repose sur deux sources : les journaux et le trafic réseau.

### Ce qu'il faut journaliser

| Source | Événements | Utilisation |
|---|---|---|
| Pare-feu aux conduits | Connexions autorisées et refusées | Trafic inattendu entre zones |
| Passerelle d'accès distant | Connexions, approbations, enregistrements de session | Examen de l'activité des prestataires |
| Active Directory OT et serveurs de rebond | Connexions, changements de privilèges, nouveaux comptes | Utilisation abusive de comptes |
| Postes d'ingénierie | Lancements de logiciels, téléchargements de projets | Modifications non autorisées de la logique |
| Automates (lorsque pris en charge) | Changements de mode, téléchargements de programmes, mises à jour du firmware | Intégrité |
| Système de sauvegarde | Réussite et échec des tâches | Préparation à la restauration |

### Surveillance passive du réseau OT

Les outils spécialisés de surveillance OT décodent les protocoles industriels et apprennent le schéma de communication normal d'un site. Ils déclenchent ensuite des alertes en cas d'écart : un nouvel appareil, une nouvelle connexion entre zones, un téléchargement de programme en dehors d'une fenêtre de maintenance, ou une commande envoyée depuis un poste inhabituel. Comme ils se contentent d'écouter le trafic copié, ils n'affectent pas le procédé. Le projet de NIST SP 800-82 Rev. 4 développe ses recommandations sur la surveillance et la détection réseau [10].

### Qui surveille les alertes

Une alerte que personne ne lit représente un coût sans bénéfice. Options pour un site de taille moyenne :

- **Centre opérationnel de sécurité (SOC) de l'entreprise** disposant d'un playbook OT et d'un ingénieur contrôle-commande désigné, joignable en astreinte sur le site.
- **Service de détection managé** confié à un prestataire ayant une expérience OT.
- **Examen au niveau du site** d'un petit nombre d'alertes à forte valeur (nouvel appareil, téléchargement de programme, session distante hors approbation), le reste étant transmis au SOC.

Quel que soit le choix, définissez qui peut prendre quelle action. Un analyste du SOC ne doit jamais pouvoir arrêter une ligne de sa propre initiative ; le playbook précise qui décide.

## Sauvegarde, reprise et réponse aux incidents OT

FR 7 (disponibilité des ressources) ainsi que les fonctions « Respond » et « Recover » du CSF 2.0 se rejoignent ici [11]. L'affaire Norsk Hydro en est l'exemple classique : l'entreprise a maintenu en fonctionnement de larges parties de sa production avec des procédures manuelles, et a estimé plus tard son coût total à environ 800 millions de couronnes norvégiennes [17].

### Ce qu'il faut sauvegarder

| Élément | Fréquence | Stockage | Test de restauration |
|---|---|---|---|
| Programmes des automates, des automates de sécurité et des robots | Après chaque modification et mensuellement | Copie hors ligne et hors site | Annuel par automate critique, sur une pièce de rechange ou un simulateur |
| Projets IHM et SCADA | Après chaque modification | Hors ligne et hors site | Annuel |
| Images serveurs (MES, historien, SCADA, contrôleur de domaine OT) | Complète hebdomadaire, incrémentale quotidienne | Copie immuable ou hors ligne | Deux fois par an, reconstruction complète d'un serveur |
| Configurations des équipements réseau | Après chaque modification | Hors ligne | Annuel |
| Firmware et supports d'installation | Lors des mises à jour | Bibliothèque hors ligne | Vérification de l'intégralité annuelle |
| Documentation (plans, modèle de zones, inventaire, export du coffre-fort de mots de passe) | Mensuel | Hors ligne, copie papier des éléments essentiels | Vérification lors d'un exercice sur table |

### Le playbook de réponse aux incidents OT

Un playbook OT diffère d'un playbook IT par la question de savoir qui décide et par ce qui passe en premier.

| Phase | Contenu spécifique à l'OT |
|---|---|
| Préparation | Liste de contacts incluant les constructeurs de machines et les fournisseurs de contrôle-commande ; droits de décision ; ordinateur portable d'ingénierie de secours avec images saines ; procédures d'exploitation manuelles par zone |
| Détection et analyse | Appel conjoint de la sécurité IT, du responsable contrôle-commande et du responsable de production dans un délai défini ; première question : la sécurité est-elle affectée ? |
| Confinement | Options convenues à l'avance : déconnecter l'entreprise de l'IDMZ, déconnecter l'IDMZ du site, isoler une zone donnée. Qui peut débrancher quoi, et au prix de quel risque pour la production |
| État sûr | La sécurité des procédés décide de poursuivre, de passer en mode manuel ou d'arrêter en toute sécurité ; les systèmes de sécurité ne sont jamais désactivés pour « aider » la reprise |
| Éradication et reprise | Reconstruction à partir d'images connues comme saines ; vérification de la logique des automates par rapport aux sauvegardes hors ligne avant redémarrage ; redémarrage progressif zone par zone |
| Notification | Juridique et communication : évaluation de l'importance significative selon la SEC pour les sociétés cotées, notifications aux clients, à l'assureur et aux autorités de police, déclarations NIS2 ou CRA pour les obligations européennes (section 19) |
| Retour d'expérience | Cause racine, modèle de zones et playbook mis à jour |

### Mettre en pratique

Organisez au moins une fois par an un exercice sur table avec la production, la maintenance, l'IT, l'EHS, la communication et la direction. Un premier scénario utile : « Un ransomware a chiffré le MES et l'ERP. Les lignes tournent encore. Continuons-nous à produire, et comment suivre ce que nous fabriquons et expédions ? » La réponse révèle si des procédures de repli manuelles existent.

Les CISA CPG insistent sur la gouvernance et sur des pratiques fondamentales mesurables, notamment la planification de la réponse aux incidents ; la CPG 2.0, publiée en décembre 2025, a ajouté une composante de gouvernance [13].

## Exigences fournisseurs et achats

La plus grande part du niveau de sécurité d'un site s'achète plutôt qu'elle ne se construit. Chaque nouvelle machine, chaque nouvelle ligne et chaque nouveau système de commande est une occasion de le relever. La norme 62443 fournit le vocabulaire nécessaire au cahier des charges d'achat : 4-1 et 4-2 pour les produits, 2-4 pour les intégrateurs et prestataires de services, et 3-3 pour le système livré.

### Certifications que vous pouvez demander

ISASecure, filiale en propriété exclusive de l'ISA fondée en 2007, gère des programmes de certification fondés sur la 62443 [7] :

| Programme | Ce qui est certifié | Fondé sur |
|---|---|---|
| ISASecure CSA | Composants (automates, IHM, équipements réseau, logiciels) | IEC 62443-4-2 [7] |
| ISASecure SSA | Systèmes | IEC 62443-3-3 [7] |
| ISASecure SDLA | Le cycle de développement sécurisé d'un fournisseur | IEC 62443-4-1 [7] |
| ISASecure ACSSA | Un IACS en exploitation sur un site : politiques, procédures, prestataires de services et mesures techniques, à partir de l'évaluation des risques réalisée par le propriétaire de l'actif | IEC 62443-2-1, 2-4, 3-2 et 3-3 ; annoncé le 18 juin 2025 [8] |

D'autres systèmes d'évaluation de la conformité délivrent aussi des certificats (le programme de cybersécurité IECEE de la CEI est la principale alternative à ISASecure, comme le décrit un livre blanc ISASecure publié par l'ISA [37]). Un certificat est une preuve, non une garantie : vérifiez la version certifiée du produit et le niveau de sécurité par rapport à ce que vous achetez.

### Clauses pour le cahier des charges d'achat (modèle)

| Sujet | Exemple d'exigence |
|---|---|
| Norme | Le fournisseur respecte l'IEC 62443-4-1 (produit) et l'IEC 62443-2-4 (intégration) dans l'édition en vigueur à la date de commande ; preuve : certificat ou auto-évaluation par rapport aux exigences listées |
| Niveau de sécurité | Les composants et le système livré atteignent le SL-C 2 (SL-C 3 pour les zones Z4, Z8) selon l'IEC 62443-4-2 / 3-3 |
| Adéquation aux zones | Machine livrée comme une seule zone avec une interface de conduit définie ; liste documentée de tous les ports, protocoles et services |
| Accès à distance | Pas de modems ou routeurs intégrés ; assistance à distance uniquement via la passerelle du propriétaire de l'actif |
| Comptes | Comptes utilisateurs nominatifs avec droits basés sur les rôles ; pas de comptes codés en dur ou non documentés ; mots de passe par défaut modifiés à la mise en service |
| Durcissement | Services inutilisés désactivés ; guide de durcissement livré |
| Correctifs | Le fournisseur publie des avis de sécurité, teste les correctifs OS et firmware dans un délai indiqué, et assure le support du produit pendant une durée déterminée |
| SBOM | Nomenclature logicielle (software bill of materials) pour les logiciels et firmwares livrés |
| Sauvegardes | Programmes et projets livrés sous forme modifiable, avec instructions de restauration |
| Documentation | Schéma réseau, liste des actifs dans le modèle du propriétaire de l'actif, exigences de règles de pare-feu |
| Essais | Test d'acceptation de sécurité (scan de ports dans un environnement de test, revue des comptes) intégré aux essais d'acceptation en usine et sur site |
| Obligations en cas d'incident | Le fournisseur notifie au propriétaire de l'actif les vulnérabilités et incidents affectant le système livré dans un délai indiqué |

Le CRA (article 19) rend plusieurs de ces exigences obligatoires juridiquement pour les produits mis sur le marché de l'UE, notamment les mises à jour de sécurité et une SBOM [22][23]. Les acheteurs américains en bénéficient, même pour des sites uniquement aux États-Unis, car les mêmes produits sont vendus dans le monde entier.

### Intégrateurs et prestataires de services

La fiche d'information CISA/FBI sur les intégrateurs, publiée en septembre 2026, ajoute le point de vue de l'exploitant : inscrivez les exigences de cybersécurité et de chaîne d'approvisionnement dans les contrats et accords de service, définissez où les données et équipements sont hébergés, et limitez et surveillez les accès des intégrateurs [14]. Demandez aux prestataires de services leurs preuves de conformité à la 62443-2-4, et examinez leurs accès distants et leur gestion des données comme vous examineriez le programme de sécurité d'un sous-traitant.

## Personnes, sécurité et atelier

La cybersécurité OT échoue lorsqu'elle est conçue dans le bureau informatique puis imposée à l'atelier. Les personnes qui conduisent les machines constituent à la fois la première ligne de défense et les premières victimes de contrôles mal conçus.

### Rôles et responsabilités (exemple pour un site de taille moyenne)

| Rôle | Responsabilité en cybersécurité OT |
|---|---|
| Directeur de site | Propriétaire des actifs ; approuve les évaluations des risques et les risques résiduels ; responsable du budget |
| Responsable de la cybersécurité OT (souvent un ingénieur automatisme, à temps partiel au départ) | Modèle de zones, inventaire, règles, coordination des incidents |
| Sécurité informatique du groupe / RSSI | Zone d'entreprise, identités, SOC, politiques, alignement sur le CSF 2.0 |
| Ingénierie des automatismes | Configuration sécurisée, sauvegardes, gestion des modifications de logique |
| Maintenance | Accès physique, règles relatives aux supports amovibles, pièces de rechange |
| HSE / sécurité des procédés | Relie les PHA/HAZOP aux conséquences en matière de sécurité ; valide les zones de sécurité |
| Achats | Clauses de sécurité dans les cahiers des charges et les contrats |
| Chefs de production et opérateurs | Signalent les anomalies, respectent les règles d'accès et de supports, assurent le repli en mode manuel |

### Sécurité et sûreté ensemble

Les ingénieurs sécurité des procédés et les ingénieurs cybersécurité emploient souvent des termes différents pour des notions proches : dangers et menaces, SIL et SL, PHA et évaluation des risques. Faites-les travailler ensemble. Deux règles sont non négociables :

- Les mesures de cybersécurité ne doivent jamais désactiver ni dégrader une fonction de sécurité.
- La réponse à un incident de cybersécurité ne doit jamais contourner la décision de l'équipe sécurité sur l'état de sécurité.

### Une formation acceptée par les opérateurs

- Rendez le signalement sans risque. Un opérateur qui avoue avoir branché un chargeur de téléphone doit être remercié, non sanctionné ; sinon, le prochain incident ne sera pas signalé.
- Des modules courts et propres à chaque rôle : ce que l'opérateur doit signaler (clés USB inconnues, comportement inhabituel de l'IHM, personnes inconnues demandant un accès), et non un cours générique sur l'hameçonnage.
- Expliquez le pourquoi. Les opérateurs comprennent la consignation (LOTO) parce qu'ils savent ce qu'elle empêche. Les règles de cybersécurité ont besoin de la même explication.
- Impliquez les salariés dans la conception des contrôles qui les concernent, comme la connexion par badge sur les IHM ou le verrouillage des écrans. Dans les sites syndiqués, les modifications des règles de travail ou de la surveillance peuvent devoir être discutées avec les représentants du personnel ; impliquez tôt les RH et les relations sociales [orientation générale ; vérifiez votre convention collective].

Pour la routine plus large de la résolution quotidienne des problèmes sur l'atelier, voir le guide sur [le management de l'atelier](https://www.m365.fm/en/learn/shop-floor-management/) ; une anomalie de sécurité n'est qu'un point de plus à l'ordre du jour de la réunion quotidienne de niveau 1.

## Obligations américaines et européennes : CMMC, SEC, CIRCIA, NIS2 et CRA

62443 est en soi volontaire. Les obligations ci-dessous ne le sont pas. Lesquelles s'appliquent dépend de vos clients, de votre actionnariat et des pays où vous vendez.

### CMMC 2.0 pour les fournisseurs de la défense

Si vous fabriquez des pièces pour le département américain de la Défense, le Cybersecurity Maturity Model Certification (CMMC) s'applique aux systèmes qui traitent, stockent ou transmettent des Federal Contract Information (FCI) ou des Controlled Unclassified Information (CUI). La règle du programme (32 CFR Part 170) est entrée en vigueur le 16 décembre 2024 [28]. La règle DFARS qui intègre le CMMC dans les contrats est entrée en vigueur le 10 novembre 2025, avec un déploiement progressif sur trois ans : la phase 2 a débuté le 10 novembre 2026 et la phase 3 est prévue pour le 10 novembre 2027 [29]. Le niveau 2 repose sur le NIST SP 800-171 [28][29].

Ce que cela signifie pour l'atelier :

- **Le périmètre dépend des données, pas des machines.** Une machine CNC qui reçoit des plans ou des programmes marqués CUI peut être dans le périmètre. Un automate qui ne pilote qu'un convoyeur ne l'est généralement pas. Les marquages CUI et le contrat tranchent.
- **Utilisez des zones pour limiter le périmètre.** Un modèle de zones bien segmenté peut réduire le périmètre d'évaluation CMMC. C'est l'un des arguments financiers les plus clairs en faveur de la segmentation dans les chaînes d'approvisionnement de la défense.
- **Cas particuliers.** Pour le niveau 2, 32 CFR 170.19(c)(1) énumère les dispositifs OT, IIoT et IoT, les équipements de test, les équipements fournis par le gouvernement et les systèmes d'information restreints comme « Specialized Assets » : des actifs qui peuvent traiter, stocker ou transmettre du CUI mais ne peuvent pas être entièrement sécurisés. Ils doivent figurer dans l'inventaire des actifs, dans le SSP, être gérés selon vos politiques de sécurité fondées sur les risques et apparaître dans le schéma réseau ; l'évaluateur examine le SSP mais n'évalue pas ces actifs au regard des autres exigences CMMC [38].

Pour le volet planification des travaux de défense, le [guide de planification de production aérospatiale](https://www.m365.fm/en/learn/aerospace-production-planning/) traite du CMMC, de l'ITAR et du DFARS dans le contexte des chaînes d'approvisionnement AS9100.

### Règles de la SEC pour les sociétés cotées

En vertu des règles de la SEC adoptées le 26 juillet 2023, les émetteurs doivent déclarer un incident de cybersécurité significatif dans un formulaire 8-K dans les quatre jours ouvrés suivant la détermination de son caractère significatif, et décrire leur gestion des risques de cybersécurité, leur stratégie et leur gouvernance dans le rapport annuel [26]. Une attaque par rançongiciel qui arrête une usine est un cas typique d'évaluation de la significativité ; le playbook OT doit donc prévoir une voie rapide vers le comité de divulgation.

### CIRCIA

La loi Cyber Incident Reporting for Critical Infrastructure Act obligera les entités couvertes à signaler les incidents cyber couverts à la CISA dans les 72 heures, et les paiements de rançon dans les 24 heures, une fois la règle finale de la CISA entrée en vigueur. En octobre 2026, la règle finale avait été transmise à la Maison-Blanche pour examen et n'avait pas été publiée [27] ; le 9 novembre 2026, elle était toujours en attente là-bas, après son arrivée le 1er octobre 2026 [39]. La fabrication critique est un secteur d'infrastructures critiques [32] : suivez donc les fabricants que la règle finale couvrira.

### NIS2 pour les sociétés américaines disposant de sites dans l'UE

La directive européenne NIS2 s'applique, par le biais des lois nationales, aux entités essentielles et importantes de l'UE, y compris de nombreux secteurs manufacturiers. Une société américaine est concernée par l'intermédiaire de ses filiales et usines européennes. La loi de transposition allemande est entrée en vigueur le 6 décembre 2025 ; l'Office fédéral allemand de la sécurité de l'information (BSI) indique qu'il supervise désormais environ 29 500 entités contre environ 4 500 auparavant [24]. En Allemagne, les entreprises sont dans le périmètre si elles relèvent des types d'entités listés et comptent au moins 50 salariés, ou plus de 10 millions d'euros à la fois de chiffre d'affaires annuel et de total de bilan ; les entrées industrielles comprennent les dispositifs médicaux, les ordinateurs et l'électronique, les équipements électriques, les machines et les véhicules [25][40]. Les incidents significatifs nécessitent une alerte précoce dans les 24 heures, une notification dans les 72 heures et un rapport final sous un mois [25]. Les autres États membres ont des règles similaires avec des particularités locales ; vérifiez chaque pays où vous disposez d'une usine.

### Cyber Resilience Act pour les constructeurs de machines et les fabricants de composants

Si vous vendez des machines, des automates ou des logiciels comportant des éléments numériques sur le marché de l'UE, le Cyber Resilience Act (règlement (UE) 2024/2847) s'applique, y compris aux fabricants américains. Depuis le 11 septembre 2026, les fabricants doivent signaler les vulnérabilités activement exploitées et les incidents graves via la plateforme de signalement unique de l'ENISA : une alerte précoce dans les 24 heures, une notification dans les 72 heures, un rapport final dans les 14 jours suivant la mise à disposition d'une mesure corrective (vulnérabilités) ou dans un délai d'un mois (incidents) [22]. Les principales exigences relatives aux produits s'appliquent à partir du 11 décembre 2027 [23]. Pour les constructeurs de machines, cela transforme le développement sécurisé de type 62443-4-1 en conformité produit.

### Cyber-assurance

Les assureurs posent de plus en plus de questions détaillées sur l'OT : segmentation, accès à distance, sauvegardes hors ligne, MFA. L'affaire Merck montre à quel point le libellé des polices peut être déterminant : une cour d'appel du New Jersey a jugé que l'exclusion pour guerre figurant dans les polices dommages de Merck ne s'appliquait pas à NotPetya, avant que les parties ne transigent [18]. Vérifiez avec votre courtier si vos polices couvrent les pertes de production consécutives à des événements cyber et dans quelles conditions [indications générales].

## Une feuille de route sur 12 à 24 mois

La feuille de route ci-dessous s'adresse à un site unique de taille moyenne, comme celui décrit à la section 9, avec un responsable de la sécurité OT à environ un demi-poste à temps plein la première année (hypothèse de planification de notre part), un appui de l'informatique du groupe et un partenaire externe pour des tâches précises telles que l'atelier d'appréciation des risques et la conception de la segmentation. Les entreprises multisites pilotent la phase 0 au niveau central et les phases 1 à 4 par site, en commençant par l'usine présentant le risque le plus élevé ou le plus de projets d'investissement à venir.

| Phase | Mois | Objectifs | Livrables principaux | Ancrage 62443 / CSF |
|---|---|---|---|---|
| 0. Mandat | 0-1 | Responsabilité et périmètre | Propriétaire d'actifs et responsable de la sécurité OT désignés, comité de pilotage, périmètre du premier système concerné, budget de l'année 1 | 2-1 ; CSF Govern |
| 1. Connaître et stopper l'hémorragie | 1-6 | Visibilité et réduction rapide des risques | Inventaire des actifs (premier passage), cartographie des flux, liste des accès à distance ; suppression ou encadrement des accès distants non contrôlés ; sauvegardes hors ligne de toute la logique des automates ; mots de passe par défaut modifiés ; règles pour les supports amovibles ; premier exercice sur table | 3-2 ZCR 1-2 ; CSF Identify, Protect |
| 2. Architecture | 4-12 | Confinement | Modèle de zones et de conduits avec SL-T, approuvé par le propriétaire d'actifs ; DMZ industrielle (IDMZ) mise en place ; trafic entreprise-usine uniquement via l'IDMZ ; passerelle d'accès distant avec MFA et enregistrement ; séparation des domaines ou des comptes OT | 3-2 ZCR 3-7 ; 3-3 FR 5 ; CSF Protect |
| 3. Détecter et réagir | 9-18 | Voir et réagir | Supervision OT passive sur les conduits clés ; collecte des journaux ; playbook SOC avec droits de décision ; playbook écrit de réponse aux incidents OT ; tests de restauration | 3-3 FR 6, FR 7 ; CSF Detect, Respond, Recover |
| 4. Durcir et acheter correctement | 12-24 | Atteindre SL-A, prévenir de nouvelles failles | Segmentation interne achevée ; durcissement des systèmes OT Windows ; processus de décision sur les correctifs opérationnel ; clauses de sécurité dans toutes les nouvelles spécifications d'achat ; exigences envers les intégrateurs selon 2-4 ; reporting des KPI à la direction | 2-3, 2-4, 4-1, 4-2 ; CSF Govern |
| 5. Exploiter et améliorer | à partir du mois 24 | Programme en fonctionnement | Mise à jour annuelle de l'appréciation des risques, exercice annuel sur table, audit interne, évaluation optionnelle ACSSA ou autre évaluation de site | 2-1 ; CSF toutes fonctions |

### Ce qu'il faut faire dans les 30 premiers jours

1. Désignez le propriétaire d'actifs (en général le directeur d'usine) et le responsable de la sécurité OT.
2. Listez chaque accès distant que vous connaissez et demandez à chaque constructeur de machines comment il se connecte.
3. Vérifiez si vous disposez de copies hors ligne des programmes actuels de vos automates les plus critiques.
4. Vérifiez si le réseau bureautique et le réseau de l'usine sont routés l'un vers l'autre sans pare-feu.
5. Demandez au NIST MEP ou à votre équipe sécurité du groupe une auto-évaluation fondée sur le CSF [30].
6. Planifiez un exercice sur table de deux heures avec le scénario « le MES et l'ERP sont chiffrés ».

Aucune de ces étapes ne nécessite de nouvelle technologie. Elles produisent les faits sur lesquels repose le budget de la phase 2.

### Intégrer la feuille de route à la réalité de l'usine

- **Profiter des arrêts planifiés.** La segmentation et les changements de firmware nécessitent des fenêtres d'intervention ; planifiez-les un an à l'avance avec la maintenance.
- **S'appuyer sur les projets d'investissement.** Une nouvelle ligne est le moment le moins coûteux pour construire une zone propre, dotée d'un accès distant sécurisé et de comptes nominatifs.
- **Ne pas commencer par l'outil.** Acheter une plateforme de supervision avant que l'inventaire et le modèle de zones n'existent produit des alertes que personne ne sait interpréter.

## Budget et ROI : comment justifier le projet

La sécurité OT ne génère pas de chiffre d'affaires. Elle réduit la probabilité et l'impact d'une perte. Le dossier comporte donc trois volets : la perte attendue évitée, la valeur d'activation et les obligations.

### Catégories de coûts

| Catégorie | Éléments typiques | Capex ou opex |
|---|---|---|
| Architecture | Pare-feu pour l'IDMZ et les conduits, commutateurs gérés, serveurs IDMZ, passerelle d'accès à distance | Principalement capex (matériel), opex pour les abonnements |
| Visibilité | Plateforme de supervision OT, capteurs, TAP réseau | Capex ou abonnement |
| Ressources humaines | Responsable sécurité OT (temps partiel ou plein), formation, spécialistes externes | Opex |
| Services | Appui à l'évaluation des risques, conception de la segmentation, SOC ou détection managée | Opex |
| Remplacement | Mise à niveau des IHM et automates en fin de vie | Capex, idéalement intégré aux reconstructions de lignes |
| Reprise | Systèmes de sauvegarde, postes d'ingénierie et automates de secours | Capex |

Nous ne donnons pas ici de montants génériques en dollars, car aucune source américaine vérifiable ne fournit de référence fiable pour une usine d'une taille donnée ; les prix dépendent du nombre de zones, de l'âge des équipements et des fournisseurs. Obtenez deux ou trois offres cadrées après la phase 1.

### Perte attendue : un exemple chiffré

L'espérance de perte annualisée (ALE, Annualized Loss Expectancy) est un moyen simple d'exprimer le risque dans le langage de l'équipe financière :

ALE = taux annuel d'occurrence (ARO) x perte unitaire attendue (SLE)

Pour Midwest Components (section 9), l'équipe finance et exploitation estime le coût d'un événement de type rançongiciel qui arrête l'usine :

| Élément | Hypothèse | Montant |
|---|---|---|
| Marge sur coûts variables perdue | 10 jours de production x 160 000 $ de marge sur coûts variables par jour | 1 600 000 $ |
| Heures supplémentaires et accélération pour résorber le retard | Estimation | 350 000 $ |
| Rebut et reprise liés aux lots interrompus | Estimation | 120 000 $ |
| Services de réponse à incident et de reprise | Estimation | 400 000 $ |
| Pénalités clients | Termes contractuels avec deux clients OEM | 250 000 $ |
| **SLE (perte unitaire attendue)** | | **2 720 000 $** |

Sans le programme, l'équipe estime la probabilité annuelle d'un tel événement à 10 % (ARO 0,10) ; une fois les phases 1 à 3 achevées, elle prévoit que l'événement sera à la fois moins probable (ARO 0,04, car la segmentation et l'accès à distance contrôlé ferment les voies les plus courantes) et plus court (5 jours au lieu de 10, car les sauvegardes et les procédures de reprise sont testées), ce qui ramène le SLE à environ 1 640 000 $ (5 jours x 160 000 $ = 800 000 $, moitié des heures supplémentaires à 175 000 $, rebut inchangé à 120 000 $, coûts de réponse de 300 000 $ et pénalités inchangées à 250 000 $, arrondi).

- ALE avant : 0,10 x 2 720 000 $ = 272 000 $ par an
- ALE après : 0,04 x 1 640 000 $ = 65 600 $ par an
- Réduction du risque : 272 000 $ - 65 600 $ = 206 400 $ par an

Si le programme coûte 450 000 $ sur deux ans, plus 120 000 $ par an de coûts de fonctionnement, le délai de récupération simple, sur la seule réduction du risque, est de : (450 000 $) / (206 400 $ - 120 000 $) = environ 5,2 ans. Le résultat paraît modeste, et il doit être présenté avec honnêteté. Les hypothèses sont des estimations ; l'ARO en particulier est incertain. Présentez une fourchette (par exemple ARO de 0,05 à 0,20) et laissez la direction voir comment le résultat évolue. Avec un ARO de 0,20 avant et de 0,06 après, la réduction annuelle est de 544 000 $ - 98 400 $ = 445 600 $, et le délai de récupération tombe à environ 1,4 an.

Tous les chiffres de cet exemple sont des hypothèses illustratives, et non des références sectorielles.

### Valeur au-delà de la réduction des pertes

- **Exigences clients et contractuelles :** CMMC pour les travaux de défense [28][29], questionnaires de sécurité des clients OEM, obligations européennes pour les sites et produits de l'UE [22][24].
- **Assurance :** de meilleures réponses sur la segmentation, la MFA et les sauvegardes influencent l'assurabilité et les conditions [indications générales ; interrogez votre courtier].
- **Activation des projets numériques :** un modèle IDMZ et de conduits propre rend l'approbation des projets MES, d'historien et cloud plus rapide et plus sûre. Voir [maintenance prédictive et IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) et [jumeau numérique en fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/) pour les projets qui en dépendent.
- **Moins de pannes auto-infligées :** l'inventaire des actifs, la gestion des changements et des sauvegardes testées raccourcissent aussi la reprise après des défaillances ordinaires, comme un disque dur défectueux dans une IHM.

### Capex et opex

Les pare-feu et les serveurs sont généralement immobilisés ; les abonnements, les services managés et le personnel relèvent de l'opex. Le passage à des outils par abonnement fait basculer les dépenses du capex vers l'opex, ce qui compte pour les sites dont le budget d'investissement est serré mais le budget de fonctionnement plus souple. Discutez-en tôt avec le contrôleur de site pour définir la classification du programme ; elle détermine quel responsable budgétaire doit approuver.

## KPI de sécurité OT

Mesurez quelques indicateurs qui orientent les comportements. Présentez-les chaque mois au comité de pilotage et chaque trimestre à la direction. Pour la conception générale des KPI, consultez le guide sur les [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/).

| KPI | Formule | Objectif indicatif | Pourquoi c'est important |
|---|---|---|---|
| Couverture de l'inventaire | Actifs avec tous les champs obligatoires renseignés / actifs vus par la supervision x 100 | > 95 % | Base de tout le reste |
| Chemins d'accès distants non maîtrisés | Nombre de chemins distants ne passant pas par la passerelle | 0 | Voie d'entrée la plus fréquente |
| Zones avec SL-T approuvé | Zones avec évaluation des risques signée / total des zones x 100 | 100 % | Montre que la méthode est appliquée |
| Hygiène des règles de conduit | Règles de pare-feu avec propriétaire, justification et date de revue valide / total des règles x 100 | > 90 % | Empêche la prolifération des règles |
| Contrôleurs critiques avec restauration testée | Contrôleurs dont la restauration a été testée au cours des 12 derniers mois / contrôleurs critiques x 100 | 100 % | Préparation à la reprise |
| Actualité des sauvegardes | Contrôleurs dont la sauvegarde hors ligne correspond au programme en cours / total des contrôleurs x 100 | > 98 % | Détecte la dérive et les modifications non autorisées |
| Délai moyen de décision sur les avis de sécurité | Nombre moyen de jours entre la publication de l'avis et la décision documentée | < 30 jours | Montre que le processus de correctifs fonctionne |
| Réduction des comptes partagés | Systèmes utilisant encore des identifiants partagés / systèmes dans le périmètre | En baisse chaque trimestre | Progrès sur FR 1 et FR 2 |
| Délai de tri des alertes | Délai médian entre une alerte OT de priorité élevée et son tri | < 1 heure | Montre que la détection est utile |
| Exercices sur table | Exercices par an avec la présence de la production | Au moins 1 | La réponse est entraînée |
| Nouveaux équipements avec clauses de sécurité | Bons de commande d'automatisme avec clauses 62443 / total des bons de commande d'automatisme x 100 | 100 % | Empêche de nouvelles lacunes |

**Exemple de calcul.** La supervision voit 640 actifs ; 598 ont tous les champs obligatoires. Couverture de l'inventaire = 598 / 640 x 100 = 93,4 %. Objectif manqué de 1,6 point ; action : compléter les 42 fiches, principalement dans la zone soudage.

Évitez les indicateurs de vanité, comme le « nombre de connexions bloquées ». Une hausse peut signifier une meilleure protection ou davantage de mauvaises configurations.

## Erreurs courantes

1. **Copier les contrôles IT à l'identique.** Le scan actif, les correctifs automatiques et les agents de endpoint sur les automates ont déjà provoqué des arrêts de production. Testez tout avec le fournisseur au préalable.
2. **Commencer par l'achat d'un outil.** Sans inventaire ni modèle de zones, une plateforme de supervision ne produit que du bruit.
3. **Une seule zone géante.** Un pare-feu entre le bureau et l'atelier est nécessaire, mais un réseau d'atelier à plat derrière lui permet à un malware d'atteindre chaque ligne.
4. **Trop de zones.** Des règles que personne ne comprend sont ouvertes largement « temporairement » et le restent.
5. **Ignorer les boîtiers d'accès à distance.** Le routeur cellulaire installé dans l'armoire d'une machine contourne l'ensemble de l'architecture.
6. **Des sauvegardes jamais restaurées.** Beaucoup d'usines découvrent lors d'un incident que la sauvegarde est incomplète ou ancienne.
7. **Aucun droit de décision défini.** En cas d'incident, la question « qui peut déconnecter l'usine ? » doit déjà avoir une réponse.
8. **La sécurité sans la production.** Les contrôles conçus sans les opérateurs ni la maintenance sont contournés.
9. **Traiter la 62443 comme un projet de certification.** La valeur réside dans la méthode et la routine continue, pas dans le papier.
10. **Oublier le service d'assistance et l'identité.** L'affaire Clorox montre qu'un processus de réinitialisation d'identité peut être le maillon le plus faible [20].
11. **Acheter de nouvelles failles.** Chaque machine commandée sans clauses de sécurité crée un problème d'héritage pour les 20 années suivantes.
12. **Supposer un « air gap ».** La plupart des usines qui se croient isolées ont au moins une connexion inconnue.

## Limites de la CEI 62443 et des programmes de sécurité OT

La 62443 est le meilleur référentiel disponible pour la sécurité de l'automatisation industrielle, mais elle a des limites que vous devez connaître avant de construire un programme sur cette base.

- **Coût et accès.** Les documents sont des publications payantes, et Industrial Cyber évalue la série complète à plus de 800 pages [34]. Les petites usines les lisent rarement en entier ; les guides de démarrage rapide et les consultants comblent le vide, avec une qualité variable.
- **Ancienneté et révision.** La 3-3 date de 2013, et les deuxièmes éditions des 3-2, 3-3 et 4-2 sont toujours en cours d'élaboration [1][6]. Certains sujets (cloud, IIoT, edge conteneurisé) ne sont traités que par des documents PAS plus récents, comme la 1-6 [5].
- **Jugement, pas formule.** La norme demande de fixer le SL-T selon le risque, mais elle ne dit pas exactement quel SL une ligne de presse requiert. Deux équipes qualifiées peuvent aboutir à des réponses différentes.
- **Les niveaux de sécurité ne sont pas des garanties.** Un composant SL-C 3 mal configuré donne un SL-A 1. La certification couvre des versions et des configurations précises.
- **La réalité des systèmes existants.** De nombreux systèmes installés ne peuvent pas satisfaire les exigences SL 2 pour les FR 1 et FR 2. Les mesures compensatoires fonctionnent, mais elles ajoutent de la complexité.
- **Exigences organisationnelles.** Les 2-1 et 2-4 imposent des processus documentés ; le ML 2 et au-delà représentent un effort réel pour une petite usine et ses intégrateurs.
- **Aucune protection contre tout.** La segmentation et la supervision réduisent le risque ; elles n'empêchent pas un attaquant déterminé et bien doté en moyens. La capacité de reprise reste essentielle.
- **Chevauchement des référentiels.** La mise en correspondance de la 62443 avec le CSF 2.0, le SP 800-82, le CMMC et la NIS2 demande un effort important. Le projet de révision 4 du SP 800-82, restructuré autour du CSF 2.0, devrait faciliter le volet NIST une fois finalisé [10].

## Glossaire

| Terme | Signification |
|---|---|
| ACSSA | Programme de certification ISASecure pour les sites d'exploitation, fondé sur 62443-2-1, 2-4, 3-2 et 3-3 [8] |
| ALE | Perte annuelle attendue = ARO x SLE |
| Propriétaire d'actifs | Organisation responsable et redevable de l'IACS [2] |
| ATT&CK for ICS | Base de connaissances MITRE des tactiques et techniques d'adversaires contre les systèmes de contrôle industriels [15] |
| Conduit | Regroupement logique des canaux de communication entre zones partageant les mêmes exigences de sécurité [2] |
| CPG | CISA Cybersecurity Performance Goals ; version 2.0 de décembre 2025 [13] |
| CRS | Spécification des exigences de cybersécurité, résultat de 62443-3-2 |
| CSA / SSA / SDLA | Certifications ISASecure pour les composants (4-2), les systèmes (3-3) et les cycles de vie de développement (4-1) [7] |
| CSF 2.0 | Cadre de cybersécurité NIST 2.0 comprenant six fonctions [11] |
| CUI / FCI | Informations non classifiées contrôlées / Informations contractuelles fédérales (périmètre CMMC) |
| DCS | Système de contrôle distribué |
| Défense en profondeur | Plusieurs couches de protection pour retarder ou empêcher une attaque [2] |
| Fonctions essentielles | Fonctions nécessaires à la santé, à la sécurité, à l'environnement et à la disponibilité de l'équipement contrôlé [2] |
| FR | Exigence fondamentale ; sept dans 62443 (IAC, UC, SI, DC, RDF, TRE, RA) [2] |
| HMI | Interface homme-machine |
| IACS | Système d'automatisation et de contrôle industriel |
| IDMZ | Zone démilitarisée industrielle entre l'entreprise et l'usine |
| IIoT | Internet industriel des objets |
| Niveau de maturité (ML) | Mesure de la maturité des processus, ML 1 à ML 4 dans 62443 [3] |
| MOC | Gestion des changements |
| OT | Technologie opérationnelle : systèmes qui interagissent avec l'environnement physique [9] |
| PLC | Automate programmable industriel |
| Modèle de Purdue | Architecture de référence en couches (niveaux 0 à 5) utilisée pour cartographier les réseaux d'usine |
| SBOM | Nomenclature logicielle (liste des composants logiciels) |
| SCADA | Supervision, contrôle et acquisition de données |
| SIS | Système instrumenté de sécurité |
| SL-T / SL-C / SL-A | Niveau de sécurité cible, de capacité et atteint [2] |
| SUC | Système en cours d'examen (62443-3-2) |
| Zone | Regroupement d'actifs selon le risque ou d'autres critères [2] |

## FAQ : cybersécurité OT et IEC 62443

### Qu'est-ce que la cybersécurité OT ?

La cybersécurité OT protège les systèmes qui surveillent et contrôlent les processus physiques, tels que les automates programmables, SCADA, IHM, robots et systèmes de sécurité, contre les perturbations et les manipulations. Ses priorités sont d'abord la sécurité et la disponibilité, puis l'intégrité et la confidentialité. Le document NIST SP 800-82 Rev. 3 est le principal guide américain [9].

### Quelle est la différence entre la sécurité IT et la sécurité OT ?

La sécurité IT protège les données et les systèmes métier, généralement avec la confidentialité en premier. La sécurité OT protège les processus physiques, où un contrôle défaillant peut blesser des personnes ou arrêter la production. Les systèmes OT ont une durée de vie plus longue, sont plus difficiles à corriger, utilisent souvent des protocoles sans authentification et ne changent que pendant des fenêtres planifiées (section 2).

### Qu'est-ce que l'ISA/IEC 62443 ?

Une série de normes internationales sur la sécurité des systèmes d'automatisation et de contrôle industriels, élaborées par le comité ISA99 et l'IEC. Elle est organisée en quatre groupes (général, politiques et procédures, système, composant) et définit les rôles, les zones et conduits, les niveaux de sécurité et les exigences fondamentales [1][2].

### Quelle est la différence entre la sécurité OT et la sécurité ICS ?

Dans l'usage courant, aucune. La sécurité ICS est le terme plus ancien et désigne les systèmes de contrôle industriels tels que PLC, DCS et SCADA. La sécurité OT est plus large et couvre aussi l'automatisation des bâtiments, les transports et les systèmes de contrôle d'accès physique, ce que le NIST SP 800-82 Rev. 3 retient pour définir l'OT [9]. La sécurité IIoT concerne les capteurs et passerelles connectés qui transmettent des données vers des plateformes en périphérie ou dans le cloud ; la norme IEC PAS 62443-1-6 applique la série 62443 à l'IIoT [5].

### Quels sont les rôles dans l'IEC 62443 ?

Le propriétaire d'actifs (responsable de l'IACS), le prestataire d'intégration, le prestataire de maintenance et le fournisseur de produits [2]. Chaque rôle dispose de ses propres parties de la série, ce qui permet de rédiger des contrats clairs (section 5).

### L'IEC 62443 est-elle obligatoire aux États-Unis ?

Aucune loi américaine n'impose 62443 de manière générale. Elle devient contraignante par les contrats clients, les spécifications d'achat, les conditions d'assurance ou les règles sectorielles. Des textes européens comme le CRA créent des obligations que les processus fondés sur 62443 aident à satisfaire [22].

### Quels sont les niveaux de sécurité de la norme IEC 62443 ?

SL 1 protège contre une violation fortuite ou occasionnelle, SL 2 contre une violation intentionnelle réalisée avec des moyens simples, SL 3 contre des attaquants sophistiqués disposant de compétences spécifiques aux IACS et de ressources modérées, et SL 4 contre des attaquants sophistiqués disposant de ressources étendues et d'une forte motivation [2]. Chaque zone reçoit un niveau cible, souvent par exigence fondamentale.

### Quelles sont les sept exigences fondamentales de la norme IEC 62443 ?

Le contrôle de l'identification et de l'authentification, le contrôle d'utilisation, l'intégrité du système, la confidentialité des données, la restriction des flux de données, la réponse rapide aux événements et la disponibilité des ressources [2].

### Qu'appelle-t-on zones et conduits ?

Une zone regroupe des actifs ayant des exigences de sécurité similaires ; un conduit regroupe les canaux de communication entre zones et porte les contrôles applicables à ce trafic [2]. La section 9 présente un exemple complet pour une usine de taille moyenne.

### Par quelle partie de la norme IEC 62443 un propriétaire d'actifs doit-il commencer ?

Par la norme 62443-2-1 pour le programme de sécurité et la norme 62443-3-2 pour l'évaluation des risques et le modèle de zones. La norme 3-3 définit ensuite les exigences système par niveau de sécurité, et les normes 2-4 et 4-1/4-2 traitent des contrats avec les intégrateurs et les fournisseurs [1].

### Comment la norme IEC 62443 se rapporte-t-elle au NIST Cybersecurity Framework ?

Les deux sont complémentaires. Le CSF 2.0 fournit la gouvernance et un langage commun pour l'ensemble de l'entreprise [11] ; la norme 62443 fournit la méthode technique et organisationnelle pour l'usine. La publication NIST SP 800-82 fait le lien entre les deux, et son projet de révision 4 est restructuré autour du CSF 2.0 [10].

### Qu'est-ce que le modèle de Purdue et est-il toujours pertinent ?

C'est une architecture de référence en couches, allant des équipements de terrain (niveau 0) jusqu'à l'entreprise (niveaux 4 et 5), avec souvent une DMZ industrielle au niveau 3.5. Il reste une carte de départ utile pour définir les zones, mais les connexions IIoT et cloud traversent ses niveaux ; les zones doivent donc suivre les risques et les flux de données réels (section 7).

### Comment le zero trust s'applique-t-il à l'OT ?

Le zero trust signifie qu'aucune confiance implicite n'est accordée en fonction de la localisation réseau : chaque utilisateur, appareil et connexion doit être autorisé pour l'accès précis dont il a besoin. Dans une usine, cela correspond à ce que la norme 62443 exige déjà : des zones avec des conduits explicites et filtrés par liste d'autorisation, des comptes individuels au lieu d'identifiants partagés, et des sessions d'accès à distance médiées et approuvées (sections 7, 11, 12 et 14). Commencez par les conduits et par les fonctions de gestion telles que l'ingénierie et l'accès des fournisseurs, car de nombreux protocoles de terrain ne disposent d'aucune authentification intégrée (section 2). Le projet de révision 4 de la publication NIST SP 800-82 ajoute des indications sur les principes du zero trust pour les fonctions de gestion des systèmes [10].

### Peut-on corriger des automates programmables anciens sans arrêter la production ?

Souvent pas immédiatement, et ce n'est pas obligatoire. Vérifiez d'abord si la fonction vulnérable est utilisée et accessible. Si le correctif du micrologiciel nécessite un redémarrage ou un test fonctionnel, appliquez dès maintenant des mesures compensatoires : restreindre le conduit, désactiver les services inutilisés comme un serveur web non utilisé, maintenir le commutateur à clé en mode RUN lorsque cela est pris en charge, et surveiller l'actif de plus près. Documentez et faites approuver le risque résiduel, puis installez le correctif lors du prochain arrêt planifié. La section 13 propose un tableau de décision et un exemple détaillé. Les automates qui ne recevront jamais de correctif doivent figurer dans un plan de remplacement, et non faire l'objet d'une exception permanente.

### Peut-on obtenir une certification IEC 62443 ?

Oui. Les produits peuvent être certifiés sous ISASecure CSA (4-2), les systèmes sous SSA (3-3), les organisations de développement sous SDLA (4-1) [7], et, depuis juin 2025, les sites en exploitation sous ISASecure ACSSA [8]. D'autres programmes d'évaluation de la conformité certifient également selon la norme 62443, notamment le programme de cybersécurité IECEE de la CEI [37].

### Quelle est la différence entre 62443-4-1 et 62443-4-2 ?

La norme 4-1 couvre le processus de développement sécurisé du fournisseur (la manière dont les produits sont conçus), la norme 4-2 les capacités techniques de sécurité d'un composant (ce que le produit peut faire) [1][7].

### Combien de temps faut-il pour mettre en œuvre la norme IEC 62443 dans une usine ?

Pour un site unique de taille moyenne, un parcours réaliste est de 12 à 24 mois pour le socle : inventaire, modèle de zones, IDMZ, accès à distance, sauvegardes, supervision et réponse aux incidents (section 20). Le programme se poursuit ensuite comme une routine annuelle. Cette estimation repose sur la feuille de route de ce guide, et non sur une référence publiée.

### Combien coûte la sécurité de l'OT ?

Cela dépend du nombre de zones, de l'âge des équipements et des outils retenus ; nous n'avons trouvé aucune référence publique fiable. La section 21 montre comment constituer le dossier avec l'espérance de perte annualisée et présente un exemple détaillé avec ses hypothèses.

### Le CMMC s'applique-t-il aux systèmes OT ?

Le CMMC s'applique aux systèmes qui traitent, stockent ou transmettent des FCI ou des CUI. Les machines qui reçoivent des plans ou des programmes marqués CUI peuvent être dans le périmètre ; une bonne segmentation permet de garder la frontière d'évaluation réduite [28][29]. Au niveau 2, un OT capable de traiter des CUI mais qui ne peut pas être entièrement sécurisé est compté comme un « Specialized Asset » : il est documenté dans l'inventaire, le SSP et le schéma réseau, mais n'est pas évalué au regard des autres exigences [38].

### Qu'a enseigné l'attaque contre Colonial Pipeline aux industriels ?

Qu'un incident IT peut arrêter une exploitation OT. Colonial a interrompu ses opérations de pipeline après une attaque par rançongiciel survenue vers le 7 mai 2021, a payé environ 75 bitcoins, et le département de la Justice a saisi plus tard 63,7 bitcoins [16]. Connaître vos dépendances et disposer d'un mode de fonctionnement dégradé comptent autant que la protection des automates.

### Les entreprises américaines disposant d'usines dans l'UE doivent-elles respecter la directive NIS2 ?

Leurs entités européennes peuvent y être soumises si elles relèvent des secteurs et des seuils de taille de la loi nationale de transposition. L'Allemagne, par exemple, applique NIS2 aux types d'entités réglementées comptant au moins 50 salariés ou dépassant 10 millions d'euros à la fois de chiffre d'affaires et de total de bilan [25][40].

## Conclusion

La cybersécurité OT relève de l'ingénierie des usines en gardant à l'esprit un attaquant. La norme ISA/IEC 62443 offre aux industriels une méthode adaptée à l'usine : connaître ses actifs, découper l'usine en zones reliées par des conduits contrôlés, fixer des niveaux de sécurité cibles selon le risque, combler l'écart par des mesures techniques et organisationnelles, et imposer les mêmes règles aux fournisseurs et intégrateurs. NIST CSF 2.0 et SP 800-82 rattachent cette méthode à la gouvernance américaine, et le CMMC, les règles de la SEC, NIS2 et le CRA ajoutent des obligations là où elles s'appliquent.

Les incidents documentés pointent vers les mêmes premières étapes : séparer l'usine de l'entreprise par une DMZ industrielle, contrôler chaque voie d'accès à distance, conserver des sauvegardes hors ligne testées de la logique des automates et des serveurs, et s'exercer à faire fonctionner l'usine lorsque l'IT est indisponible. Rien de tout cela n'exige d'attendre une architecture parfaite ou la prochaine édition de la norme. Commencez par la liste des 30 jours de la section 20, construisez le modèle de zones dans la première année, et mesurez les progrès à l'aide d'une poignée d'indicateurs KPI. En deux ans, une usine de taille moyenne peut passer de « nous espérons être isolés du réseau » à un programme de sécurité documenté, testé et en amélioration constante.

## Pour aller plus loin sur m365.fm

**Guides connexes**
- [Azure pour la fabrication](https://www.m365.fm/en/learn/manufacturing-it-azure/) : sécurité OT pour les architectures edge et cloud, transition vers Defender for IoT, CMMC et NIS2
- [MES et ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) : les niveaux fonctionnels et les flux de données que protège le modèle de zones
- [Maintenance prédictive et IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) : les connexions capteurs et cloud qui nécessitent leurs propres zones
- [Jumeau numérique dans la fabrication](https://www.m365.fm/en/learn/digital-twin-manufacturing/) : l'accès aux données qui dépend de conduits propres
- [Planification de la production aéronautique](https://www.m365.fm/en/learn/aerospace-production-planning/) : CMMC, ITAR et DFARS pour les chaînes d'approvisionnement de la défense
- [KPI de fabrication](https://www.m365.fm/en/learn/manufacturing-kpis/) : concevoir des systèmes d'indicateurs de performance
- [Management de l'atelier et Gemba walks](https://www.m365.fm/en/learn/shop-floor-management/) : les routines quotidiennes qui peuvent faire remonter des anomalies de sécurité
- [TPM et TRS](https://www.m365.fm/en/learn/tpm-oee/) : les routines de maintenance auxquelles appartiennent les sauvegardes et la gestion des changements
- [Excellence opérationnelle](https://www.m365.fm/en/learn/operational-excellence/) : les systèmes de management qui pérennisent des programmes comme celui-ci

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** est l'animateur de m365.fm et travaille chez iFAKT GmbH. Sur m365.fm, il écrit sur la production allégée, l'excellence opérationnelle, l'informatique industrielle et la transformation numérique de la production, notamment sur la manière dont les usines connectent en toute sécurité les systèmes d'atelier aux plateformes d'entreprise et cloud.

**Remarque : l'auteur travaille chez iFAKT GmbH.**

# Sources

All sources were opened and checked on November 20, 2026, unless noted otherwise.

1. ISA/IEC 62443 Series of Standards. International Society of Automation (ISA), catalog page with editions of all published parts. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
2. Quick Start Guide: An Overview of ISA/IEC 62443 Standards, Security of Industrial Automation and Control Systems. ISA Global Cybersecurity Alliance (ISAGCA), June 2020. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
3. IEC 62443. Wikipedia (secondary overview used for IEC edition dates, the SL 0 description and maturity level wording; checked against [1], [4], [5]). https://en.wikipedia.org/wiki/IEC_62443
4. IEC PAS 62443-2-2:2025, Security for industrial automation and control systems, Part 2-2: IACS security protection scheme. IEC webstore, published March 11, 2025. https://webstore.iec.ch/en/publication/63886
5. IEC PAS 62443-1-6:2025, Part 1-6: Application of the 62443 series to the Industrial Internet of Things (IIoT). IEC webstore, published December 19, 2025. https://webstore.iec.ch/en/publication/102885
6. Building a Resilient World: Status of the 62443 standards (second editions of 3-2, 3-3 and 4-2 in revision). ISA Global Cybersecurity Alliance blog (undated). https://gca.isa.org/blog/status-of-the-62443-standards
7. ISASecure (home page with the CSA, SSA, SDLA and ACSSA programs; "founded in 2007 and is a wholly owned subsidiary of ISA"). https://isasecure.org/
8. ISASecure Announces New IACS Security Assurance (ACSSA) Inspection and Certification Scheme. ISA press release, June 18, 2025. https://www.isa.org/news-press-releases/2025/june/isasecure-announces-new-iacs-security-assurance-ac
9. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final
10. Guide to Operational Technology (OT) Security: NIST Requests Comments on Draft SP 800-82r4. NIST news, September 21, 2026 (comments through November 30, 2026). https://www.nist.gov/news-events/news/2026/09/guide-operational-technology-ot-security-nist-requests-comments-draft-sp
11. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
12. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd (re-fetched November 20, 2026: still the initial public draft; comments closed November 17, 2025; no later version listed)
13. Cybersecurity Performance Goals 2.0 for Critical Infrastructure. CISA bulletin, released December 10, 2025. https://content.govdelivery.com/accounts/USDHSCISA/bulletins/3ff7850
14. OT Security Guidance: NIST Drafts Updated Guide, CISA, FBI Advise on ICS Integrators. SecurityWeek, September 24, 2026 (secondary report on the CISA/FBI fact sheet for operators working with third-party ICS integrators). https://www.securityweek.com/ot-security-guidance-nist-drafts-updated-guide-cisa-fbi-advise-on-ics-integrators/
15. ICS Matrix. MITRE ATT&CK for ICS, content version 20.1. https://attack.mitre.org/matrices/ics/
16. Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists Darkside. US Department of Justice, press release, June 7, 2021. https://www.justice.gov/archives/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside
17. Cyber-attack on Hydro. Norsk Hydro (company page). https://hydro.com/en/media/on-the-agenda/cyber-attack
18. Merck, insurers settle NotPetya coverage case. Cybersecurity Dive, January 8, 2024. https://www.cybersecuritydive.com/news/merck-settlement-notpetya/703922/
19. Clorox files $380M suit against Cognizant over 2023 cyberattack. Cybersecurity Dive, July 23, 2025. https://www.cybersecuritydive.com/news/clorox-380-million-suit-cognizant-cyberattack/753837/
20. Clorox lawsuit against Cognizant (details of the August 11, 2023 help desk calls, $49 million remediation, 6% volume decline, $100 million insurance recoveries). The Record by Recorded Future, July 2025. https://therecord.media/clorox-cyberattack-lawsuit-cognizant-it-contractor
21. JLR Hack UK's Costliest Ever, Hitting Economy with £1.9bn Loss. Infosecurity Magazine, October 2025 (report on the Cyber Monitoring Centre assessment). https://www.infosecurity-magazine.com/news/jlr-hack-uk-costliest-ever-19bn/
22. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
23. Cyber Resilience Act. German Federal Office for Information Security (BSI), English page (all requirements apply from December 11, 2027; SBOM; support period generally five years). https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
24. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html
25. Fragen und Antworten zu NIS-2 (NIS2 FAQ) and NIS-2-Meldepflicht (reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html (re-fetched November 20, 2026; the FAQ refers to the size thresholds of § 28 BSIG without the figures, see [40])
26. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139 (re-fetched November 20, 2026)
27. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open (re-fetched November 20, 2026; 72 hours / 24 hours confirmed)
28. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule (re-fetched November 20, 2026; article dated October 15, 2024)
29. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (DFARS rule effective November 10, 2025, three-year phase-in). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes (verified for the sister guide)
30. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services (re-fetched November 20, 2026)
31. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (verified for the sister guide; the Azure page renders client-side and showed no content on November 20, 2026; the same notice AZ576255, published November 2, 2026, retirement October 2029, was re-read on the message-center mirror https://mc.merill.net/message/AZ576255)
32. Critical Manufacturing Sector. CISA. https://www.cisa.gov/critical-manufacturing-sector (re-fetched November 20, 2026; four core industries and DHS as SRMA confirmed; the page does not state the number of sectors)
33. Understanding ISA/IEC 62443: A Guide for OT Security Teams. Dragos blog (competitor page, used for the SERP analysis only; not cited in the article body). https://www.dragos.com/blog/isa-iec-62443-concepts
34. The Essential Guide to the IEC 62443 industrial cybersecurity standards. Industrial Cyber (secondary; source for the "more than 800 pages" figure). https://industrialcyber.co/features/the-essential-guide-to-the-iec-62443-industrial-cybersecurity-standards/
35. U.S. Retrieves Some Of The Colonial Pipeline Ransom. NPR, June 7, 2021 (refers to "last month's shutdown of Colonial Pipeline"). https://www.npr.org/2021/06/07/1004050873/u-s-retrieves-some-of-the-colonial-pipeline-ransom
36. Testimony of Joseph Blount, President and CEO, Colonial Pipeline Company, before the US Senate Committee on Homeland Security and Governmental Affairs, June 8, 2021. https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf (accessed November 20, 2026)
37. Lin, S.: White paper: Comparing ISASecure, IECEE and proprietary ISA/IEC 62443 certification schemes. Automation.com (ISA), May 15, 2026 (white paper created by ISASecure; interested party). https://www.automation.com/article/white-paper-comparing-isasecure-iecee-proprietary-isa/iec-62443-certification-schemes (accessed November 20, 2026)
38. 32 CFR 170.19, CMMC scoping, paragraph (c)(1), Table 3 (Specialized Assets). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/32/170.19 (accessed November 20, 2026)
39. DiMolfetta, D.: CISA updates cyber reporting form as broader incident mandate awaits approval. Nextgov/FCW, November 9, 2026. https://www.nextgov.com/cybersecurity/2026/11/cisa-updates-cyber-reporting-form-broader-incident-mandate-awaits-approval/417130/ (accessed November 20, 2026)
40. § 28 BSIG (BSI Act 2025), paragraph 2 no. 3: important entities with at least 50 employees or annual turnover and balance sheet total each above EUR 10 million. Gesetze im Internet, Federal Ministry of Justice (German). https://www.gesetze-im-internet.de/bsig_2025/__28.html (accessed November 20, 2026)
