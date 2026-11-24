import { StyleSheet, Text, View } from 'react-native';
import type { RuleResult } from '../services/loanRules';
import type { Loan } from '../types';
import { PrimaryButton } from './PrimaryButton';

export interface LoanActionsProps {
  activeLoan: Loan | undefined;
  // Calculée par l'écran avec canLend.
  lendRule: RuleResult;
  onLend: () => void;
  // Absent : « Enregistrer le retour » reste inactif.
  onReturn?: () => void;
  // Retour en cours : le bouton est désactivé.
  isReturning?: boolean;
}

const noop = () => {};

// Boutons de prêt / retour : simples branches d'affichage, aucune logique métier.
export function LoanActions({ activeLoan, lendRule, onLend, onReturn, isReturning = false }: LoanActionsProps) {
  if (activeLoan) {
    return (
      <PrimaryButton
        label="Enregistrer le retour"
        onPress={onReturn ?? noop}
        disabled={onReturn === undefined || isReturning}
      />
    );
  }
  if (lendRule.ok) {
    return <PrimaryButton label="Prêter" onPress={onLend} />;
  }
  return (
    <View style={styles.blocked}>
      <PrimaryButton
        label="Prêter"
        onPress={onLend}
        disabled
        accessibilityHint={lendRule.message}
      />
      <Text style={styles.reason}>{lendRule.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  blocked: {
    gap: 8,
  },
  reason: {
    fontSize: 14,
    color: '#4B5563',
  },
});
