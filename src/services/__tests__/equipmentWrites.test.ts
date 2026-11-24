import { describe, expect, it } from '@jest/globals';
import { makeEquipment, makeLoan } from '../../__tests__/fixtures';
import type { EquipmentInput } from '../equipmentWrites';
import { planDeleteEquipment, planUpdateEquipment } from '../equipmentWrites';

const OUT_OF_SERVICE_MESSAGE = "Enregistrez le retour avant de passer l'équipement hors service.";
const DELETE_MESSAGE = 'Impossible de supprimer un équipement en cours de prêt.';
const NOT_FOUND = { ok: false, message: 'Équipement introuvable.' };

function toInput(overrides: Partial<EquipmentInput> = {}): EquipmentInput {
  return { name: 'Écran 27 pouces', category: 'Ordinateur', condition: 'Bon état', ...overrides };
}

describe('planUpdateEquipment', () => {
  it('should refuse an unknown id', () => {
    expect(planUpdateEquipment([makeEquipment()], [], 'inconnu', toInput())).toEqual(NOT_FOUND);
  });

  it('should refuse "Hors service" while a loan is in progress', () => {
    const result = planUpdateEquipment([makeEquipment()], [makeLoan()], 'eq-1', toInput({ condition: 'Hors service' }));
    expect(result).toEqual({ ok: false, message: OUT_OF_SERVICE_MESSAGE });
  });

  it('should accept "Hors service" without any loan', () => {
    const result = planUpdateEquipment([makeEquipment()], [], 'eq-1', toInput({ condition: 'Hors service' }));
    expect(result).toEqual({ ok: true, equipments: [makeEquipment({ condition: 'Hors service' })] });
  });

  it('should accept "Hors service" once the loan is returned', () => {
    const loans = [makeLoan({ returnedAt: '2026-11-05' })];
    const result = planUpdateEquipment([makeEquipment()], loans, 'eq-1', toInput({ condition: 'Hors service' }));
    expect(result.ok).toBe(true);
  });

  it('should accept another condition ("Usé") while a loan is in progress', () => {
    const result = planUpdateEquipment([makeEquipment()], [makeLoan()], 'eq-1', toInput({ condition: 'Usé' }));
    expect(result).toEqual({ ok: true, equipments: [makeEquipment({ condition: 'Usé' })] });
  });

  it('should not block an equipment already "Hors service" with a loan in progress', () => {
    const current = makeEquipment({ condition: 'Hors service' });
    const result = planUpdateEquipment([current], [makeLoan()], 'eq-1', toInput({ name: 'Nouveau nom', condition: 'Hors service' }));
    expect(result).toEqual({ ok: true, equipments: [{ ...current, name: 'Nouveau nom' }] });
  });

  it('should remove an erased description and keep id and createdAt', () => {
    const current = makeEquipment({ description: 'Ancienne description' });
    const result = planUpdateEquipment([current], [], 'eq-1', toInput({ name: 'Autre nom' }));
    expect(result).toEqual({ ok: true, equipments: [makeEquipment({ name: 'Autre nom' })] });
    if (result.ok) {
      expect('description' in result.equipments[0]).toBe(false);
      expect(result.equipments[0].id).toBe('eq-1');
      expect(result.equipments[0].createdAt).toBe(current.createdAt);
    }
  });

  it('should leave the original list and the other equipments untouched', () => {
    const first = makeEquipment({ id: 'eq-0' });
    const second = makeEquipment();
    const third = makeEquipment({ id: 'eq-2' });
    const list = [first, second, third];
    const result = planUpdateEquipment(list, [], 'eq-1', toInput({ name: 'Modifié' }));
    expect(list).toEqual([first, makeEquipment(), third]);
    expect(result.ok && result.equipments[0]).toBe(first);
    expect(result.ok && result.equipments[2]).toBe(third);
    expect(result.ok && result.equipments.map((e) => e.id)).toEqual(['eq-0', 'eq-1', 'eq-2']);
  });
});

describe('planDeleteEquipment', () => {
  it('should refuse an unknown id', () => {
    expect(planDeleteEquipment([makeEquipment()], [], 'inconnu')).toEqual(NOT_FOUND);
  });

  it('should refuse the deletion while a loan is in progress', () => {
    expect(planDeleteEquipment([makeEquipment()], [makeLoan()], 'eq-1')).toEqual({ ok: false, message: DELETE_MESSAGE });
  });

  it('should delete only the targeted equipment when there is no loan', () => {
    const other = makeEquipment({ id: 'eq-2' });
    expect(planDeleteEquipment([makeEquipment(), other], [], 'eq-1')).toEqual({ ok: true, equipments: [other] });
  });

  it('should accept the deletion when the only loan is returned', () => {
    const loans = [makeLoan({ returnedAt: '2026-11-05' })];
    expect(planDeleteEquipment([makeEquipment()], loans, 'eq-1')).toEqual({ ok: true, equipments: [] });
  });

  it('should not be blocked by a loan in progress on another equipment', () => {
    const loans = [makeLoan({ equipmentId: 'eq-2' })];
    const result = planDeleteEquipment([makeEquipment(), makeEquipment({ id: 'eq-2' })], loans, 'eq-1');
    expect(result.ok && result.equipments.map((e) => e.id)).toEqual(['eq-2']);
  });
});
