import type { Category, Condition } from '../types';

// Valeurs proposées dans le formulaire d'équipement.
export const CATEGORIES: readonly Category[] = [
  'Ordinateur',
  'Casque',
  'Appareil photo',
  'Tablette',
  'Accessoire',
];
export const CONDITIONS: readonly Condition[] = ['Bon état', 'Usé', 'Hors service'];
