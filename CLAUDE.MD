# CLAUDE.md — Prêt'Campus

Application mobile React Native (Expo) de gestion de prêts de matériel pour un centre de formation.
Examen de rattrapage ForEach Académy — **travail individuel, 4 jours**, soutenance orale de 10 min.

> Langue : tout le code (noms de variables, fonctions) en anglais ; **tous les textes affichés, commentaires et docs en français**.

---

## 1. Rôle de Claude sur ce projet

- C'est un **examen individuel** : l'auteur doit pouvoir expliquer chaque ligne en soutenance.
  → Privilégier un code simple et lisible plutôt qu'astucieux. Expliquer brièvement chaque choix non évident.
- **Priorité absolue : les fonctionnalités obligatoires et les règles de gestion** (8 pts). Les optionnelles (3 pts) ne compensent rien.
  → Ne jamais proposer d'optionnelle tant qu'une obligatoire n'est pas terminée et testée.
- Pas de backend, pas d'API externe, pas de mot de passe. Ne pas en ajouter.
- Pas de dépendance superflue : chaque lib ajoutée doit être justifiable à l'oral.
  → Exception actée (ticket PC-41) : Jest (`jest`, `jest-expo`) en `devDependencies`, pour les tests unitaires des fonctions pures. Pas d'autre runner de test, ni de lib de test d'interface.

---

## 2. Stack

| Élément | Choix |
|---|---|
| Framework | Expo (managed workflow), React Native |
| Langage | TypeScript (strict) |
| Navigation | React Navigation (`@react-navigation/native-stack`) |
| Persistance | `@react-native-async-storage/async-storage` |
| Identifiants | `expo-crypto` → `Crypto.randomUUID()` |
| Dates | Objets `Date` natifs + chaînes ISO `YYYY-MM-DD` (pas de lib de dates) |
| Sélecteur de date | `@react-native-community/datetimepicker` |
| État global | React Context (`AuthContext`, `DataContext`) — pas de Redux |
| Tests unitaires | Jest via `jest-expo` (`devDependencies`) |

Commandes :
```bash
npm install
npx expo start          # puis a (Android) / i (iOS) / scan QR avec Expo Go
npx tsc --noEmit        # vérification des types
npm test                # tests unitaires (Jest)
npm run test:coverage   # couverture, seuil global 80 %
```

Après un `git pull` qui ajoute des dépendances, relancer `npm install`.

---

## 3. Architecture (séparation imposée par le sujet)

```
src/
├── screens/        # Un fichier par écran, logique d'affichage uniquement
│   ├── AuthScreen.tsx            # Inscription / connexion simulée
│   ├── CatalogScreen.tsx         # Liste + recherche + filtre "disponibles"
│   ├── EquipmentDetailScreen.tsx # Fiche + prêt en cours + actions
│   ├── EquipmentFormScreen.tsx   # Ajout / modification
│   └── LoanFormScreen.tsx        # Enregistrement d'un prêt
├── components/     # Composants réutilisables (EquipmentCard, StatusBadge, FormField, EmptyState, PrimaryButton…)
├── navigation/     # AppNavigator.tsx (stack Auth vs stack App selon l'utilisateur connecté)
├── context/        # AuthContext, DataContext
├── storage/        # SEUL endroit qui touche AsyncStorage
│   ├── keys.ts
│   ├── userStorage.ts
│   ├── equipmentStorage.ts
│   └── loanStorage.ts
├── services/       # Règles de gestion pures (testables, sans UI ni stockage)
│   ├── loanRules.ts
│   ├── validation.ts
│   └── __tests__/  # Tests unitaires, à côté du code testé
├── data/seed.ts    # ≥ 6 équipements de démo, ≥ 3 catégories
├── types/index.ts
├── utils/
│   ├── date.ts     # today(), isBefore(), formatFr()
│   └── __tests__/  # Tests unitaires de utils/
└── __tests__/fixtures.ts  # Fabriques de données de test partagées
```

À la racine : `jest.config.js` (configuration de Jest, périmètre de couverture, seuil de 80 %).

Règles :
- Les écrans n'appellent **jamais** AsyncStorage directement : ils passent par le Context, qui appelle `storage/`.
- Toute règle métier (peut-on prêter ? supprimer ? passer hors service ?) vit dans `services/` sous forme de fonction pure renvoyant `{ ok: true } | { ok: false, message: string }`.
- Un fichier = une responsabilité. Composants < ~150 lignes.

---

## 4. Modèle de données

