import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { makeLoan } from '../../__tests__/fixtures';
import { isOverdue } from '../overdue';

afterEach(() => {
  jest.useRealTimers();
});

describe('isOverdue', () => {
  it('should be overdue when the active loan expected return date is yesterday', () => {
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-23' }), '2026-11-24')).toBe(true);
  });

  it('should not be overdue when the expected return date is today', () => {
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-24' }), '2026-11-24')).toBe(false);
  });

  it('should not be overdue when the expected return date is tomorrow', () => {
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-25' }), '2026-11-24')).toBe(false);
  });

  it('should never be overdue when the loan is returned, even with a past expected date', () => {
    const loan = makeLoan({ expectedReturnDate: '2026-11-10', returnedAt: '2026-11-09' });
    expect(isOverdue(loan, '2026-11-24')).toBe(false);
  });

  it('should not be overdue when the loan was returned after the expected date', () => {
    const loan = makeLoan({ expectedReturnDate: '2026-11-10', returnedAt: '2026-11-20' });
    expect(isOverdue(loan, '2026-11-24')).toBe(false);
  });

  it('should treat an empty returnedAt as not returned', () => {
    const loan = makeLoan({ expectedReturnDate: '2026-11-10', returnedAt: '' });
    expect(isOverdue(loan, '2026-11-24')).toBe(true);
  });

  it('should be overdue across a month boundary', () => {
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-30' }), '2026-12-01')).toBe(true);
  });

  it('should be overdue across a year boundary and not the other way round', () => {
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-12-31' }), '2027-01-01')).toBe(true);
    expect(isOverdue(makeLoan({ expectedReturnDate: '2027-01-01' }), '2026-12-31')).toBe(false);
  });

  it('should use the explicit now instead of the system clock', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 24, 12, 0));
    const loan = makeLoan({ expectedReturnDate: '2026-11-24' });
    expect(isOverdue(loan, '2026-11-25')).toBe(true);
    expect(isOverdue(loan, '2026-11-24')).toBe(false);
  });

  it('should use today by default', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 24, 23, 59));
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-23' }))).toBe(true);
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-24' }))).toBe(false);
  });

  it('should become overdue at the next local day', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 25, 0, 1));
    expect(isOverdue(makeLoan({ expectedReturnDate: '2026-11-24' }))).toBe(true);
  });

  it('should not modify the loan', () => {
    const loan = makeLoan({ expectedReturnDate: '2026-11-10' });
    const copy = { ...loan };
    isOverdue(loan, '2026-11-24');
    expect(loan).toEqual(copy);
  });
});
