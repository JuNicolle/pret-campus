import type { Loan } from '../types';

// Prêts d'un équipement (en cours et rendus), du plus récent au plus ancien.
// Départage d'un même startDate : le prêt ajouté en dernier passe en premier
// (planAddLoan ajoute en fin de liste, Loan n'a pas d'horodatage plus fin).
export function getLoanHistory(equipmentId: string, loans: Loan[]): Loan[] {
  return loans
    .map((loan, index) => ({ loan, index }))
    .filter(({ loan }) => loan.equipmentId === equipmentId)
    .sort((a, b) => {
      if (a.loan.startDate !== b.loan.startDate) {
        return a.loan.startDate < b.loan.startDate ? 1 : -1;
      }
      return b.index - a.index;
    })
    .map(({ loan }) => loan);
}
