import { StyleSheet, Text, View } from 'react-native';
import type { Availability } from '../types';

export interface StatusBadgeProps {
  availability: Availability;
}

// Fond clair + texte foncé : contraste ≥ 4,5:1 (AA), lisible même en plein soleil.
const COLORS: Record<Availability, { background: string; text: string }> = {
  Disponible: { background: '#DCFCE7', text: '#166534' },
  Prêté: { background: '#FFEDD5', text: '#9A3412' },
  Indisponible: { background: '#F1E4E4', text: '#7F1D1D' },
};

export function StatusBadge({ availability }: StatusBadgeProps) {
  const colors = COLORS[availability];

  return (
    <View
      accessibilityLabel={`Disponibilité : ${availability}`}
      style={[styles.badge, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{availability}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
