import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface OptionSelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
}

// Choix unique parmi quelques options, sans dépendance (pas de Picker).
export function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: OptionSelectorProps<T>): ReactElement {
  return (
    <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityLabel={option}
              accessibilityState={{ selected }}
              style={[styles.option, selected && styles.optionSelected]}
            >
              {/* La coche rend la sélection visible sans dépendre de la couleur seule. */}
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {selected ? `✓ ${option}` : option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  error: {
    fontSize: 13,
    color: '#B91C1C',
  },
});
