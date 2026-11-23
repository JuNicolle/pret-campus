// Validation des champs de formulaire : fonctions pures, sans UI ni stockage.

export type ValidationResult = { ok: true } | { ok: false; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Champ obligatoire générique : refuse une valeur vide ou faite d'espaces.
export function validateRequired(value: string, message: string): ValidationResult {
  if (value.trim() === '') {
    return { ok: false, message };
  }
  return { ok: true };
}

export function validateFirstName(value: string): ValidationResult {
  return validateRequired(value, 'Le prénom est obligatoire.');
}

export function validateLastName(value: string): ValidationResult {
  return validateRequired(value, 'Le nom est obligatoire.');
}

export function validateEmail(value: string): ValidationResult {
  const email = value.trim();
  if (email === '') {
    return { ok: false, message: "L'email est obligatoire." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: 'Email invalide.' };
  }
  return { ok: true };
}
