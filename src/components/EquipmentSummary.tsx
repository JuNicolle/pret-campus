import { StyleSheet, Text, View } from 'react-native';
import type { Availability, Equipment } from '../types';
import { StatusBadge } from './StatusBadge';

export interface EquipmentSummaryProps {
  equipment: Equipment;
  // Calculée par l'écran avec getAvailability.
  availability: Availability;
}

// Présentation seule de la fiche : aucune logique métier, aucun accès aux données.
export function EquipmentSummary({ equipment, availability }: EquipmentSummaryProps) {
  const description = equipment.description?.trim() ?? '';

  return (
    <View>
      <Text style={styles.name} accessibilityRole="header">
        {equipment.name}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Catégorie</Text>
        <Text style={styles.value}>{equipment.category}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>État</Text>
        <Text style={styles.value}>{equipment.condition}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Disponibilité</Text>
        <StatusBadge availability={availability} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Description</Text>
        {description === '' ? (
          <Text style={styles.empty}>Aucune description.</Text>
        ) : (
          <Text style={styles.value}>{description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  empty: {
    fontSize: 16,
    color: '#4B5563',
  },
});
