// Contexte des données : équipements et prêts, chargés une fois au démarrage.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { canDeleteEquipment, canSetOutOfService } from '../services/loanRules';
import { saveEquipments } from '../storage/equipmentStorage';
import { loadInitialData, type InitialData } from '../storage/initialData';
import type { StorageResult } from '../storage/storageResult';
import { Equipment, Loan } from '../types';

// Saisie d'un équipement : id et createdAt sont générés par le contexte
export type EquipmentInput = Omit<Equipment, 'id' | 'createdAt'>;

export interface DataContextValue {
  equipments: Equipment[];
  loans: Loan[];
  isLoading: boolean;
  loadError: string | null;
  addEquipment: (input: EquipmentInput) => Promise<StorageResult>;
  updateEquipment: (id: string, input: EquipmentInput) => Promise<StorageResult>;
  deleteEquipment: (id: string) => Promise<StorageResult>;
}

const WRITE_BLOCKED_MESSAGE = 'Les données n\'ont pas été chargées. Relancez l\'application.';
const NOT_FOUND_MESSAGE = 'Équipement introuvable.';

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Une seule exécution réelle du chargement (donc un seul seed), même en double effet
  const initRef = useRef<Promise<InitialData> | null>(null);
  // Miroirs de l'état : les actions lisent les refs pour éviter les fermetures périmées
  const equipmentsRef = useRef<Equipment[]>([]);
  const loansRef = useRef<Loan[]>([]);
  // Écritures bloquées tant que le chargement n'est pas terminé sans erreur
  const blockedRef = useRef(true);
  // File d'attente : les écritures s'exécutent l'une après l'autre
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let cancelled = false;

    initRef.current ??= loadInitialData();
    void initRef.current.then((data) => {
      if (cancelled) {
        return;
      }
      equipmentsRef.current = data.equipments;
      loansRef.current = data.loans;
      blockedRef.current = data.error !== null;
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

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = queueRef.current.then(task);
    queueRef.current = run.catch(() => undefined);
    return run;
  }

  // Sauvegarde d'abord ; état et ref ne changent qu'en cas de succès
  async function commit(next: Equipment[]): Promise<StorageResult> {
    const saved = await saveEquipments(next);
    if (!saved.ok) {
      return saved;
    }
    equipmentsRef.current = next;
    setEquipments(next);
    return { ok: true };
  }

  const addEquipment = useCallback((input: EquipmentInput): Promise<StorageResult> => {
    return enqueue(async () => {
      if (blockedRef.current) {
        return { ok: false, message: WRITE_BLOCKED_MESSAGE };
      }
      const created: Equipment = {
        ...input,
        id: Crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      return commit([...equipmentsRef.current, created]);
    });
  }, []);

  const updateEquipment = useCallback((id: string, input: EquipmentInput): Promise<StorageResult> => {
    return enqueue(async () => {
      if (blockedRef.current) {
        return { ok: false, message: WRITE_BLOCKED_MESSAGE };
      }
      const current = equipmentsRef.current.find((e) => e.id === id);
      if (!current) {
        return { ok: false, message: NOT_FOUND_MESSAGE };
      }
      // Double sécurité : passage hors service refusé pendant un prêt
      if (input.condition === 'Hors service' && current.condition !== 'Hors service') {
        const rule = canSetOutOfService(current, loansRef.current);
        if (!rule.ok) {
          return rule;
        }
      }
      const updated: Equipment = { ...current, ...input, id: current.id, createdAt: current.createdAt };
      return commit(equipmentsRef.current.map((e) => (e.id === id ? updated : e)));
    });
  }, []);

  const deleteEquipment = useCallback((id: string): Promise<StorageResult> => {
    return enqueue(async () => {
      if (blockedRef.current) {
        return { ok: false, message: WRITE_BLOCKED_MESSAGE };
      }
      const current = equipmentsRef.current.find((e) => e.id === id);
      if (!current) {
        return { ok: false, message: NOT_FOUND_MESSAGE };
      }
      // Double sécurité : suppression refusée pendant un prêt
      const rule = canDeleteEquipment(current, loansRef.current);
      if (!rule.ok) {
        return rule;
      }
      return commit(equipmentsRef.current.filter((e) => e.id !== id));
    });
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      equipments,
      loans,
      isLoading,
      loadError,
      addEquipment,
      updateEquipment,
      deleteEquipment,
    }),
    [equipments, loans, isLoading, loadError, addEquipment, updateEquipment, deleteEquipment],
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
