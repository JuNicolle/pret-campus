import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_ERROR_MESSAGE } from './storageResult';
import type { StorageReadResult, StorageResult } from './storageResult';

const failure = { ok: false, message: STORAGE_ERROR_MESSAGE } as const;

// Lit une liste JSON ; clé absente = liste vide, JSON invalide ou non tableau = échec
export async function readList<T>(key: string): Promise<StorageReadResult<T[]>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return { ok: true, value: [] };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return failure;
    }
    return { ok: true, value: parsed as T[] };
  } catch {
    return failure;
  }
}

// Écrit la liste complète sérialisée en JSON sous la clé donnée
export async function writeList<T>(key: string, list: T[]): Promise<StorageResult> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
    return { ok: true };
  } catch {
    return failure;
  }
}
