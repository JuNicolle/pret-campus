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
import { EquipmentForm } from '../components/EquipmentForm';
import { ScreenContainer } from '../components/ScreenContainer';
import { useData, type EquipmentInput } from '../context/DataContext';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'EquipmentForm'>;

export default function EquipmentFormScreen({ navigation, route }: Props) {
  const { addEquipment, isLoading, loadError } = useData();

  async function handleSubmit(input: EquipmentInput) {
    const result = await addEquipment(input);
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
  } else if (route.params?.equipmentId !== undefined) {
    // PC-29 : point d'insertion de la modification (remplace ce message provisoire).
    content = <EmptyState message="La modification n'est pas encore disponible." />;
  } else {
    content = (
      <>
        <Text accessibilityRole="header" style={styles.title}>
          Nouvel équipement
        </Text>
        <EquipmentForm submitLabel="Enregistrer" onSubmit={handleSubmit} />
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
