import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { EquipmentSummary } from '../components/EquipmentSummary';
import { LoanActions } from '../components/LoanActions';
import { LoanInfo } from '../components/LoanInfo';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useData } from '../context/DataContext';
import type { AppStackParamList } from '../navigation/types';
import { canDeleteEquipment, canLend, getActiveLoan, getAvailability } from '../services/loanRules';
import type { Equipment } from '../types';
import { today } from '../utils/date';

type Props = NativeStackScreenProps<AppStackParamList, 'EquipmentDetail'>;

export default function EquipmentDetailScreen({ navigation, route }: Props) {
  const { equipments, loans, isLoading, loadError, deleteEquipment } = useData();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Garde synchrone : couvre aussi l'ouverture de l'Alert (double appui).
  const deleteInProgress = useRef(false);
  const equipment = equipments.find((e) => e.id === route.params.equipmentId);

  function release() {
    deleteInProgress.current = false;
  }

  async function confirmDelete(id: string) {
    setIsDeleting(true);
    const result = await deleteEquipment(id);
    if (!result.ok) {
      setDeleteError(result.message);
      setIsDeleting(false);
      release();
      return;
    }
    // Succès : l'écran est retiré, la garde reste levée.
    navigation.goBack();
  }

  function handleDelete(target: Equipment) {
    if (deleteInProgress.current) return;
    deleteInProgress.current = true;
    setDeleteError(null);
    // Règle vérifiée en amont ; le contexte la revérifie à la suppression.
    const rule = canDeleteEquipment(target, loans);
    if (!rule.ok) {
      setDeleteError(rule.message);
      release();
      return;
    }
    Alert.alert(
      `Supprimer « ${target.name} » ? Cette action est définitive.`,
      undefined,
      [
        { text: 'Annuler', style: 'cancel', onPress: release },
        { text: 'Supprimer', style: 'destructive', onPress: () => void confirmDelete(target.id) },
      ],
      { cancelable: true, onDismiss: release },
    );
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
  } else if (equipment === undefined && isDeleting) {
    // Suppression réussie : pas de « introuvable » avant le retour.
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
    const activeLoan = getActiveLoan(equipment.id, loans);
    const lendRule = canLend(equipment, loans, today());
    content = (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EquipmentSummary equipment={equipment} availability={availability} />
        {activeLoan ? <LoanInfo loan={activeLoan} /> : null}
        {deleteError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {deleteError}
          </Text>
        ) : null}
        <View style={styles.actions}>
          <LoanActions
            activeLoan={activeLoan}
            lendRule={lendRule}
            onLend={() => navigation.navigate('LoanForm', { equipmentId: equipment.id })}
          />
          <PrimaryButton
            label="Modifier"
            onPress={() => navigation.navigate('EquipmentForm', { equipmentId: equipment.id })}
          />
          <PrimaryButton
            label="Supprimer"
            onPress={() => handleDelete(equipment)}
            disabled={isDeleting}
          />
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
  error: {
    marginTop: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
  actions: {
    gap: 12,
    marginTop: 12,
  },
});
