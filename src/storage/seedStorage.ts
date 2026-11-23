import AsyncStorage from '@react-native-async-storage/async-storage';

import { SEEDED_KEY } from './keys';
import { STORAGE_ERROR_MESSAGE } from './storageResult';
import type { StorageReadResult, StorageResult } from './storageResult';

const failure = { ok: false, message: STORAGE_ERROR_MESSAGE } as const;

// Drapeau « données de démo déjà insérées » : seule la présence de la clé compte
export async function loadSeeded(): Promise<StorageReadResult<boolean>> {
  try {
    const raw = await AsyncStorage.getItem(SEEDED_KEY);
    return { ok: true, value: raw !== null };
  } catch {
    return failure;
  }
}

export async function markSeeded(): Promise<StorageResult> {
  try {
    await AsyncStorage.setItem(SEEDED_KEY, 'true');
    return { ok: true };
  } catch {
    return failure;
  }
}
