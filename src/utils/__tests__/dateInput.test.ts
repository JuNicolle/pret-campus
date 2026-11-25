import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { today } from '../date';
import { fromIsoDate, toIsoDate } from '../dateInput';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('toIsoDate', () => {
  it.each([
    ['January 1st at midnight', new Date(2027, 0, 1, 0, 0), '2027-01-01'],
    ['January 1st just after midnight', new Date(2026, 0, 1, 0, 30), '2026-01-01'],
    ['January 31st at 23:59', new Date(2026, 0, 31, 23, 59), '2026-01-31'],
    ['February 28th of a non leap year', new Date(2027, 1, 28, 23, 59), '2027-02-28'],
    ['February 29th of a leap year', new Date(2028, 1, 29, 12, 0), '2028-02-29'],
    ['March 1st after a non leap February', new Date(2027, 2, 1, 0, 30), '2027-03-01'],
    ['a single digit month and day', new Date(2026, 2, 5, 8, 0), '2026-03-05'],
    ['a two digit month and a single digit day', new Date(2026, 9, 5, 8, 0), '2026-10-05'],
    ['December 31st at 23:59', new Date(2026, 11, 31, 23, 59), '2026-12-31'],
    ['seconds and milliseconds', new Date(2026, 5, 15, 23, 59, 59, 999), '2026-06-15'],
  ])('should return the local date for %s', (_label, date, expected) => {
    expect(toIsoDate(date)).toBe(expected);
  });

  it('should use local date parts and never call toISOString', () => {
    const spy = jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => {
      throw new Error('toISOString called');
    });
    expect(toIsoDate(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should match today() for a fixed clock', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 31, 23, 59));
    expect(toIsoDate(new Date())).toBe(today());
  });
});

describe('fromIsoDate', () => {
  it.each([
    ['2026-01-31', new Date(2026, 0, 31)],
    ['2028-02-29', new Date(2028, 1, 29)],
    ['2027-03-01', new Date(2027, 2, 1)],
  ])('should return local midnight for %s', (iso, expected) => {
    const result = fromIsoDate(iso);
    expect(result.getTime()).toBe(expected.getTime());
    expect(result.getHours()).toBe(0);
  });

  it('should ignore a time suffix', () => {
    expect(fromIsoDate('2026-11-05T23:30:00.000Z').getTime()).toBe(new Date(2026, 10, 5).getTime());
  });
});

describe('round trip', () => {
  it.each(['2026-01-01', '2028-02-29', '2026-12-31'])(
    'should give back %s after fromIsoDate then toIsoDate',
    (iso) => {
      expect(toIsoDate(fromIsoDate(iso))).toBe(iso);
    },
  );

  it('should drop the time when going from a Date to a string and back', () => {
    const date = new Date(2026, 10, 5, 18, 45);
    expect(fromIsoDate(toIsoDate(date)).getTime()).toBe(new Date(2026, 10, 5).getTime());
  });
});
