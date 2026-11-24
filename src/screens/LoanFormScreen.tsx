import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { LoanForm } from '../components/LoanForm';
import { ScreenContainer } from '../components/ScreenContainer';
import { useData, type LoanInput } from '../context/DataContext';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'LoanForm'>;

export default function LoanFormScreen({ navigation, route }: Props) {
  const { equipments, loans, addLoan, isLoading, loadError } = useData();
  const equipment = equipments.find((e) => e.id === route.params.equipmentId);

  async function handleSubmit(input: LoanInput) {
    const result = await addLoan(input);
    if (result.ok) {
      navigation.goBack();
    }
    return result;
  }

  let content;
  if (isLoading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Chargement…</Text>
      </View>
    );
  } else if (loadError) {
    content = (
      <View accessibilityRole="alert">
        <EmptyState message={loadError} />
      </View>
    );
  } else if (equipment === undefined) {
    content = (
      <View accessibilityRole="alert">
        <EmptyState message="Cet équipement est introuvable." />
      </View>
    );
  } else {
    content = (
      <>
        <Text accessibilityRole="header" style={styles.title}>
          Nouveau prêt
        </Text>
        <LoanForm equipment={equipment} loans={loans} onSubmit={handleSubmit} />
      </>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
});
