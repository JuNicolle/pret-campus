import { useRef, useState, type ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { EquipmentInput } from '../context/DataContext';
import { CATEGORIES, CONDITIONS } from '../data/equipmentOptions';
import {
  EMPTY_EQUIPMENT_FORM,
  validateEquipmentForm,
  type EquipmentFormErrors,
  type EquipmentFormValues,
} from '../services/equipmentForm';
import { FormField } from './FormField';
import { OptionSelector } from './OptionSelector';
import { PrimaryButton } from './PrimaryButton';

export interface EquipmentFormProps {
  initialValues?: EquipmentFormValues;
  submitLabel: string;
  onSubmit: (input: EquipmentInput) => Promise<{ ok: true } | { ok: false; message: string }>;
}

// Formulaire d'équipement : ne connaît ni le contexte ni la navigation.
export function EquipmentForm({
  initialValues = EMPTY_EQUIPMENT_FORM,
  submitLabel,
  onSubmit,
}: EquipmentFormProps): ReactElement {
  const [values, setValues] = useState<EquipmentFormValues>(initialValues);
  const [errors, setErrors] = useState<EquipmentFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Garde synchrone : le state ne se met pas à jour assez vite pour un double appui.
  const submitInProgress = useRef(false);

  const handleSubmit = async () => {
    if (submitInProgress.current) {
      return;
    }
    submitInProgress.current = true;

    const validation = validateEquipmentForm(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      submitInProgress.current = false;
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await onSubmit(validation.input);
    if (!result.ok) {
      setSubmitError(result.message);
      setIsSubmitting(false);
      submitInProgress.current = false;
    }
    // Succès : le conteneur retire l'écran (aucun setState ici, garde conservée).
  };

  return (
    <View>
      <FormField
        label="Nom"
        value={values.name}
        onChangeText={(name) => {
          setValues((prev) => ({ ...prev, name }));
          setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={errors.name}
        autoCapitalize="sentences"
      />
      <OptionSelector
        label="Catégorie"
        options={CATEGORIES}
        value={values.category}
        onChange={(category) => {
          setValues((prev) => ({ ...prev, category }));
          setErrors((prev) => ({ ...prev, category: undefined }));
        }}
        error={errors.category}
      />
      <OptionSelector
        label="État"
        options={CONDITIONS}
        value={values.condition}
        onChange={(condition) => setValues((prev) => ({ ...prev, condition }))}
      />
      <FormField
        label="Description (facultative)"
        value={values.description}
        onChangeText={(description) => setValues((prev) => ({ ...prev, description }))}
        multiline
        autoCapitalize="sentences"
      />
      {submitError !== null && (
        <Text accessibilityRole="alert" style={styles.submitError}>
          {submitError}
        </Text>
      )}
      <PrimaryButton label={submitLabel} onPress={handleSubmit} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  submitError: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
});
