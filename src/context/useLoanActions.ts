// Actions de prêt et de retour : id et dates générés dans la tâche en file, sauvegarde avant état
import { RefObject, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import { planAddLoan, planReturnLoan, type LoanInput, type LoansPlan } from '../services/loanWrites';
import { saveLoans } from '../storage/loanStorage';
import type { StorageResult } from '../storage/storageResult';
import type { Equipment, Loan } from '../types';
import { today } from '../utils/date';

export interface LoanActionsDeps {
  equipmentsRef: RefObject<Equipment[]>;
  loansRef: RefObject<Loan[]>;
  write: (task: () => Promise<StorageResult>) => Promise<StorageResult>;
  setLoans: (loans: Loan[]) => void;
}

export function useLoanActions({ equipmentsRef, loansRef, write, setLoans }: LoanActionsDeps) {
  // Sauvegarde d'abord ; ref et état ne changent qu'en cas de succès
  const commit = useCallback(
    async (plan: LoansPlan): Promise<StorageResult> => {
      if (!plan.ok) {
        return plan;
      }
      const saved = await saveLoans(plan.loans);
      if (!saved.ok) {
        return saved;
      }
      loansRef.current = plan.loans;
      setLoans(plan.loans);
      return { ok: true };
    },
    [loansRef, setLoans],
  );

  const addLoan = useCallback(
    (input: LoanInput): Promise<StorageResult> =>
      write(() => {
        const plan = planAddLoan(equipmentsRef.current, loansRef.current, input, Crypto.randomUUID(), today());
        return commit(plan);
      }),
    [write, equipmentsRef, loansRef, commit],
  );

  const returnLoan = useCallback(
    (loanId: string): Promise<StorageResult> =>
      write(() => commit(planReturnLoan(loansRef.current, loanId, today()))),
    [write, loansRef, commit],
  );

  return { addLoan, returnLoan };
}
