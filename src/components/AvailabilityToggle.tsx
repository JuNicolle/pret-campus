import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

export interface AvailabilityToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function AvailabilityToggle({ value, onValueChange }: AvailabilityToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel="Disponibles uniquement"
      accessibilityState={{ checked: value }}
      style={styles.row}
    >
      <Text style={styles.label}>Disponibles uniquement</Text>
      {/* Le Switch est décoratif : la ligne entière porte l'action et l'annonce. */}
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Switch value={value} trackColor={{ true: '#1D4ED8' }} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
});
