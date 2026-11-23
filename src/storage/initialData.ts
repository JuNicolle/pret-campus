// Chargement initial et seed unique : orchestre le stockage, sans état ni JSX.
import { createSeedEquipments } from '../data/seed';
import type { Equipment, Loan } from '../types';
import { loadEquipments, saveEquipments } from './equipmentStorage';
import { loadLoans } from './loanStorage';
import { loadSeeded, markSeeded } from './seedStorage';

export interface InitialData {
  equipments: Equipment[];
  loans: Loan[];
  error: string | null;
}

export const LOAD_ERROR_MESSAGE = 'Impossible de charger les données. Réessayez.';
export const SEED_ERROR_MESSAGE = 'Impossible d\'initialiser le catalogue de démonstration. Réessayez.';

// Ne rejette jamais : toute erreur devient un message dans `error`
export async function loadInitialData(): Promise<InitialData> {
  try {
    const seeded = await loadSeeded();
    const equipments = await loadEquipments();
    const loans = await loadLoans();

    const equipmentList = equipments.ok ? equipments.value : [];
    const loanList = loans.ok ? loans.value : [];

    // Lecture en échec : jamais de seed ni d'écriture, on ne remplace pas ce qu'on n'a pas pu lire
    if (!seeded.ok || !equipments.ok) {
      return { equipments: equipmentList, loans: loanList, error: LOAD_ERROR_MESSAGE };
    }
    const loansError = loans.ok ? null : LOAD_ERROR_MESSAGE;

    // Cas nominal des relances
    if (seeded.value) {
      return { equipments: equipmentList, loans: loanList, error: loansError };
    }

    // Drapeau perdu mais catalogue présent : réparation du drapeau, pas de doublon
    if (equipmentList.length > 0) {
      const repaired = await markSeeded();
      return {
        equipments: equipmentList,
        loans: loanList,
        error: repaired.ok ? loansError : LOAD_ERROR_MESSAGE,
      };
    }

    // Premier lancement : équipements d'abord, drapeau ensuite
    const seed = createSeedEquipments();
    const saved = await saveEquipments(seed);
    if (!saved.ok) {
      return { equipments: [], loans: loanList, error: SEED_ERROR_MESSAGE };
    }
    const marked = await markSeeded();
    return {
      equipments: seed,
      loans: loanList,
      error: marked.ok ? loansError : SEED_ERROR_MESSAGE,
    };
  } catch {
    return { equipments: [], loans: [], error: LOAD_ERROR_MESSAGE };
  }
}
