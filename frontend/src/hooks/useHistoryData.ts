/**
 * useHistoryData — loads everything the history page needs, all at once:
 * stats (numbers + charts), recent workouts and badges.
 */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getBadges,
  getStats,
  getWorkouts,
  type Badge,
  type SavedWorkout,
  type Stats,
} from "@/lib/api/workouts";

type HistoryData = {
  stats: Stats;
  workouts: SavedWorkout[];
  badges: Badge[];
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: HistoryData };

export function useHistoryData(): State {
  const { token } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load(authToken: string) {
      try {
        const [stats, workouts, badges] = await Promise.all([
          getStats(authToken),
          getWorkouts(authToken),
          getBadges(authToken),
        ]);
        if (!cancelled) setState({ status: "ready", data: { stats, workouts, badges } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load your history.";
        if (!cancelled) setState({ status: "error", message });
      }
    }

    load(token);
    return () => {
      cancelled = true;
    };
  }, [token]);

  return state;
}
