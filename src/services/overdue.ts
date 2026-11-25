import type { Loan } from '../types';
import { isBefore, today } from '../utils/date';

// Vrai si le prêt n'est pas rendu et que le retour prévu est strictement avant `now`.
// Jour limite : retour prévu = aujourd'hui n'est PAS en retard.
export function isOverdue(loan: Loan, now: string = today()): boolean {
  return !loan.returnedAt && isBefore(loan.expectedReturnDate, now);
}
