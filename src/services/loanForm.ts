// Validation du formulaire de prêt : fonction pure, sans UI ni stockage.
import type { Equipment, Loan } from '../types';
import { canLend } from './loanRules';
import type { LoanInput } from './loanWrites';
import { validateFirstName, validateLastName } from './validation';

export interface LoanFormValues {
  borrowerFirstName: string;
  borrowerLastName: string;
  expectedReturnDate: string; // YYYY-MM-DD
}

export interface LoanFormErrors {
  borrowerFirstName?: string;
  borrowerLastName?: string;
  expectedReturnDate?: string;
}

export type LoanFormResult = { ok: true; input: LoanInput } | { ok: false; errors: LoanFormErrors };

// Toutes les erreurs sont renvoyées d'un coup ; canLend est toujours évalué
// et son message s'affiche sous le champ de date.
export function validateLoanForm(
  values: LoanFormValues,
  equipment: Equipment,
  loans: Loan[],
  now?: string,
): LoanFormResult {
  const errors: LoanFormErrors = {};

  const firstName = validateFirstName(values.borrowerFirstName);
  if (!firstName.ok) errors.borrowerFirstName = firstName.message;

  const lastName = validateLastName(values.borrowerLastName);
  if (!lastName.ok) errors.borrowerLastName = lastName.message;

  const rule = canLend(equipment, loans, values.expectedReturnDate, now);
  if (!rule.ok) errors.expectedReturnDate = rule.message;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    input: {
      equipmentId: equipment.id,
      borrowerFirstName: values.borrowerFirstName.trim(),
      borrowerLastName: values.borrowerLastName.trim(),
      expectedReturnDate: values.expectedReturnDate,
    },
  };
}
