// Construction des listes de prêts après un prêt ou un retour (fonctions pures, sans stockage)
import type { Equipment, Loan } from '../types';
import { canLend } from './loanRules';

// Saisie d'un prêt : id et startDate sont générés par le contexte
export interface LoanInput {
  equipmentId: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  expectedReturnDate: string; // YYYY-MM-DD
}

export type LoansPlan = { ok: true; loans: Loan[] } | { ok: false; message: string };

const EQUIPMENT_NOT_FOUND_MESSAGE = 'Équipement introuvable.';
const LOAN_NOT_FOUND_MESSAGE = 'Prêt introuvable.';
const ALREADY_RETURNED_MESSAGE = 'Ce prêt est déjà rendu.';

// Nouveau prêt : la règle canLend est la seule source des refus métier
export function planAddLoan(
  equipments: Equipment[],
  loans: Loan[],
  input: LoanInput,
  id: string,
  startDate: string,
): LoansPlan {
  const equipment = equipments.find((e) => e.id === input.equipmentId);
  if (!equipment) {
    return { ok: false, message: EQUIPMENT_NOT_FOUND_MESSAGE };
  }
  const rule = canLend(equipment, loans, input.expectedReturnDate, startDate);
  if (!rule.ok) {
    return rule;
  }
  const created: Loan = {
    id,
    equipmentId: input.equipmentId,
    borrowerFirstName: input.borrowerFirstName,
    borrowerLastName: input.borrowerLastName,
    startDate,
    expectedReturnDate: input.expectedReturnDate,
  };
  return { ok: true, loans: [...loans, created] };
}

// Retour : refusé si le prêt est inconnu ou déjà rendu ; la liste d'origine n'est pas modifiée
export function planReturnLoan(loans: Loan[], loanId: string, returnedAt: string): LoansPlan {
  const current = loans.find((l) => l.id === loanId);
  if (!current) {
    return { ok: false, message: LOAN_NOT_FOUND_MESSAGE };
  }
  if (current.returnedAt) {
    return { ok: false, message: ALREADY_RETURNED_MESSAGE };
  }
  return { ok: true, loans: loans.map((l) => (l.id === loanId ? { ...l, returnedAt } : l)) };
}
