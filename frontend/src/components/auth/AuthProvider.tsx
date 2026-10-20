/**
 * AuthProvider — remembers who is logged in, for the whole app.
 *
 * Wraps every page (see layout.tsx). Any component can then call
 * useAuth() to get the user, the token, and login / signup / logout.
 */
"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";
import { clearToken, loadToken, saveToken } from "@/lib/auth/tokenStorage";

export type AuthStatus = "loading" | "signed-in" | "signed-out";

export type AuthValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  /** Replace the stored user, e.g. after saving the profile. */
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On first load: if a token was saved earlier, check it's still valid.
  useEffect(() => {
    async function restoreLogin() {
      const savedToken = loadToken();
      if (!savedToken) {
        setStatus("signed-out");
        return;
      }
      try {
        const me = await authApi.getMe(savedToken);
        setToken(savedToken);
        setUser(me);
        setStatus("signed-in");
      } catch {
        clearToken();
        setStatus("signed-out");
      }
    }
    restoreLogin();
  }, []);

  const startSession = useCallback((newToken: string, newUser: User) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(newUser);
    setStatus("signed-in");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password);
      startSession(result.token, result.user);
    },
    [startSession],
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const result = await authApi.signup(email, password, name);
      startSession(result.token, result.user);
    },
    [startSession],
  );

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
    setStatus("signed-out");
  }, []);

  const value = useMemo(
    () => ({ status, user, token, login, signup, logout, setUser }),
    [status, user, token, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
