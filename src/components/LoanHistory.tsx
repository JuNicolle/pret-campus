import { StyleSheet, Text, View } from 'react-native';
import type { Loan } from '../types';
import { getLoanHistory } from '../services/loanHistory';
import { formatFr } from '../utils/date';
import { EmptyState } from './EmptyState';

export interface LoanHistoryProps {
  equipmentId: string;
  loans: Loan[];
}

// Présentation seule : tous les prêts de l'équipement, du plus récent au plus ancien.
export function LoanHistory({ equipmentId, loans }: LoanHistoryProps) {
  const history = getLoanHistory(equipmentId, loans);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Historique des prêts
      </Text>
      {history.length === 0 ? (
        <EmptyState message="Aucun prêt enregistré pour cet équipement." />
      ) : (
        <View style={styles.list}>
          {history.map((loan) => (
            <LoanHistoryItem key={loan.id} loan={loan} />
          ))}
        </View>
      )}
    </View>
  );
}

function LoanHistoryItem({ loan }: { loan: Loan }) {
  const borrower = `${loan.borrowerFirstName} ${loan.borrowerLastName}`;
  const isReturned = Boolean(loan.returnedAt);
  const statusLabel = isReturned ? 'Rendu' : 'En cours';
  const start = formatFr(loan.startDate);
  const expected = formatFr(loan.expectedReturnDate);
  const returned = loan.returnedAt ? formatFr(loan.returnedAt) : 'pas encore rendu';
  const accessibilityLabel = `${borrower}, ${statusLabel.toLowerCase()}, début ${start}, retour prévu ${expected}, retour effectif : ${returned}`;

  return (
    <View style={styles.card} accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.header}>
        <Text style={styles.borrower}>{borrower}</Text>
        <View style={[styles.badge, isReturned ? styles.badgeReturned : styles.badgeActive]}>
          <Text style={[styles.badgeText, isReturned ? styles.badgeTextReturned : styles.badgeTextActive]}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.line}>{`Début : ${start}`}</Text>
      <Text style={styles.line}>{`Retour prévu : ${expected}`}</Text>
      <Text style={styles.line}>{`Retour effectif : ${returned}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    minHeight: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  borrower: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeActive: {
    backgroundColor: '#FFEDD5',
  },
  badgeReturned: {
    backgroundColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#9A3412',
  },
  badgeTextReturned: {
    color: '#374151',
  },
  line: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
});
