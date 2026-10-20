/**
 * useWeeklyPlan — loads the user's latest AI plan, and makes a new one
 * from the options the user picked.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { generatePlan, getLatestPlan, type WeeklyPlan } from "@/lib/api/plans";
import type { PlanOptions } from "@/lib/plan/planOptions";

export function useWeeklyPlan() {
  const { token } = useAuth();

  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the latest plan when the page opens.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getLatestPlan(token)
      .then((latest) => {
        if (!cancelled) setPlan(latest);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your plan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const makeNewPlan = useCallback(async (options: PlanOptions) => {
    if (!token) return;
    setGenerating(true);
    setError(null);
    try {
      setPlan(await generatePlan(token, options));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not make a plan.");
    } finally {
      setGenerating(false);
    }
  }, [token]);

  return { plan, loading, generating, error, makeNewPlan };
}
