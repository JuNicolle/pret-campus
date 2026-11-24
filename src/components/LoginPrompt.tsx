import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import { PrimaryButton } from './PrimaryButton';

export interface LoginPromptProps {
  profile: User;
}

// Connexion locale : un seul bouton, le profil existe déjà sur l'appareil.
export function LoginPrompt({ profile }: LoginPromptProps) {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Garde synchrone : le state ne se met pas à jour assez vite pour un double appui.
  const loginInProgress = useRef(false);

  const handleLogin = async () => {
    if (loginInProgress.current) {
      return;
    }
    loginInProgress.current = true;
    setLoginError(null);
    setIsLoggingIn(true);
    const result = await login();
    if (!result.ok) {
      setLoginError(result.message);
      setIsLoggingIn(false);
      loginInProgress.current = false;
    }
    // Succès : user change, la stack bascule et démonte l'écran (aucun setState ici).
  };

  return (
    <View>
      {loginError !== null && (
        <Text accessibilityRole="alert" style={styles.loginError}>
          {loginError}
        </Text>
      )}
      <PrimaryButton
        label={`Se connecter en tant que ${profile.firstName} ${profile.lastName}`}
        onPress={handleLogin}
        disabled={isLoggingIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loginError: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
});
