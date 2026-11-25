import { describe, expect, it } from '@jest/globals';
import { CATEGORIES, CONDITIONS } from '../../data/equipmentOptions';
import { makeEquipment } from '../../__tests__/fixtures';
import {
  EMPTY_EQUIPMENT_FORM,
  equipmentToFormValues,
  validateEquipmentForm,
  type EquipmentFormValues,
} from '../equipmentForm';

const validValues: EquipmentFormValues = {
  name: 'Écran 27 pouces',
  category: 'Ordinateur',
  description: 'Écran de démo',
  condition: 'Bon état',
};

describe('EMPTY_EQUIPMENT_FORM', () => {
  it('should start with an empty name, no category, an empty description and the "Bon état" condition', () => {
    expect(EMPTY_EQUIPMENT_FORM).toStrictEqual({
      name: '',
      category: null,
      description: '',
      condition: 'Bon état',
    });
  });
});

describe('equipmentToFormValues', () => {
  it('should copy name, category, description and condition', () => {
    const eq = makeEquipment({ description: 'Écran de démo', condition: 'Usé', category: 'Tablette' });
    expect(equipmentToFormValues(eq)).toStrictEqual({
      name: 'Écran 27 pouces',
      category: 'Tablette',
      description: 'Écran de démo',
      condition: 'Usé',
    });
  });

  it('should use an empty description when the equipment has none', () => {
    expect(equipmentToFormValues(makeEquipment()).description).toBe('');
  });

  it('should keep an empty description as an empty string', () => {
    expect(equipmentToFormValues(makeEquipment({ description: '' })).description).toBe('');
  });

  it('should expose only the four form fields', () => {
    expect(Object.keys(equipmentToFormValues(makeEquipment())).sort()).toStrictEqual([
      'category',
      'condition',
      'description',
      'name',
    ]);
  });

  it('should not trim the name', () => {
    expect(equipmentToFormValues(makeEquipment({ name: ' Écran ' })).name).toBe(' Écran ');
  });
});

describe('validateEquipmentForm, valid entries', () => {
  it('should accept a complete entry and return the input without id and createdAt', () => {
    expect(validateEquipmentForm(validValues)).toStrictEqual({
      ok: true,
      input: {
        name: 'Écran 27 pouces',
        category: 'Ordinateur',
        condition: 'Bon état',
        description: 'Écran de démo',
      },
    });
  });

  it('should trim the name', () => {
    const result = validateEquipmentForm({ ...validValues, name: '  Écran ' });
    expect(result.ok && result.input.name).toBe('Écran');
  });

  it('should trim the description', () => {
    const result = validateEquipmentForm({ ...validValues, description: '  Notes  ' });
    expect(result.ok && result.input.description).toBe('Notes');
  });

  it.each(['', '   ', '\n\t '])('should omit the description key when the description is %p', (description) => {
    expect(validateEquipmentForm({ ...validValues, description })).toStrictEqual({
      ok: true,
      input: { name: 'Écran 27 pouces', category: 'Ordinateur', condition: 'Bon état' },
    });
  });

  it('should keep inner spaces and line breaks of the description', () => {
    const result = validateEquipmentForm({ ...validValues, description: ' ligne 1\nligne  2 ' });
    expect(result.ok && result.input.description).toBe('ligne 1\nligne  2');
  });

  it.each(CATEGORIES)('should accept the category %s', (category) => {
    const result = validateEquipmentForm({ ...validValues, category });
    expect(result.ok && result.input.category).toBe(category);
  });

  it.each(CONDITIONS)('should keep the condition %s', (condition) => {
    const result = validateEquipmentForm({ ...validValues, condition });
    expect(result.ok && result.input.condition).toBe(condition);
  });

  it('should not mutate the submitted values', () => {
    const values: EquipmentFormValues = { ...validValues, name: '  Écran ', description: '  Notes ' };
    const copy = { ...values };
    validateEquipmentForm(values);
    expect(values).toStrictEqual(copy);
  });

  it('should accept a one-character name', () => {
    const result = validateEquipmentForm({ ...validValues, name: 'A' });
    expect(result.ok && result.input.name).toBe('A');
  });
});

describe('validateEquipmentForm, errors', () => {
  it('should refuse an empty name with the message "Le nom est obligatoire."', () => {
    expect(validateEquipmentForm({ ...validValues, name: '' })).toStrictEqual({
      ok: false,
      errors: { name: 'Le nom est obligatoire.' },
    });
  });

  it.each(['   ', '\t', '\n', ' '])('should refuse a name made of whitespace %p', (name) => {
    expect(validateEquipmentForm({ ...validValues, name })).toStrictEqual({
      ok: false,
      errors: { name: 'Le nom est obligatoire.' },
    });
  });

  it('should refuse a missing category with the message "La catégorie est obligatoire."', () => {
    expect(validateEquipmentForm({ ...validValues, category: null })).toStrictEqual({
      ok: false,
      errors: { category: 'La catégorie est obligatoire.' },
    });
  });

  it('should report both errors when the name is empty and the category is missing', () => {
    expect(validateEquipmentForm({ ...validValues, name: '', category: null })).toStrictEqual({
      ok: false,
      errors: { name: 'Le nom est obligatoire.', category: 'La catégorie est obligatoire.' },
    });
  });
});
