import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { EquipmentSummary } from '../components/EquipmentSummary';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useData } from '../context/DataContext';
import type { AppStackParamList } from '../navigation/types';
import { getAvailability } from '../services/loanRules';

type Props = NativeStackScreenProps<AppStackParamList, 'EquipmentDetail'>;

export default function EquipmentDetailScreen({ navigation, route }: Props) {
  const { equipments, loans, isLoading, loadError } = useData();
  const equipment = equipments.find((e) => e.id === route.params.equipmentId);

  function handleDelete() {
    // Câblé par PC-31 (bouton inactif d'ici là).
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
    const availability = getAvailability(equipment, loans);
    content = (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EquipmentSummary equipment={equipment} availability={availability} />
        <View style={styles.actions}>
          <PrimaryButton
            label="Modifier"
            onPress={() => navigation.navigate('EquipmentForm', { equipmentId: equipment.id })}
          />
          <PrimaryButton label="Supprimer" onPress={handleDelete} disabled />
        </View>
      </ScrollView>
    );
  }

  return <ScreenContainer>{content}</ScreenContainer>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 12,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  actions: {
    gap: 12,
    marginTop: 12,
  },
});
