import type { Availability, Equipment, Loan } from '../types';

// Disponibilité calculée, jamais stockée : état, puis prêt en cours
export function getAvailability(eq: Equipment, loans: Loan[]): Availability {
  if (eq.condition === 'Hors service') return 'Indisponible';
  if (loans.some((l) => l.equipmentId === eq.id && !l.returnedAt)) return 'Prêté';
  return 'Disponible';
}

// Résultat d'une règle de gestion : autorisé, ou refusé avec un message pour l'écran
export type RuleResult = { ok: true } | { ok: false; message: string };

// Vrai si l'équipement a un prêt non rendu
function hasActiveLoan(eq: Equipment, loans: Loan[]): boolean {
  return loans.some((l) => l.equipmentId === eq.id && !l.returnedAt);
}

// Suppression interdite tant qu'un prêt est en cours
export function canDeleteEquipment(eq: Equipment, loans: Loan[]): RuleResult {
  if (hasActiveLoan(eq, loans)) {
    return { ok: false, message: 'Impossible de supprimer un équipement en cours de prêt.' };
  }
  return { ok: true };
}

// Passage hors service interdit tant qu'un prêt est en cours
export function canSetOutOfService(eq: Equipment, loans: Loan[]): RuleResult {
  if (hasActiveLoan(eq, loans)) {
    return { ok: false, message: 'Enregistrez le retour avant de passer l\'équipement hors service.' };
  }
  return { ok: true };
}
