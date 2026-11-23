import { getAvailability } from '../services/loanRules';
import type { Equipment, Loan } from '../types';

export interface EquipmentFilter {
  query: string;
  onlyAvailable: boolean;
}

// Minuscules, sans accents ni espaces de bord : "  Écran " devient "ecran".
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Filtre par nom (requête vide = tout) puis, si demandé, par disponibilité.
// Renvoie un nouveau tableau, ordre conservé, sans modifier les entrées.
export function filterEquipments(
  equipments: Equipment[],
  loans: Loan[],
  filter: EquipmentFilter,
): Equipment[] {
  const query = normalizeText(filter.query);
  return equipments.filter((equipment) => {
    if (!normalizeText(equipment.name).includes(query)) {
      return false;
    }
    return !filter.onlyAvailable || getAvailability(equipment, loans) === 'Disponible';
  });
}
