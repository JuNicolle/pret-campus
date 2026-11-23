import * as Crypto from 'expo-crypto';
import type { Equipment } from '../types';

// Données de démonstration : un nouvel UUID est généré à chaque appel
export function createSeedEquipments(): Equipment[] {
  const createdAt = new Date().toISOString();

  return [
    {
      id: Crypto.randomUUID(),
      name: 'Portable 14 pouces',
      category: 'Ordinateur',
      description: 'Ordinateur portable pour les travaux en salle',
      condition: 'Bon état',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Portable 15 pouces',
      category: 'Ordinateur',
      description: 'Batterie fatiguée, charnière un peu lâche',
      condition: 'Usé',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Casque audio',
      category: 'Casque',
      description: 'Casque fermé avec câble jack',
      condition: 'Bon état',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Casque de réalité virtuelle',
      category: 'Casque',
      condition: 'Hors service',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Appareil photo reflex',
      category: 'Appareil photo',
      description: 'Livré avec objectif standard et carte mémoire',
      condition: 'Bon état',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Tablette 10 pouces',
      category: 'Tablette',
      condition: 'Bon état',
      createdAt,
    },
    {
      id: Crypto.randomUUID(),
      name: 'Tablette graphique',
      category: 'Tablette',
      description: 'Stylet inclus',
      condition: 'Bon état',
      createdAt,
    },
  ];
}
