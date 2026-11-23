import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Availability, Equipment } from '../types';
import { StatusBadge } from './StatusBadge';

export interface EquipmentCardProps {
  equipment: Equipment;
  // Calculée par l'appelant (getAvailability) : la carte reste présentationnelle.
  availability: Availability;
  onPress: (equipment: Equipment) => void;
}

export function EquipmentCard({ equipment, availability, onPress }: EquipmentCardProps) {
  const { name, category, condition } = equipment;

  return (
    <Pressable
      onPress={() => onPress(equipment)}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${category}, état ${condition}, ${availability}`}
      accessibilityHint="Ouvre la fiche de l'équipement"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <View style={styles.badges}>
        {/* Pastille d'état locale : StatusBadge ne gère que la disponibilité. */}
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{condition}</Text>
        </View>
        <StatusBadge availability={availability} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardPressed: {
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  category: {
    marginTop: 2,
    fontSize: 14,
    color: '#4B5563',
  },
  badges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  conditionBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});
