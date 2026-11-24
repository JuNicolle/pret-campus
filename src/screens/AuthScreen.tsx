import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { RegisterForm } from '../components/RegisterForm';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { profile, loadError } = useAuth();

  // Corps choisi en une seule branche (profil unique, CLAUDE.md §6).
  const body =
    profile === null ? (
      <RegisterForm />
    ) : (
      <EmptyState message="Un profil existe déjà sur cet appareil." />
    );

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>
            Créer votre profil
          </Text>
          {loadError !== null && (
            <Text accessibilityRole="alert" style={styles.banner}>
              {loadError}
            </Text>
          )}
          {body}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  banner: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
});
