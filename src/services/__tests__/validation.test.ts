import { describe, expect, it } from '@jest/globals';
import {
  validateEmail,
  validateEquipmentCategory,
  validateEquipmentName,
  validateFirstName,
  validateLastName,
  validateRequired,
} from '../validation';

describe('validateRequired', () => {
  it('should refuse an empty value with the given message', () => {
    expect(validateRequired('', 'Obligatoire.')).toEqual({ ok: false, message: 'Obligatoire.' });
  });

  it('should refuse a value made of spaces only', () => {
    expect(validateRequired('   ', 'Obligatoire.')).toEqual({ ok: false, message: 'Obligatoire.' });
  });

  it('should accept a filled value', () => {
    expect(validateRequired('a', 'Obligatoire.')).toEqual({ ok: true });
  });
});

describe('validateFirstName', () => {
  it('should refuse an empty first name', () => {
    expect(validateFirstName('')).toEqual({ ok: false, message: 'Le prénom est obligatoire.' });
  });

  it('should accept a first name', () => {
    expect(validateFirstName('Alice')).toEqual({ ok: true });
  });
});

describe('validateLastName', () => {
  it('should refuse an empty last name', () => {
    expect(validateLastName('')).toEqual({ ok: false, message: 'Le nom est obligatoire.' });
  });

  it('should refuse a last name of spaces', () => {
    expect(validateLastName('  ')).toEqual({ ok: false, message: 'Le nom est obligatoire.' });
  });

  it('should accept a last name', () => {
    expect(validateLastName('Martin')).toEqual({ ok: true });
  });
});

describe('validateEquipmentName', () => {
  it('should refuse an empty equipment name', () => {
    expect(validateEquipmentName('')).toEqual({ ok: false, message: 'Le nom est obligatoire.' });
  });

  it('should refuse an equipment name of spaces', () => {
    expect(validateEquipmentName('   ')).toEqual({ ok: false, message: 'Le nom est obligatoire.' });
  });

  it('should accept an equipment name', () => {
    expect(validateEquipmentName('Écran')).toEqual({ ok: true });
  });
});

describe('validateEmail', () => {
  it('should refuse an empty email', () => {
    expect(validateEmail('')).toEqual({ ok: false, message: "L'email est obligatoire." });
  });

  it('should refuse an email of spaces', () => {
    expect(validateEmail('   ')).toEqual({ ok: false, message: "L'email est obligatoire." });
  });

  it.each(['a', 'a@b', 'a b@c.d', '@c.d'])('should refuse the invalid email %p', (value) => {
    expect(validateEmail(value)).toEqual({ ok: false, message: 'Email invalide.' });
  });

  it('should accept a valid email', () => {
    expect(validateEmail('alice@campus.fr')).toEqual({ ok: true });
  });

  it('should accept a valid email with surrounding spaces', () => {
    expect(validateEmail('  alice@campus.fr  ')).toEqual({ ok: true });
  });
});

describe('validateEquipmentCategory', () => {
  it('should refuse a null category', () => {
    expect(validateEquipmentCategory(null)).toEqual({ ok: false, message: 'La catégorie est obligatoire.' });
  });

  it('should accept a category', () => {
    expect(validateEquipmentCategory('Casque')).toEqual({ ok: true });
  });
});
