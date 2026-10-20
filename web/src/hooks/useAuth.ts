/**
 * useAuth — get the logged-in user and login/logout functions.
 *
 *   const { user, login, logout } = useAuth();
 */
"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/auth/AuthProvider";

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return auth;
}
