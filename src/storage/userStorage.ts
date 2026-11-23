import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from '../types';
import { SESSION_KEY, USER_KEY } from './keys';
import { STORAGE_ERROR_MESSAGE } from './storageResult';
import type { StorageReadResult, StorageResult } from './storageResult';

const failure = { ok: false, message: STORAGE_ERROR_MESSAGE } as const;

// Écrit un utilisateur sérialisé en JSON sous la clé donnée
async function writeUser(key: string, user: User): Promise<StorageResult> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(user));
    return { ok: true };
  } catch {
    return failure;
  }
}

// Lit un utilisateur ; clé absente = null
async function readUser(key: string): Promise<StorageReadResult<User | null>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return { ok: true, value: null };
    }
    return { ok: true, value: JSON.parse(raw) as User };
  } catch {
    return failure;
  }
}

export async function saveUser(user: User): Promise<StorageResult> {
  return writeUser(USER_KEY, user);
}

export async function loadUser(): Promise<StorageReadResult<User | null>> {
  return readUser(USER_KEY);
}

export async function saveSession(user: User): Promise<StorageResult> {
  return writeUser(SESSION_KEY, user);
}

export async function loadSession(): Promise<StorageReadResult<User | null>> {
  return readUser(SESSION_KEY);
}

export async function clearSession(): Promise<StorageResult> {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    return { ok: true };
  } catch {
    return failure;
  }
}