```ts
type Category = 'Ordinateur' | 'Casque' | 'Appareil photo' | 'Tablette' | 'Accessoire';
type Condition = 'Bon état' | 'Usé' | 'Hors service';
type Availability = 'Disponible' | 'Prêté' | 'Indisponible';

interface User {            // profil local unique, aucun mot de passe
  firstName: string;
  lastName: string;
  email: string;
}

interface Equipment {
  id: string;               // UUID généré par l'app
  name: string;             // obligatoire
  category: Category;       // liste prédéfinie
  description?: string;     // facultatif
  condition: Condition;
  createdAt: string;        // ISO
}

interface Loan {
  id: string;
  equipmentId: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  startDate: string;        // YYYY-MM-DD, = date du jour, automatique
  expectedReturnDate: string; // YYYY-MM-DD, >= startDate
  returnedAt?: string;      // absent = prêt en cours
}
```

**La disponibilité n'est PAS stockée, elle est calculée** (évite toute incohérence après relance) :
```ts
function getAvailability(eq: Equipment, loans: Loan[]): Availability {
  if (eq.condition === 'Hors service') return 'Indisponible';
  if (loans.some(l => l.equipmentId === eq.id && !l.returnedAt)) return 'Prêté';
  return 'Disponible';
}
```

Clés AsyncStorage (`storage/keys.ts`) :
- `@pretcampus/user` — profil enregistré
- `@pretcampus/session` — utilisateur connecté (ou absent)
- `@pretcampus/equipments`
- `@pretcampus/loans`
- `@pretcampus/seeded` — drapeau : les données de démo ne sont insérées **qu'une seule fois**

---

## 5. Règles de gestion (à implémenter dans `services/loanRules.ts`)

| Situation | Comportement | Message affiché |
|---|---|---|
| Équipement déjà prêté | Prêt refusé | « Cet équipement est déjà prêté. » |
| Équipement hors service | Prêt refusé | « Un équipement hors service ne peut pas être prêté. » |
| Date de retour < aujourd'hui | Enregistrement refusé | « La date de retour prévue ne peut pas être antérieure à aujourd'hui. » |
| Prêt en cours → suppression | Interdite | « Impossible de supprimer un équipement en cours de prêt. » |
| Prêt en cours → passage « Hors service » | Bloqué | « Enregistrez le retour avant de passer l'équipement hors service. » |
| Suppression autorisée | `Alert.alert` de confirmation | « Supprimer « {nom} » ? Cette action est définitive. » |
| Champ obligatoire vide | Enregistrement bloqué, erreur sous le champ | « Le nom est obligatoire. » etc. |

