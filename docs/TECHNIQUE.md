# Documentation technique — Prêt'Campus

## Architecture en couches
- Affichage : `src/screens` (un fichier par écran), `src/components` (éléments réutilisables, dont le tableau de bord, le retard et l'historique des prêts) et `src/navigation` (pile connectée ou non).
- Données : `AuthContext` et `DataContext` (`src/context`) partagent l'état et sont les seuls à appeler `src/storage`, le seul endroit qui touche AsyncStorage ; `src/data` fournit les données de démonstration.
- Logique : `src/services` contient les règles de gestion en fonctions pures (`loanRules`, `overdue`, `dashboard`, `loanHistory`), avec `src/utils` (dates, recherche) et `src/types` ; chaque couche a un seul rôle, donc on teste et on modifie sans casser le reste.

## Modèle de données
- Trois types dans `src/types` : `Equipment` (nom, catégorie, description facultative, état), `Loan` (équipement, emprunteur, dates de début et de retour prévu, `returnedAt` absent tant que le prêt est en cours) et `User` (prénom, nom, email).
- La disponibilité n'est pas stockée : `getAvailability` la calcule à partir de l'équipement et des prêts, ce qui évite deux informations qui se contredisent.
- Les dates sont des chaînes `YYYY-MM-DD` en heure locale, comparables directement et sans problème de fuseau horaire.

## Choix d'AsyncStorage
- Simple et déjà intégré à Expo : stockage clé-valeur sans serveur ni configuration, adapté à un petit volume de données (deux listes d'équipements et de prêts).
- Les données sont du JSON et un prêt référence son équipement par `equipmentId` : pas de relations complexes, la liaison se fait en mémoire.

## Tests et sécurité
- Les règles de gestion pures sont testées par Jest ; chaque règle est vérifiée deux fois (double sécurité) : dans l'interface (bouton désactivé ou message d'erreur), puis à l'enregistrement dans `loanWrites` (prêts) et `equipmentWrites` (suppression, passage hors service).
