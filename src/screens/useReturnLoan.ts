import { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import type { Loan } from '../types';

// État et garde du retour d'un prêt. Le contexte ne lève jamais : on lit result.ok.
export function useReturnLoan(
  activeLoan: Loan | undefined,
  onError: (message: string | null) => void,
) {
  const { returnLoan } = useData();
  const [returningId, setReturningId] = useState<string | null>(null);
  // Garde synchrone indexée sur l'id du prêt, prise avant l'await.
  const inFlightId = useRef<string | null>(null);

  async function handleReturn() {
    if (!activeLoan || inFlightId.current === activeLoan.id) return;
    inFlightId.current = activeLoan.id;
    onError(null);
    setReturningId(activeLoan.id);
    const result = await returnLoan(activeLoan.id);
    if (!result.ok) {
      onError(result.message);
      setReturningId(null);
      inFlightId.current = null;
    }
    // Succès : aucun setState, la garde reste prise (le prêt n'est plus actif).
  }

  return {
    handleReturn,
    isReturning: activeLoan !== undefined && returningId === activeLoan.id,
  };
}
