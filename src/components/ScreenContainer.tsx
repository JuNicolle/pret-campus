import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ScreenContainerProps {
  children: ReactNode;
}

// Enveloppe commune des écrans : zone sûre (encoche, barre d'état) et fond.
export function ScreenContainer({ children }: ScreenContainerProps) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
});
