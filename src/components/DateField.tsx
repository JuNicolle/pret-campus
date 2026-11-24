import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatFr } from '../utils/date';
import { fromIsoDate, toIsoDate } from '../utils/dateInput';

export interface DateFieldProps {
  label: string;
  value: string; // YYYY-MM-DD
  minimumDate: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
  error?: string;
}

// Champ date : dialogue natif sur Android, spinner sous le champ sur iOS.
export function DateField({ label, value, minimumDate, onChange, error }: DateFieldProps) {
  const [showIosPicker, setShowIosPicker] = useState(false);
  // Garde synchrone contre l'ouverture de deux dialogues Android.
  const dialogOpen = useRef(false);
  const hasError = !!error;

  const handleSelect = (date: Date) => onChange(toIsoDate(date));

  const handlePress = () => {
    if (Platform.OS === 'android') {
      if (dialogOpen.current) return;
      dialogOpen.current = true;
      DateTimePickerAndroid.open({
        value: fromIsoDate(value),
        mode: 'date',
        minimumDate: fromIsoDate(minimumDate),
        onValueChange: (_event, date) => {
          dialogOpen.current = false;
          handleSelect(date);
        },
        onDismiss: () => {
          dialogOpen.current = false;
        },
      });
    } else {
      setShowIosPicker((prev) => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${formatFr(value)}`}
        style={[styles.field, hasError && styles.fieldError]}
      >
        <Text style={styles.value}>{formatFr(value)}</Text>
      </Pressable>
      {Platform.OS === 'ios' && showIosPicker && (
        <DateTimePicker
          value={fromIsoDate(value)}
          mode="date"
          display="spinner"
          locale="fr-FR"
          minimumDate={fromIsoDate(minimumDate)}
          onValueChange={(_event, date) => handleSelect(date)}
        />
      )}
      {hasError && (
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
  field: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  fieldError: {
    borderColor: '#B91C1C',
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: '#B91C1C',
  },
});
