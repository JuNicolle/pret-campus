import { useRef, useState, type ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LoanInput } from '../context/DataContext';
import { validateLoanForm, type LoanFormErrors, type LoanFormValues } from '../services/loanForm';
import type { StorageResult } from '../storage/storageResult';
import type { Equipment, Loan } from '../types';
import { formatFr, today } from '../utils/date';
import { DateField } from './DateField';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

export interface LoanFormProps {
  equipment: Equipment;
  loans: Loan[];
  onSubmit: (input: LoanInput) => Promise<StorageResult>;
}

// Formulaire de prêt : ne connaît ni le contexte ni la navigation.
export function LoanForm({ equipment, loans, onSubmit }: LoanFormProps): ReactElement {
  // Date de début figée au montage ; retour initialisé à cette date (valide d'office).
  const [startDate] = useState(today);
  const [values, setValues] = useState<LoanFormValues>({
    borrowerFirstName: '',
    borrowerLastName: '',
    expectedReturnDate: startDate,
  });
  const [errors, setErrors] = useState<LoanFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Garde synchrone : le state ne se met pas à jour assez vite pour un double appui.
  const submitInProgress = useRef(false);

  const handleChange = (field: keyof LoanFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (submitInProgress.current) {
      return;
    }
    submitInProgress.current = true;

    const validation = validateLoanForm(values, equipment, loans);
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
      <View style={styles.startDate}>
        <Text style={styles.label}>Date de début</Text>
        <Text accessibilityLabel="Date de début" style={styles.startValue}>
          {formatFr(startDate)}
        </Text>
      </View>
      <FormField
        label="Prénom de l'emprunteur"
        value={values.borrowerFirstName}
        onChangeText={(text) => handleChange('borrowerFirstName', text)}
        error={errors.borrowerFirstName}
        autoCapitalize="words"
      />
      <FormField
        label="Nom de l'emprunteur"
        value={values.borrowerLastName}
        onChangeText={(text) => handleChange('borrowerLastName', text)}
        error={errors.borrowerLastName}
        autoCapitalize="words"
      />
      <DateField
        label="Date de retour prévue"
        value={values.expectedReturnDate}
        minimumDate={startDate}
        onChange={(iso) => handleChange('expectedReturnDate', iso)}
        error={errors.expectedReturnDate}
      />
      {submitError !== null && (
        <Text accessibilityRole="alert" style={styles.submitError}>
          {submitError}
        </Text>
      )}
      <PrimaryButton label="Enregistrer le prêt" onPress={handleSubmit} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  startDate: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  startValue: {
    fontSize: 16,
    color: '#111827',
  },
  submitError: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
});
