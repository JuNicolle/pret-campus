import { describe, expect, it } from '@jest/globals';
import { makeLoan } from '../../__tests__/fixtures';
import { getLoanHistory } from '../loanHistory';

const ids = (loans: { id: string }[]) => loans.map((l) => l.id);

describe('getLoanHistory', () => {
  it('should return an empty array for an empty list', () => {
    expect(getLoanHistory('eq-1', [])).toEqual([]);
  });

  it('should return an empty array when no loan matches the equipment', () => {
    expect(getLoanHistory('eq-1', [makeLoan({ id: 'a', equipmentId: 'eq-2' })])).toEqual([]);
  });

  it('should ignore the loans of other equipments', () => {
    const loans = [
      makeLoan({ id: 'a', equipmentId: 'eq-1' }),
      makeLoan({ id: 'b', equipmentId: 'eq-2' }),
      makeLoan({ id: 'c', equipmentId: 'eq-1', startDate: '2026-11-02' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['c', 'a']);
  });

  it('should return the only loan of the equipment', () => {
    const loan = makeLoan({ id: 'a' });
    expect(getLoanHistory('eq-1', [loan])).toEqual([loan]);
  });

  it('should sort by startDate descending when the input is ascending', () => {
    const loans = [
      makeLoan({ id: 'a', startDate: '2026-11-01' }),
      makeLoan({ id: 'b', startDate: '2026-11-03' }),
      makeLoan({ id: 'c', startDate: '2026-11-05' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['c', 'b', 'a']);
  });

  it('should keep the order when the input is already descending', () => {
    const loans = [
      makeLoan({ id: 'a', startDate: '2026-11-05' }),
      makeLoan({ id: 'b', startDate: '2026-11-03' }),
      makeLoan({ id: 'c', startDate: '2026-11-01' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['a', 'b', 'c']);
  });

  it('should put the loan appearing last in the list first when startDate is equal', () => {
    const loans = [
      makeLoan({ id: 'first', startDate: '2026-11-05', returnedAt: '2026-11-05' }),
      makeLoan({ id: 'second', startDate: '2026-11-05' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['second', 'first']);
  });

  it('should reverse three loans sharing the same startDate', () => {
    const loans = [
      makeLoan({ id: 'a', startDate: '2026-11-05' }),
      makeLoan({ id: 'b', startDate: '2026-11-05' }),
      makeLoan({ id: 'c', startDate: '2026-11-05' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['c', 'b', 'a']);
  });

  it('should sort by startDate regardless of returnedAt', () => {
    const loans = [
      makeLoan({ id: 'old-active', startDate: '2026-11-01' }),
      makeLoan({ id: 'recent-returned', startDate: '2026-11-04', returnedAt: '2026-11-05' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['recent-returned', 'old-active']);
  });

  it('should sort across month and year boundaries', () => {
    const loans = [
      makeLoan({ id: 'nov', startDate: '2026-11-05' }),
      makeLoan({ id: 'dec', startDate: '2025-12-30' }),
      makeLoan({ id: 'jan', startDate: '2026-01-02' }),
    ];
    expect(ids(getLoanHistory('eq-1', loans))).toEqual(['nov', 'jan', 'dec']);
  });

  it('should return a new array without modifying the input', () => {
    const loans = [
      makeLoan({ id: 'a', startDate: '2026-11-01' }),
      makeLoan({ id: 'b', equipmentId: 'eq-2' }),
      makeLoan({ id: 'c', startDate: '2026-11-05' }),
    ];
    const result = getLoanHistory('eq-1', loans);
    expect(result).not.toBe(loans);
    expect(ids(loans)).toEqual(['a', 'b', 'c']);
    expect(loans).toHaveLength(3);
  });

  it('should return the same loan objects, not copies', () => {
    const loan = makeLoan({ id: 'a' });
    expect(getLoanHistory('eq-1', [loan])[0]).toBe(loan);
  });
});
