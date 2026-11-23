import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

export interface ScreenContainerProps {
  children: ReactNode;
  // Côtés protégés par la zone sûre. Le haut est exclu par défaut car l'en-tête natif gère déjà son inset.
  edges?: Edge[];
}

// Enveloppe commune des écrans : zone sûre (encoche, barre d'état) et fond.
export function ScreenContainer({
  children,
  edges = ['bottom', 'left', 'right'],
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
});
