import { describe, expect, it } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import { filterEquipments, normalizeText } from '../search';

describe('normalizeText', () => {
  it('should remove accents', () => {
    expect(normalizeText('Éléphant')).toBe('elephant');
  });

  it('should lowercase', () => {
    expect(normalizeText('CASQUE')).toBe('casque');
  });

  it('should trim surrounding spaces', () => {
    expect(normalizeText('  Écran ')).toBe('ecran');
  });
});

describe('filterEquipments', () => {
  const screen = makeEquipment({ id: 'a', name: 'Écran 27' });
  const headset = makeEquipment({ id: 'b', name: 'Casque audio' });
  const broken = makeEquipment({ id: 'c', name: 'Écran cassé', condition: 'Hors service' });
  const all = [screen, headset, broken];
  const loans = [makeLoan({ equipmentId: 'b' })];
  const base = { query: '', onlyAvailable: false };

  it('should return everything with an empty query', () => {
    expect(filterEquipments(all, loans, base)).toEqual(all);
  });

  it('should find an accented name with an unaccented query', () => {
    expect(filterEquipments(all, loans, { ...base, query: 'ecran' })).toEqual([screen, broken]);
  });

  it('should find an unaccented match with an accented query', () => {
    expect(filterEquipments(all, loans, { ...base, query: 'Écran' })).toEqual([screen, broken]);
  });

  it('should ignore case', () => {
    expect(filterEquipments(all, loans, { ...base, query: 'CASQUE' })).toEqual([headset]);
  });

  it('should match a substring', () => {
    expect(filterEquipments(all, loans, { ...base, query: 'udi' })).toEqual([headset]);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterEquipments(all, loans, { ...base, query: 'zzz' })).toEqual([]);
  });

  it('should drop lent and out of service equipments when onlyAvailable', () => {
    expect(filterEquipments(all, loans, { ...base, onlyAvailable: true })).toEqual([screen]);
  });

  it('should combine the query and onlyAvailable', () => {
    expect(filterEquipments(all, loans, { query: 'casque', onlyAvailable: true })).toEqual([]);
  });

  it('should keep the input order', () => {
    expect(filterEquipments([broken, screen], [], { ...base, query: 'ecran' })).toEqual([broken, screen]);
  });

  it('should return a new array and leave the inputs unchanged', () => {
    const input = [screen, headset];
    const inputSnapshot = structuredClone(input);
    const loansSnapshot = structuredClone(loans);
    const result = filterEquipments(input, loans, { ...base, onlyAvailable: true });
    expect(result).not.toBe(input);
    expect(input).toEqual(inputSnapshot);
    expect(loans).toEqual(loansSnapshot);
  });
});
