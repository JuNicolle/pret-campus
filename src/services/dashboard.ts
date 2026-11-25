import type { Equipment, Loan } from '../types';
import { getAvailability } from './loanRules';

export interface DashboardCounts {
  available: number;
  lent: number;
  outOfService: number;
  total: number;
}

// Compteurs du parc : un équipement tombe dans exactement une catégorie.
export function getDashboardCounts(equipments: Equipment[], loans: Loan[]): DashboardCounts {
  const counts: DashboardCounts = { available: 0, lent: 0, outOfService: 0, total: equipments.length };

  for (const equipment of equipments) {
    const availability = getAvailability(equipment, loans);
    if (availability === 'Disponible') counts.available += 1;
    else if (availability === 'Prêté') counts.lent += 1;
    else counts.outOfService += 1;
  }

  return counts;
}
