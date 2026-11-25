import { StyleSheet, Text, View } from 'react-native';
import type { Loan } from '../types';
import { isOverdue } from '../services/overdue';
import { formatFr } from '../utils/date';

export interface LoanInfoProps {
  loan: Loan;
}

// Présentation du prêt en cours ; le retard vient de la fonction pure isOverdue.
export function LoanInfo({ loan }: LoanInfoProps) {
  const overdue = isOverdue(loan);

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
        <View style={styles.valueRow}>
          <Text style={styles.value}>{formatFr(loan.expectedReturnDate)}</Text>
          {overdue ? (
            <View style={styles.overdueBadge} accessible accessibilityLabel="Prêt en retard">
              <Text style={styles.overdueText}>En retard</Text>
            </View>
          ) : null}
        </View>
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  overdueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
});
