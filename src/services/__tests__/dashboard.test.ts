import { describe, expect, it } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import { getDashboardCounts } from '../dashboard';

describe('getDashboardCounts', () => {
  it('should return zeros for empty lists', () => {
    expect(getDashboardCounts([], [])).toStrictEqual({ available: 0, lent: 0, outOfService: 0, total: 0 });
  });

  it('should count equipments without loan as available', () => {
    const equipments = [makeEquipment({ id: 'a' }), makeEquipment({ id: 'b' })];
    expect(getDashboardCounts(equipments, [])).toStrictEqual({ available: 2, lent: 0, outOfService: 0, total: 2 });
  });

  it('should count an equipment with an active loan as lent', () => {
    const counts = getDashboardCounts([makeEquipment({ id: 'a' })], [makeLoan({ equipmentId: 'a' })]);
    expect(counts).toStrictEqual({ available: 0, lent: 1, outOfService: 0, total: 1 });
  });

  it('should count an equipment whose loan is returned as available', () => {
    const loans = [makeLoan({ equipmentId: 'a', returnedAt: '2026-11-05' })];
    expect(getDashboardCounts([makeEquipment({ id: 'a' })], loans)).toStrictEqual({
      available: 1,
      lent: 0,
      outOfService: 0,
      total: 1,
    });
  });

  it('should count an out-of-service equipment as outOfService', () => {
    const equipments = [makeEquipment({ id: 'a', condition: 'Hors service' })];
    expect(getDashboardCounts(equipments, [])).toStrictEqual({ available: 0, lent: 0, outOfService: 1, total: 1 });
  });

  it('should count an out-of-service equipment with an active loan as outOfService and not as lent', () => {
    const equipments = [makeEquipment({ id: 'a', condition: 'Hors service' })];
    const counts = getDashboardCounts(equipments, [makeLoan({ equipmentId: 'a' })]);
    expect(counts).toStrictEqual({ available: 0, lent: 0, outOfService: 1, total: 1 });
  });

  it('should count an equipment with several returned loans and one active loan once, as lent', () => {
    const loans = [
      makeLoan({ id: 'l1', equipmentId: 'a', returnedAt: '2026-10-05' }),
      makeLoan({ id: 'l2', equipmentId: 'a', returnedAt: '2026-10-20' }),
      makeLoan({ id: 'l3', equipmentId: 'a' }),
    ];
    expect(getDashboardCounts([makeEquipment({ id: 'a' })], loans)).toStrictEqual({
      available: 0,
      lent: 1,
      outOfService: 0,
      total: 1,
    });
  });

  it('should ignore the loans of an equipment missing from the list', () => {
    const counts = getDashboardCounts([makeEquipment({ id: 'a' })], [makeLoan({ equipmentId: 'ghost' })]);
    expect(counts).toStrictEqual({ available: 1, lent: 0, outOfService: 0, total: 1 });
  });

  it('should make available + lent + outOfService equal total on a mixed set of 7 equipments', () => {
    const equipments = [
      makeEquipment({ id: 'e1' }),
      makeEquipment({ id: 'e2', condition: 'Usé' }),
      makeEquipment({ id: 'e3' }),
      makeEquipment({ id: 'e4', condition: 'Hors service' }),
      makeEquipment({ id: 'e5' }),
      makeEquipment({ id: 'e6' }),
      makeEquipment({ id: 'e7', condition: 'Hors service' }),
    ];
    const loans = [
      makeLoan({ id: 'l1', equipmentId: 'e1' }),
      makeLoan({ id: 'l2', equipmentId: 'e4' }),
      makeLoan({ id: 'l3', equipmentId: 'e5', returnedAt: '2026-11-05' }),
    ];
    const counts = getDashboardCounts(equipments, loans);
    expect(counts).toStrictEqual({ available: 4, lent: 1, outOfService: 2, total: 7 });
    expect(counts.available + counts.lent + counts.outOfService).toBe(counts.total);
  });

  it('should not modify its inputs', () => {
    const equipments = [makeEquipment({ id: 'a' }), makeEquipment({ id: 'b', condition: 'Hors service' })];
    const loans = [makeLoan({ equipmentId: 'a' })];
    const equipmentsBefore = JSON.parse(JSON.stringify(equipments));
    const loansBefore = JSON.parse(JSON.stringify(loans));
    getDashboardCounts(equipments, loans);
    expect(equipments).toStrictEqual(equipmentsBefore);
    expect(loans).toStrictEqual(loansBefore);
  });
});
