import type { Availability, Equipment, Loan } from '../types';

// Disponibilité calculée, jamais stockée : état, puis prêt en cours
export function getAvailability(eq: Equipment, loans: Loan[]): Availability {
  if (eq.condition === 'Hors service') return 'Indisponible';
  if (loans.some((l) => l.equipmentId === eq.id && !l.returnedAt)) return 'Prêté';
  return 'Disponible';
}
