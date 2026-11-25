import { StyleSheet, Text, View } from 'react-native';
import type { DashboardCounts } from '../services/dashboard';

export interface DashboardCountersProps {
  counts: DashboardCounts;
}

// Mêmes coloris que StatusBadge (fond clair, texte foncé, contraste AA).
const COLORS = {
  available: { background: '#DCFCE7', text: '#166534' },
  lent: { background: '#FFEDD5', text: '#9A3412' },
  outOfService: { background: '#F1E4E4', text: '#7F1D1D' },
};

interface TileProps {
  label: string;
  value: number;
  colors: { background: string; text: string };
}

// Le libellé en texte porte le sens, la couleur ne fait que le renforcer.
function Tile({ label, value, colors }: TileProps) {
  return (
    <View style={[styles.tile, { backgroundColor: colors.background }]}>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

export function DashboardCounters({ counts }: DashboardCountersProps) {
  const summary =
    `Parc : ${counts.total} ${counts.total === 1 ? 'équipement' : 'équipements'}. ` +
    `${counts.available} ${counts.available === 1 ? 'disponible' : 'disponibles'}, ` +
    `${counts.lent} ${counts.lent === 1 ? 'prêté' : 'prêtés'}, ` +
    `${counts.outOfService} hors service`;

  return (
    <View accessible accessibilityRole="summary" accessibilityLabel={summary} style={styles.container}>
      <View style={styles.row}>
        <Tile label="Disponibles" value={counts.available} colors={COLORS.available} />
        <Tile label="Prêtés" value={counts.lent} colors={COLORS.lent} />
        <Tile label="Hors service" value={counts.outOfService} colors={COLORS.outOfService} />
      </View>
      <Text style={styles.total}>Total : {counts.total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  total: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
});
