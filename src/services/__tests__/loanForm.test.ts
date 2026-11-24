import { describe, expect, it } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import { validateLoanForm } from '../loanForm';

const NOW = '2026-11-24';
const validValues = {
  borrowerFirstName: 'Bob',
  borrowerLastName: 'Durand',
  expectedReturnDate: '2026-12-01',
};

describe('validateLoanForm', () => {
  it('should refuse a second loan with the message under the return date', () => {
    const result = validateLoanForm(validValues, makeEquipment(), [makeLoan()], NOW);
    expect(result).toEqual({ ok: false, errors: { expectedReturnDate: 'Cet équipement est déjà prêté.' } });
  });

  it('should accept a valid entry and trim the names', () => {
    const values = { ...validValues, borrowerFirstName: '  Bob ', borrowerLastName: ' Durand  ' };
    expect(validateLoanForm(values, makeEquipment(), [], NOW)).toEqual({
      ok: true,
      input: {
        equipmentId: 'eq-1',
        borrowerFirstName: 'Bob',
        borrowerLastName: 'Durand',
        expectedReturnDate: '2026-12-01',
      },
    });
  });

  it('should report all errors at once', () => {
    const values = { ...validValues, borrowerFirstName: '' };
    const result = validateLoanForm(values, makeEquipment(), [makeLoan()], NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(['borrowerFirstName', 'expectedReturnDate']);
      expect(result.errors.expectedReturnDate).toBe('Cet équipement est déjà prêté.');
    }
  });
});
