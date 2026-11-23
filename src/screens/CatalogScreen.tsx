import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

// Écran provisoire, remplacé par le ticket dédié.
export default function CatalogScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Catalogue</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
