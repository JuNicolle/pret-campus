// Écritures d'équipements : fonctions pures qui appliquent les règles et calculent la nouvelle liste.
import type { Equipment, Loan } from '../types';
import { canDeleteEquipment, canSetOutOfService } from './loanRules';

// Saisie d'un équipement : id et createdAt sont générés par le contexte
export type EquipmentInput = Omit<Equipment, 'id' | 'createdAt'>;

export type EquipmentsPlan = { ok: true; equipments: Equipment[] } | { ok: false; message: string };

const NOT_FOUND_MESSAGE = 'Équipement introuvable.';

export function planUpdateEquipment(
  equipments: Equipment[],
  loans: Loan[],
  id: string,
  input: EquipmentInput,
): EquipmentsPlan {
  const current = equipments.find((e) => e.id === id);
  if (!current) {
    return { ok: false, message: NOT_FOUND_MESSAGE };
  }
  // Double sécurité : passage hors service refusé pendant un prêt
  if (input.condition === 'Hors service' && current.condition !== 'Hors service') {
    const rule = canSetOutOfService(current, loans);
    if (!rule.ok) {
      return rule;
    }
  }
  // Les champs éditables sont remplacés : une description effacée (clé absente) est retirée
  const { description: _previous, ...base } = current;
  const updated: Equipment = { ...base, ...input, id: current.id, createdAt: current.createdAt };
  return { ok: true, equipments: equipments.map((e) => (e.id === id ? updated : e)) };
}

export function planDeleteEquipment(equipments: Equipment[], loans: Loan[], id: string): EquipmentsPlan {
  const current = equipments.find((e) => e.id === id);
  if (!current) {
    return { ok: false, message: NOT_FOUND_MESSAGE };
  }
  // Double sécurité : suppression refusée pendant un prêt
  const rule = canDeleteEquipment(current, loans);
  if (!rule.ok) {
    return rule;
  }
  return { ok: true, equipments: equipments.filter((e) => e.id !== id) };
}
