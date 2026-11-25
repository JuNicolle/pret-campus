# Prêt'Campus

Application mobile (React Native / Expo) de gestion de prêts de matériel pour un centre de formation.
Projet d'examen de rattrapage ForEach Académy, réalisé seul en 4 jours, avec Claude Code (voir la dernière section).

## Installation et lancement

Prérequis : Node.js récent (version LTS), npm, et l'application **Expo Go** sur un téléphone relié au même réseau que l'ordinateur.

```bash
npm install
npm start           # puis scanner le QR code avec Expo Go
```

Dans le terminal d'Expo : `i` ouvre le simulateur iOS (sous macOS), `a` un émulateur Android.
Les scripts `npm run ios` et `npm run android` font la même chose.

Vérifications :

```bash
npx tsc --noEmit         # types TypeScript
npm test                 # tests unitaires (Jest)
npm run test:coverage    # couverture, seuil global de 80 %
```

Il n'y a ni serveur, ni compte, ni mot de passe : tout est stocké sur l'appareil.

## Fonctionnalités réalisées

Obligatoires :
- Inscription locale (prénom, nom, email) et connexion simulée, sans mot de passe.
- Catalogue des équipements avec recherche par nom et filtre « Disponibles uniquement ».
- Fiche d'un équipement, avec son état et sa disponibilité (Disponible, Prêté, Indisponible).
- Ajout, modification et suppression d'un équipement.
- Enregistrement d'un prêt, puis enregistrement du retour.
- Règles de gestion appliquées deux fois : à l'écran (bouton grisé ou message) et à l'enregistrement, par des fonctions pures testées.
- Données conservées après fermeture de l'application (AsyncStorage) ; les équipements de démonstration ne sont insérés qu'une fois.

Optionnelles :
- Tableau de bord du catalogue : équipements disponibles, prêtés et hors service.
- Prêts en retard : badge « En retard » sur le prêt en cours de la fiche.
- Historique des prêts d'un équipement, sur sa fiche.

Non réalisée : la photo d'un équipement.

## Limites

- Testé avec Expo Go sur iOS uniquement ; Android n'a pas été testé.
- Un prêt en retard n'est signalé que sur la fiche de l'équipement, pas dans le catalogue.
- La fiche de tests `docs/TESTS.md` contient des étapes d'écran encore à confirmer ; seules les règles de gestion sont vérifiées par script et par tests automatisés.
- Les tests automatisés couvrent la logique (fonctions pures), pas l'interface : aucune bibliothèque de test d'interface n'est utilisée.
- Écarts connus entre le comportement attendu et le comportement observé : voir la section « Écarts constatés » de `docs/TESTS.md`.
- La recherche porte sur le nom de l'équipement uniquement.

## Documentation

- [Documentation technique](docs/TECHNIQUE.md) : architecture, modèle de données, choix d'AsyncStorage.
- [Fiche de tests](docs/TESTS.md) : scénarios, résultats attendus et obtenus.

## Notre façon de travailler : développement agentique

