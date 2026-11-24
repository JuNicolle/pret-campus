import type { Category, Condition, Equipment } from '../types';
import { validateEquipmentCategory, validateEquipmentName } from './validation';

export interface EquipmentFormValues {
  name: string;
  category: Category | null;
  description: string;
  condition: Condition;
}

export interface EquipmentFormErrors {
  name?: string;
  category?: string;
}

// État par défaut « Bon état » ; catégorie sans défaut pour forcer un choix.
export const EMPTY_EQUIPMENT_FORM: EquipmentFormValues = {
  name: '',
  category: null,
  description: '',
  condition: 'Bon état',
};

// Valeurs initiales du formulaire à partir d'un équipement existant.
export function equipmentToFormValues(eq: Equipment): EquipmentFormValues {
  return {
    name: eq.name,
    category: eq.category,
    description: eq.description ?? '',
    condition: eq.condition,
  };
}

export type EquipmentFormResult =
  | { ok: true; input: Omit<Equipment, 'id' | 'createdAt'> }
  | { ok: false; errors: EquipmentFormErrors };

// Valide le formulaire et construit la saisie (nom et description nettoyés).
export function validateEquipmentForm(values: EquipmentFormValues): EquipmentFormResult {
  const nameResult = validateEquipmentName(values.name);
  const categoryResult = validateEquipmentCategory(values.category);
  const errors: EquipmentFormErrors = {};
  if (!nameResult.ok) {
    errors.name = nameResult.message;
  }
  if (!categoryResult.ok) {
    errors.category = categoryResult.message;
  }
  if (values.category === null || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const input: Omit<Equipment, 'id' | 'createdAt'> = {
    name: values.name.trim(),
    category: values.category,
    condition: values.condition,
  };
  const description = values.description.trim();
  // Description vide : clé absente, conforme au modèle `description?`.
  if (description !== '') {
    input.description = description;
  }
  return { ok: true, input };
}
