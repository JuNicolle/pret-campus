# Prêt'Campus

Application mobile (React Native / Expo) de gestion de prêts de matériel pour un centre de formation.
Projet d'examen de rattrapage ForEach Académy, réalisé en 4 jours.

> Ce README est complété au fil du projet. Les sections « Installation » et « Fonctionnalités » seront finalisées au jour 4.

## Installation et lancement

```bash
npm install
npx expo start      # puis a (Android), i (iOS) ou scan du QR code avec Expo Go
npx tsc --noEmit    # vérification des types
```

## Fonctionnalités

À renseigner au fil de l'avancement (voir `CLAUDE.MD` §5 à §9 pour le périmètre visé).

## Limites

À renseigner au jour 4.

## Notre façon de travailler : développement agentique

Ce projet est réalisé en binôme entre l'auteur et **Claude Code** (Anthropic), avec des agents spécialisés.
Cette collaboration est assumée et visible dans l'historique Git.

### Répartition des rôles

- **L'auteur** décide, valide et relit. Il reste responsable de chaque ligne et doit pouvoir l'expliquer en soutenance.
- **Claude Code** (orchestrateur) lit le sujet et le `CLAUDE.MD`, découpe le travail, délègue aux agents, vérifie et propose les commits.
- **Des agents spécialisés** interviennent chacun sur un périmètre précis :

| Agent | Rôle sur le projet |
|---|---|
| `react-native-expo-expert` | Initialisation Expo, navigation, stockage AsyncStorage, modules Expo |
| `react-native-component-architect` | Écrans, composants réutilisables, formulaires, hooks |
| `ui-designer` | Lisibilité mobile, badges, zones tactiles, cohérence visuelle |
| `quality-analyst` | Tests des règles de gestion, fiche de tests |
| `code-reviewer` | Revue avant livraison |

### Déroulement

1. Le sujet est traduit en un cahier de conventions (`CLAUDE.MD`) : stack, architecture, modèle de données, règles de gestion, scénarios de test.
2. Le travail suit le planning du sujet, jour par jour. L'auteur valide chaque étape avant la suivante.
3. Les règles de gestion sont écrites en fonctions pures (`src/services/`), donc vérifiables sans interface.
4. Chaque fonctionnalité est contrôlée par le scénario de démonstration correspondant avant d'être déclarée terminée.
5. Les fonctionnalités optionnelles ne commencent qu'une fois les obligatoires testées.

### Garde-fous

- Pas de dépendance ajoutée sans justification défendable à l'oral.
- Code simple et lisible plutôt qu'astucieux.
- Relecture humaine systématique avant commit.

### Traçabilité

Les commits et les pull requests auxquels Claude a contribué le mentionnent explicitement :
- commits : ligne `Co-Authored-By: Claude …` ;
- pull requests : mention « Generated with Claude Code ».