Ce projet est réalisé par l'auteur avec **Claude Code** (Anthropic) et des agents spécialisés. La collaboration est assumée et visible dans l'historique Git et dans Jira.
Les commandes `/feature` et `/ticket` ci-dessous sont des commandes Claude Code définies dans le [dépôt d'orchestration de l'auteur](https://github.com/JuNicolle/RAIDE_sub-agents), un dépôt séparé qui n'est pas inclus ici.

### Qui fait quoi

- **L'auteur** décide, valide chaque étape, relit les pull requests de code et les fusionne **à la main**. Il doit pouvoir expliquer chaque ligne.
- **Claude Code** (orchestrateur) lit le sujet et le `CLAUDE.MD`, délègue aux agents, vérifie, ouvre les PR et tient Jira à jour.
- **Les agents** font chacun un travail précis (tableau plus bas). Aucun agent ne fusionne une PR.

### Les tickets : la commande `/ticket`

Les tickets de travail ont été préparés avec `/ticket` avant d'écrire du code :
1. Un agent rédacteur (`ticket-writer`) propose des **brouillons**. Rien n'est créé dans Jira à ce stade.
2. L'auteur ajuste : fusion, découpage (un brouillon trop gros est coupé), réponses aux questions.
3. Les tickets ne sont créés qu'**après l'accord explicite de l'auteur**, brouillon par brouillon.

Un ticket contient : le contexte, le repo concerné, une **taille** (S, M ou L), ses **dépendances** (quel ticket doit être livré avant), des **critères d'acceptation** en Given / When / Then, ce qui est hors périmètre, un **agent suggéré** et le **jour** prévu (label J1 à J4 ; label « optionnelle » pour les fonctionnalités optionnelles).

### Jira pour savoir où on en est

Jira n'était pas demandé par le sujet. Il sert de tableau de bord : quatre statuts, un ticket par PR.

| Statut | Signification | Qui le fait bouger |
|---|---|---|
| À faire | Le ticket existe, rien n'est commencé | création après accord de l'auteur |
| En cours | Un agent travaille dessus | Claude, au démarrage du travail |
| To review | La PR est ouverte, **son lien est mis en commentaire du ticket** | Claude, à l'ouverture de la PR |
| Merged | La PR est fusionnée | après le merge de l'auteur, jamais avant |

Un ticket « Merged » est donc livré ; un ticket « To review » attend la relecture de l'auteur ; un ticket « En cours » est en chantier. Le lien de PR dans chaque ticket permet de retrouver le code, les commentaires et les tests.

### Le développement : la commande `/feature`

Chaque lot de tickets suit quatre phases, avec un arrêt et une validation de l'auteur entre les étapes :
- **Phase 0 : ticket.** Lecture du ticket, questions si le besoin est ambigu, contrôle des dépendances (ticket et PR précédents mergés) et des fichiers en conflit.
- **Phase 1 : cadrage.** `spec.md` (le besoin, les critères, le hors périmètre) et `plan.md` (architecture, décisions, risques, écrit par `tech-lead`). L'auteur valide.
- **Phase 2 : tâches.** `tasks.md` : une tâche par ticket avec son agent, ses fichiers exclusifs, son livrable et sa commande de vérification. Deux tâches parallèles ne touchent jamais le même fichier. L'auteur valide.
- **Phase 3 : réalisation.** Chaque agent travaille dans son **worktree Git isolé**, sur une branche issue de `main` ; les tâches indépendantes tournent en parallèle. Le code est suivi de tests, puis d'une **vérification indépendante** par une autre instance, qui introduit volontairement des défauts (mutations) : chaque défaut doit faire échouer un test. Une revue de code est faite **en local** (rapport remis à l'auteur, rien posté).

En fin de lot, chaque agent rapporte ses « Difficultés » : le **retour d'expérience** sert à corriger les consignes des agents.
Les fichiers `spec.md`, `plan.md` et `tasks.md` de chaque lot sont conservés par l'auteur ; la preuve publique reste le code, les PR et Jira.

### Les agents

| Agent | Rôle sur le projet |
|---|---|
| `tech-lead` | Cadrage et plan technique de chaque lot |
| `react-native-expo-expert` | Initialisation Expo, navigation, stockage, contextes, règles de gestion |
| `react-native-component-architect` | Écrans, composants, formulaires, optionnelles |
| `ui-designer` | Passe de lisibilité mobile |
| `quality-analyst` | Tests Jest, fiche de tests, vérification indépendante par mutations |
| `bug-analyst` | Vérification croisée des scénarios de démonstration |
| `code-reviewer` | Revue de code locale |

Les agents `react-native-expo-expert` et `react-native-component-architect` ont été ajoutés spécialement pour ce projet ; selon l'auteur, ils sont issus de la collection Awesome Claude Agents.

### La relecture des PR : l'auteur garde la main

- **Chaque PR de code est lue et validée par l'auteur.** Les PR de tests et de documentation ne passent pas par ce cycle de relecture détaillée.
- Sur GitHub, l'auteur **laisse des commentaires** sur le code qu'il ne comprend pas ou avec lequel il n'est pas d'accord ; **l'IA répond directement dans le fil** (explication, ou correction poussée dans un nouveau commit). L'auteur peut aussi refuser une proposition et garder sa version.
- Les **merges sont faits à la main par l'auteur**. Aucun agent ne fusionne, ne poste de revue ni d'approbation.

### Garde-fous et traçabilité

- Pas de dépendance ajoutée sans justification (exception actée : Jest, pour les tests).
- Code simple et lisible plutôt qu'astucieux.
- Les commits et PR où Claude a contribué le mentionnent : ligne `Co-Authored-By: Claude …` et mention « Generated with Claude Code ».
