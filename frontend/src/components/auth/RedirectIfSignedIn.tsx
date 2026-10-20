/**
 * RedirectIfSignedIn — used on login and sign-up pages.
 * If the user is already logged in, send them to the workout page.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "signed-in") router.replace("/workout");
  }, [status, router]);

  if (status === "loading") return null;
  return <>{children}</>;
}
