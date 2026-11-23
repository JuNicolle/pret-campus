import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface CatalogHeaderProps {
  firstName: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}

// En-tête du catalogue : salutation et déconnexion (présentationnel).
export function CatalogHeader({ firstName, onLogout, isLoggingOut }: CatalogHeaderProps) {
  const greeting = firstName ? `Bonjour ${firstName}` : 'Bonjour';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting} numberOfLines={2}>
        {greeting}
      </Text>
      <Pressable
        onPress={onLogout}
        disabled={isLoggingOut}
        accessibilityRole="button"
        accessibilityLabel="Se déconnecter"
        accessibilityState={{ disabled: isLoggingOut }}
        style={[styles.button, isLoggingOut && styles.disabled]}
      >
        <Text style={styles.buttonLabel}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  greeting: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  button: {
    // minHeight et non height : le bouton grandit si la police est agrandie.
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});
