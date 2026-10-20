/**
 * RequireAuth — wrap a page with this to make it "logged-in only".
 * Logged-out visitors are sent to the login page.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "signed-out") router.replace("/login");
  }, [status, router]);

  if (status !== "signed-in") {
    return <p className="p-6 text-muted">Loading…</p>;
  }

  return <>{children}</>;
}
