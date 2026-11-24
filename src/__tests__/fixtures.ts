import type { Equipment, Loan } from '../types';

// Fabriques de données de test, surchargeables champ par champ
export function makeEquipment(overrides: Partial<Equipment> = {}): Equipment {
  return {
    id: 'eq-1',
    name: 'Écran 27 pouces',
    category: 'Ordinateur',
    condition: 'Bon état',
    createdAt: '2026-01-01T10:00:00.000Z',
    ...overrides,
  };
}

export function makeLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: 'loan-1',
    equipmentId: 'eq-1',
    borrowerFirstName: 'Alice',
    borrowerLastName: 'Martin',
    startDate: '2026-11-01',
    expectedReturnDate: '2026-11-10',
    ...overrides,
  };
}
