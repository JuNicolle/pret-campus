import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { formatFr, isBefore, today } from '../date';

afterEach(() => {
  jest.useRealTimers();
});

describe('today', () => {
  it.each([
    ['31 janvier 23:59', new Date(2026, 0, 31, 23, 59), '2026-01-31'],
    ['29 février bissextile', new Date(2028, 1, 29, 12, 0), '2028-02-29'],
    ['1er mars après 28 février non bissextile', new Date(2027, 2, 1, 0, 30), '2027-03-01'],
    ['28 février non bissextile', new Date(2027, 1, 28, 23, 59), '2027-02-28'],
    ['31 décembre 23:59', new Date(2026, 11, 31, 23, 59), '2026-12-31'],
    ['1er janvier 00:00', new Date(2027, 0, 1, 0, 0), '2027-01-01'],
    ['zéro-padding du mois et du jour', new Date(2026, 2, 5, 8, 0), '2026-03-05'],
  ])('should return the local date for %s', (_label, date, expected) => {
    jest.useFakeTimers().setSystemTime(date);
    expect(today()).toBe(expected);
  });
});

describe('isBefore', () => {
  it('should be false for equal dates', () => {
    expect(isBefore('2026-11-24', '2026-11-24')).toBe(false);
  });

  it('should be true for the day before', () => {
    expect(isBefore('2026-11-23', '2026-11-24')).toBe(true);
  });

  it('should be false for the day after', () => {
    expect(isBefore('2026-11-25', '2026-11-24')).toBe(false);
  });

  it('should be true across a month boundary', () => {
    expect(isBefore('2026-10-31', '2026-11-01')).toBe(true);
  });

  it('should be true across a year boundary', () => {
    expect(isBefore('2025-12-31', '2026-01-01')).toBe(true);
  });
});

describe('formatFr', () => {
  it('should format an ISO date as DD/MM/YYYY', () => {
    expect(formatFr('2026-11-05')).toBe('05/11/2026');
  });

  it('should ignore a time suffix', () => {
    expect(formatFr('2026-11-05T10:30:00.000Z')).toBe('05/11/2026');
  });

  it.each(['', 'abc', '2026-1-5', '05/11/2026'])('should return the invalid input %p unchanged', (value) => {
    expect(formatFr(value)).toBe(value);
  });
});
