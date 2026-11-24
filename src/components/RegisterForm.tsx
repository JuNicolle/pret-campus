import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateFirstName, validateLastName } from '../services/validation';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Formulaire d'inscription locale : validation à la soumission, puis register du contexte.
export function RegisterForm() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Garde synchrone : le state ne se met pas à jour assez vite pour un double appui.
  const submitInProgress = useRef(false);

  const handleSubmit = async () => {
    if (submitInProgress.current) {
      return;
    }
    submitInProgress.current = true;

    const firstNameResult = validateFirstName(firstName);
    const lastNameResult = validateLastName(lastName);
    const emailResult = validateEmail(email);
    const nextErrors: RegisterErrors = {};
    if (!firstNameResult.ok) {
      nextErrors.firstName = firstNameResult.message;
    }
    if (!lastNameResult.ok) {
      nextErrors.lastName = lastNameResult.message;
    }
    if (!emailResult.ok) {
      nextErrors.email = emailResult.message;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      submitInProgress.current = false;
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await register({ firstName, lastName, email });
    if (!result.ok) {
      setSubmitError(result.message);
      setIsSubmitting(false);
      submitInProgress.current = false;
    }
    // Succès : user change, la stack bascule et démonte l'écran (aucun setState ici).
  };

  return (
    <View>
      <FormField
        label="Prénom"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setErrors((prev) => ({ ...prev, firstName: undefined }));
        }}
        error={errors.firstName}
        autoCapitalize="words"
      />
      <FormField
        label="Nom"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          setErrors((prev) => ({ ...prev, lastName: undefined }));
        }}
        error={errors.lastName}
        autoCapitalize="words"
      />
      <FormField
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {submitError !== null && (
        <Text accessibilityRole="alert" style={styles.submitError}>
          {submitError}
        </Text>
      )}
      <PrimaryButton label="S'inscrire" onPress={handleSubmit} disabled={isSubmitting} />
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
