import { StyleSheet, Text, View } from 'react-native';
import type { Loan } from '../types';
import { formatFr } from '../utils/date';

export interface LoanInfoProps {
  loan: Loan;
}

// Présentation seule du prêt en cours : aucune logique métier.
export function LoanInfo({ loan }: LoanInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Prêt en cours
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Emprunteur</Text>
        <Text style={styles.value}>{`${loan.borrowerFirstName} ${loan.borrowerLastName}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Début</Text>
        <Text style={styles.value}>{formatFr(loan.startDate)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Retour prévu</Text>
        <Text style={styles.value}>{formatFr(loan.expectedReturnDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
});
