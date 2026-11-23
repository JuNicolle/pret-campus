// Contexte d'authentification locale : un seul profil, aucun mot de passe.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, loadSession, loadUser, saveSession, saveUser } from '../storage/userStorage';
import type { StorageResult } from '../storage/storageResult';
import { validateEmail, validateFirstName, validateLastName } from '../services/validation';
import { User } from '../types';

export interface AuthContextValue {
  user: User | null; // session ouverte
  profile: User | null; // profil enregistré
  isLoading: boolean;
  loadError: string | null;
  register: (input: User) => Promise<StorageResult>;
  login: () => Promise<StorageResult>;
  logout: () => Promise<StorageResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Restauration de la session et du profil au démarrage
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const session = await loadSession();
        const stored = await loadUser();
        if (cancelled) {
          return;
        }
        if (!session.ok) {
          setLoadError(session.message);
        } else if (!stored.ok) {
          setLoadError(stored.message);
        } else {
          setUser(session.value);
          setProfile(stored.value ?? session.value);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (input: User): Promise<StorageResult> => {
    const normalized: User = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
    };
    // Double sécurité : revalidation même si l'écran a déjà validé
    const checks = [
      validateFirstName(normalized.firstName),
      validateLastName(normalized.lastName),
      validateEmail(normalized.email),
    ];
    for (const check of checks) {
      if (!check.ok) {
        return check;
      }
    }
    // L'état n'est mis à jour qu'après les deux écritures
    const savedUser = await saveUser(normalized);
    if (!savedUser.ok) {
      return savedUser;
    }
    const savedSession = await saveSession(normalized);
    if (!savedSession.ok) {
      return savedSession;
    }
    setProfile(normalized);
    setUser(normalized);
    return { ok: true };
  }, []);

  const login = useCallback(async (): Promise<StorageResult> => {
    if (profile === null) {
      return { ok: false, message: 'Aucun profil enregistré.' };
    }
    const saved = await saveSession(profile);
    if (!saved.ok) {
      return saved;
    }
    setUser(profile);
    return { ok: true };
  }, [profile]);

  const logout = useCallback(async (): Promise<StorageResult> => {
    const cleared = await clearSession();
    if (!cleared.ok) {
      return cleared;
    }
    setUser(null); // le profil est conservé
    return { ok: true };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, isLoading, loadError, register, login, logout }),
    [user, profile, isLoading, loadError, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  }
  return context;
}
