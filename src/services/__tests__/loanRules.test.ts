import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import { canDeleteEquipment, canLend, canSetOutOfService, getAvailability } from '../loanRules';

afterEach(() => {
  jest.useRealTimers();
});

const ALREADY_LENT = 'Cet équipement est déjà prêté.';
const OUT_OF_SERVICE = 'Un équipement hors service ne peut pas être prêté.';
const PAST_DATE = "La date de retour prévue ne peut pas être antérieure à aujourd'hui.";

describe('getAvailability', () => {
  it('should be Disponible without loan', () => {
    expect(getAvailability(makeEquipment(), [])).toBe('Disponible');
  });

  it('should be Prêté with an active loan', () => {
    expect(getAvailability(makeEquipment(), [makeLoan()])).toBe('Prêté');
  });

  it('should be Disponible when the loan is returned', () => {
    expect(getAvailability(makeEquipment(), [makeLoan({ returnedAt: '2026-11-05' })])).toBe('Disponible');
  });

  it('should ignore the active loan of another equipment', () => {
    expect(getAvailability(makeEquipment(), [makeLoan({ equipmentId: 'eq-2' })])).toBe('Disponible');
  });

  it('should be Indisponible when out of service', () => {
    expect(getAvailability(makeEquipment({ condition: 'Hors service' }), [])).toBe('Indisponible');
  });

  it('should prefer Indisponible over an active loan', () => {
    expect(getAvailability(makeEquipment({ condition: 'Hors service' }), [makeLoan()])).toBe('Indisponible');
  });
});

describe('canLend', () => {
  const eq = makeEquipment();

  it('should accept a return date equal to today', () => {
    expect(canLend(eq, [], '2026-11-24', '2026-11-24')).toEqual({ ok: true });
  });

  it('should accept a future return date', () => {
    expect(canLend(eq, [], '2026-12-01', '2026-11-24')).toEqual({ ok: true });
  });

  it('should refuse a return date the day before', () => {
    expect(canLend(eq, [], '2026-11-23', '2026-11-24')).toEqual({ ok: false, message: PAST_DATE });
  });

  it('should refuse the last day of the previous month', () => {
    expect(canLend(eq, [], '2026-10-31', '2026-11-01')).toEqual({ ok: false, message: PAST_DATE });
  });

  it('should refuse the last day of the previous year', () => {
    expect(canLend(eq, [], '2025-12-31', '2026-01-01')).toEqual({ ok: false, message: PAST_DATE });
  });

  it('should refuse when the equipment is already lent', () => {
    expect(canLend(eq, [makeLoan()], '2026-12-01', '2026-11-24')).toEqual({ ok: false, message: ALREADY_LENT });
  });

  it('should refuse when the equipment is out of service', () => {
    const result = canLend(makeEquipment({ condition: 'Hors service' }), [], '2026-12-01', '2026-11-24');
    expect(result).toEqual({ ok: false, message: OUT_OF_SERVICE });
  });

  it('should not be blocked by a returned loan', () => {
    const loans = [makeLoan({ returnedAt: '2026-11-05' })];
    expect(canLend(eq, loans, '2026-12-01', '2026-11-24')).toEqual({ ok: true });
  });

  it('should not be blocked by the loan of another equipment', () => {
    const loans = [makeLoan({ equipmentId: 'eq-2' })];
    expect(canLend(eq, loans, '2026-12-01', '2026-11-24')).toEqual({ ok: true });
  });

  it('should report already lent before out of service', () => {
    const result = canLend(makeEquipment({ condition: 'Hors service' }), [makeLoan()], '2026-12-01', '2026-11-24');
    expect(result).toEqual({ ok: false, message: ALREADY_LENT });
  });

  it('should report already lent before a past date', () => {
    const result = canLend(eq, [makeLoan({ equipmentId: eq.id })], '2020-01-01', '2026-11-24');
    expect(result).toEqual({ ok: false, message: ALREADY_LENT });
  });

  it('should report out of service before a past date', () => {
    const result = canLend(makeEquipment({ condition: 'Hors service' }), [], '2020-01-01', '2026-11-24');
    expect(result).toEqual({ ok: false, message: OUT_OF_SERVICE });
  });

  it('should use the simulated clock when now is omitted', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 24, 23, 59));
    expect(canLend(eq, [], '2026-11-24')).toEqual({ ok: true });
    expect(canLend(eq, [], '2026-11-23')).toEqual({ ok: false, message: PAST_DATE });
  });
});

describe('canDeleteEquipment', () => {
  it('should refuse when a loan is active', () => {
    expect(canDeleteEquipment(makeEquipment(), [makeLoan()])).toEqual({
      ok: false,
      message: 'Impossible de supprimer un équipement en cours de prêt.',
    });
  });

  it('should accept without loan', () => {
    expect(canDeleteEquipment(makeEquipment(), [])).toEqual({ ok: true });
  });

  it('should accept when the loan is returned', () => {
    expect(canDeleteEquipment(makeEquipment(), [makeLoan({ returnedAt: '2026-11-05' })])).toEqual({ ok: true });
  });
});

describe('canSetOutOfService', () => {
  it('should refuse when a loan is active', () => {
    expect(canSetOutOfService(makeEquipment(), [makeLoan()])).toEqual({
      ok: false,
      message: "Enregistrez le retour avant de passer l'équipement hors service.",
    });
  });

  it('should accept without loan', () => {
    expect(canSetOutOfService(makeEquipment(), [])).toEqual({ ok: true });
  });

  it('should accept when the loan is returned', () => {
    expect(canSetOutOfService(makeEquipment(), [makeLoan({ returnedAt: '2026-11-05' })])).toEqual({ ok: true });
  });
});
