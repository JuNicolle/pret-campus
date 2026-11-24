import { describe, expect, it } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import { planAddLoan, planReturnLoan, type LoanInput } from '../loanWrites';

const input: LoanInput = {
  equipmentId: 'eq-1',
  borrowerFirstName: 'Bob',
  borrowerLastName: 'Durand',
  expectedReturnDate: '2026-12-01',
};

describe('planAddLoan', () => {
  it('should append the new loan with the given id and start date', () => {
    const existing = makeLoan({ id: 'loan-0', equipmentId: 'eq-2' });
    const result = planAddLoan([makeEquipment(), makeEquipment({ id: 'eq-2' })], [existing], input, 'loan-9', '2026-11-24');
    expect(result).toEqual({
      ok: true,
      loans: [
        existing,
        {
          id: 'loan-9',
          equipmentId: 'eq-1',
          borrowerFirstName: 'Bob',
          borrowerLastName: 'Durand',
          startDate: '2026-11-24',
          expectedReturnDate: '2026-12-01',
        },
      ],
    });
  });

  it('should not modify the input lists', () => {
    const equipments = [makeEquipment()];
    const loans = [makeLoan({ equipmentId: 'eq-2' })];
    planAddLoan(equipments, loans, input, 'loan-9', '2026-11-24');
    expect(equipments).toHaveLength(1);
    expect(loans).toEqual([makeLoan({ equipmentId: 'eq-2' })]);
  });

  it('should refuse an unknown equipment', () => {
    expect(planAddLoan([], [], input, 'loan-9', '2026-11-24')).toEqual({
      ok: false,
      message: 'Équipement introuvable.',
    });
  });

  it('should relay the refusal when the equipment is already lent', () => {
    expect(planAddLoan([makeEquipment()], [makeLoan()], input, 'loan-9', '2026-11-24')).toEqual({
      ok: false,
      message: 'Cet équipement est déjà prêté.',
    });
  });

  it('should relay the refusal when the equipment is out of service', () => {
    const result = planAddLoan([makeEquipment({ condition: 'Hors service' })], [], input, 'loan-9', '2026-11-24');
    expect(result).toEqual({ ok: false, message: 'Un équipement hors service ne peut pas être prêté.' });
  });

  it('should relay the refusal when the return date is before the start date', () => {
    const result = planAddLoan([makeEquipment()], [], { ...input, expectedReturnDate: '2026-11-23' }, 'loan-9', '2026-11-24');
    expect(result).toEqual({
      ok: false,
      message: "La date de retour prévue ne peut pas être antérieure à aujourd'hui.",
    });
  });
});

describe('planReturnLoan', () => {
  it('should set returnedAt and keep the other loans untouched', () => {
    const other = makeLoan({ id: 'loan-2', equipmentId: 'eq-2' });
    const result = planReturnLoan([makeLoan(), other], 'loan-1', '2026-11-24');
    expect(result).toEqual({ ok: true, loans: [makeLoan({ returnedAt: '2026-11-24' }), other] });
  });

  it('should not modify the original list', () => {
    const loans = [makeLoan()];
    planReturnLoan(loans, 'loan-1', '2026-11-24');
    expect(loans[0].returnedAt).toBeUndefined();
  });

  it('should refuse an unknown loan', () => {
    expect(planReturnLoan([makeLoan()], 'nope', '2026-11-24')).toEqual({ ok: false, message: 'Prêt introuvable.' });
  });

  it('should refuse a loan already returned', () => {
    const loans = [makeLoan({ returnedAt: '2026-11-05' })];
    expect(planReturnLoan(loans, 'loan-1', '2026-11-24')).toEqual({ ok: false, message: 'Ce prêt est déjà rendu.' });
  });
});