Autres points :
- Retour enregistré → `returnedAt = today()`. L'équipement redevient disponible **sauf** s'il est hors service (géré automatiquement par `getAvailability`).
- Les boutons d'actions interdites peuvent être désactivés, mais la règle doit **aussi** être vérifiée au moment de l'enregistrement (double sécurité).
- Comparer les dates sur `YYYY-MM-DD` (pas d'heure) pour éviter les bugs de fuseau horaire.
- Email : validation de format simple (regex basique).

---

## 6. Écrans et parcours

1. **AuthScreen** : inscription (prénom, nom, email) si aucun profil, sinon « Se connecter en tant que … ». Pas de mot de passe.
2. **CatalogScreen** : en-tête « Bonjour {prénom} » + bouton déconnexion ; barre de recherche par nom (insensible à la casse/accents) ; switch « Disponibles uniquement » ; `FlatList` d'`EquipmentCard` (nom, catégorie, badge état, badge disponibilité) ; message « Aucun équipement ne correspond à votre recherche. » si vide ; bouton « + Ajouter ».
3. **EquipmentDetailScreen** : infos complètes ; si prêté : emprunteur, date de début, retour prévu + bouton « Enregistrer le retour » ; sinon « Prêter » (si disponible) ; « Modifier », « Supprimer ».
4. **EquipmentFormScreen** : nom*, catégorie* (sélecteur), description, état* — mode ajout / modification.
5. **LoanFormScreen** : prénom* et nom* de l'emprunteur, date de début affichée (non modifiable), date de retour prévue*.

UI : lisible sur smartphone, `SafeAreaView`, `KeyboardAvoidingView` sur les formulaires, zones tactiles ≥ 44 px, couleurs de badges cohérentes (vert disponible / orange prêté / gris-rouge indisponible).

---

## 7. Données de démo (`data/seed.ts`)

Au moins 6 équipements, ≥ 3 catégories, avec au moins un « Usé » et un « Hors service » pour pouvoir démontrer les règles. Insérés uniquement si le drapeau `@pretcampus/seeded` est absent.

---

## 8. Optionnelles (seulement après validation complète du §5 et des scénarios §9)

Ordre conseillé (rapport valeur / effort) :
1. Tableau de bord (disponibles / prêtés / hors service) — simple calcul sur `getAvailability`.
2. Prêts en retard mis en évidence (`!returnedAt && expectedReturnDate < today()`).
3. Historique des prêts d'un équipement (déjà disponible via `loans` filtrés).
4. Photo via `expo-image-picker` (stocker l'URI ; mentionner la limite en README).

---

## 9. Scénarios de démonstration (= fiche de tests)

Avant de déclarer une fonctionnalité terminée, vérifier le scénario correspondant :

1. Ajouter un équipement, puis modifier sa description.
2. Enregistrer un prêt sur cet équipement.
3. Vérifier qu'un second prêt et la suppression sont bloqués.
4. Enregistrer le retour → l'équipement est à nouveau disponible.
5. Un équipement hors service ne peut pas être prêté.
6. Fermer complètement puis relancer l'app → données conservées, démo non dupliquée.
7. Recherche par nom + filtre « disponibles », y compris cas « aucun résultat ».

Ajouter aussi : date de retour passée refusée ; passage hors service bloqué pendant un prêt ; champs obligatoires vides.

Les règles pures du §5 sont couvertes par des tests automatisés (messages exacts et cas limites) ; les scénarios d'interface restent à vérifier manuellement.

---

## 10. Livrables (à préparer jour 4)

- Code source **sans `node_modules`** (vérifier `.gitignore`).
- `README.md` : installation, lancement, fonctionnalités réalisées, limites.
- `docs/TECHNIQUE.md` : **10 à 20 lignes** — architecture, modèle de données, choix d'AsyncStorage (simplicité, volume faible, données JSON, pas de relations complexes).
- `docs/TESTS.md` : tableau Scénario / Étapes / Résultat attendu / Résultat obtenu.

---

## 11. Planning

| Jour | Objectif |
|---|---|
| J1 | Init Expo + TS, types, navigation, auth locale, seed, catalogue |
| J2 | CRUD équipements, validations, persistance |
| J3 | Prêts / retours, règles de gestion, recherche + filtre |
| J4 | Tests des 7 scénarios, corrections, UI, livrables, préparation soutenance |

---

## 12. Conventions

- Composants fonctionnels + hooks, `export default` pour les écrans, exports nommés ailleurs.
- Pas de `any`. Types centralisés dans `src/types`.
- Toutes les fonctions de stockage sont `async` et entourées de `try/catch` avec message utilisateur compréhensible (« Impossible d'enregistrer les données. Réessayez. »).
- Pas de logique métier dans le JSX.
- Commits petits et explicites, en français (`feat: enregistrement d'un prêt`).
- **Attribution (exception au hub)** : sur CE projet, Claude apparaît volontairement. Chaque commit se termine par la ligne `Co-Authored-By: Claude …` et chaque description de PR par « Generated with Claude Code ». Cela vaut aussi pour les sous-agents : le leur rappeler dans leur prompt, car leurs conventions par défaut l'interdisent. La règle « aucune trace de Claude » du `CLAUDE.md` du hub ne s'applique pas ici.
- Le `README.md` documente la façon de travailler agentique (section dédiée) : la tenir à jour.

## 13. Jira et workflow de PR

- **Projet Jira** : clé `PC`, site `juliennicolle.atlassian.net` (cloudId `c1595e60-2b96-4248-9235-451f4f6b3d5a`), projet team-managed en Kanban. Types utilisés : Epic, Story, Tâche. Le jour prévu est porté par un label (`J1` à `J4`) ; les optionnelles ont le label `optionnelle`.
- **Statuts** : `À faire` → `En cours` → `To review` → `Merged`. Identifiants de transition : `11` À faire, `21` En cours, `31` To review, `41` Merged.
- **Tickets** : PC-1 à PC-10 sont les epics, PC-11 à PC-57 les tickets de travail. Le détail (critères d'acceptation, agent suggéré, dépendances) est dans chaque ticket.
- Branches : `feature/PC-<n>-<description>` ou `fix/PC-<n>-<description>` (la clé du ticket dans le nom).
- Début du travail sur un ticket : le passer en `In Progress`.
- **PR créée** : passer le ticket en `To review` **et** ajouter le lien de la PR dans le ticket (commentaire Jira). Ces deux actions sont obligatoires, à chaque PR.
- **Aucun merge sans accord explicite de l'auteur.** Ni Claude ni les sous-agents ne mergent une PR, même approuvée ou sans conflit. Le passage en `Merged` n'a lieu qu'après le merge, décidé par l'auteur.
- À rappeler dans le prompt de chaque sous-agent qui ouvre des PR.
- **Une PR par ticket, sans regroupement** (47 PR). Branche depuis `main`, le titre de la PR cite la clé (`PC-<n>`).
- **Relecture et merge réservés à l'auteur** : lui seul relit et merge les PR. Aucun agent ne poste de revue ni de commentaire d'approbation sur une PR, et personne d'autre que lui ne merge. Les tickets passent en `Merged` seulement après son merge.
- **Commentaires Jira** (lien de PR) et transitions : faits par la session principale, car `ticket-writer` n'a pas l'outil de commentaire.
