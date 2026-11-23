import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

// Écran provisoire, remplacé par le ticket dédié.
export default function LoanFormScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Nouveau prêt</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
