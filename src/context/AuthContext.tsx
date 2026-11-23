// Stub temporaire PC-14, remplacé par PC-17.
// Respecte le contrat attendu : user (session) et isLoading.
import { createContext, ReactNode, useContext } from 'react';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isLoading: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextValue = { user: null, isLoading: false };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
