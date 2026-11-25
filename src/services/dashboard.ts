import type { Equipment, Loan } from '../types';
import { getAvailability } from './loanRules';

export interface DashboardCounts {
  available: number;
  lent: number;
  outOfService: number;
  total: number;
}

// Compteurs du parc : un équipement tombe dans exactement une catégorie.
// Le switch est exhaustif : ajouter une valeur à Availability casse la compilation.
export function getDashboardCounts(equipments: Equipment[], loans: Loan[]): DashboardCounts {
  const counts: DashboardCounts = { available: 0, lent: 0, outOfService: 0, total: equipments.length };

  for (const equipment of equipments) {
    const availability = getAvailability(equipment, loans);
    switch (availability) {
      case 'Disponible':
        counts.available += 1;
        break;
      case 'Prêté':
        counts.lent += 1;
        break;
      case 'Indisponible':
        counts.outOfService += 1;
        break;
      // Exhaustivité vérifiée à la compilation ; branche inatteignable à l'exécution.
      /* istanbul ignore next */
      default: {
        const unreachable: never = availability;
        return unreachable;
      }
    }
  }

  return counts;
}
