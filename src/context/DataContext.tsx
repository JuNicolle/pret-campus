// Contexte des données : équipements et prêts, chargés une fois au démarrage.
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadInitialData, type InitialData } from '../storage/initialData';
import { Equipment, Loan } from '../types';

export interface DataContextValue {
  equipments: Equipment[];
  loans: Loan[];
  isLoading: boolean;
  loadError: string | null;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Une seule exécution réelle du chargement (donc un seul seed), même en double effet
  const initRef = useRef<Promise<InitialData> | null>(null);

  useEffect(() => {
    let cancelled = false;

    initRef.current ??= loadInitialData();
    void initRef.current.then((data) => {
      if (cancelled) {
        return;
      }
      // Les listes sont appliquées même si une erreur est signalée
      setEquipments(data.equipments);
      setLoans(data.loans);
      setLoadError(data.error);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({ equipments, loans, isLoading, loadError }),
    [equipments, loans, isLoading, loadError],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error('useData doit être utilisé dans un DataProvider.');
  }
  return context;
}
