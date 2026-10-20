/**
 * useSaveWorkout — saves a finished workout once, as soon as it's shown.
 *
 * Returns the save status, any badges just unlocked, and a retry function.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saveWorkout, type Badge } from "@/lib/api/workouts";
import type { WorkoutState } from "@/lib/workout/workoutState";

export type SaveStatus = "saving" | "saved" | "error" | "nothing-to-save";

export function useSaveWorkout(workout: WorkoutState) {
  const { token } = useAuth();
  const hasSets = workout.completedSets.length > 0;

  const [status, setStatus] = useState<SaveStatus>(hasSets ? "saving" : "nothing-to-save");
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Stops the workout being saved twice (React can run effects twice in development).
  const startedSaving = useRef(false);

  const save = useCallback(async () => {
    if (!token || !hasSets) return;
    setStatus("saving");
    try {
      const response = await saveWorkout(token, workout);
      setNewBadges(response.new_badges);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [token, hasSets, workout]);

  useEffect(() => {
    if (startedSaving.current) return;
    startedSaving.current = true;
    save();
  }, [save]);

  return { status, newBadges, retry: save };
}
