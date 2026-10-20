/**
 * useWorkout — runs the workout clock: sets, rest timer and total time.
 *
 * It checks the latest rep count 5 times a second and moves the
 * workout forward (finish set → rest → next set → complete).
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExerciseDetector, ExerciseResult } from "@/lib/exercises/types";
import type { WorkoutPlan } from "@/lib/workout/plan";
import {
  advance,
  endWorkout,
  skipRest,
  startWorkout,
  type LiveNumbers,
  type WorkoutState,
} from "@/lib/workout/workoutState";

const CHECK_EVERY_MS = 200;

export function useWorkout(
  plan: WorkoutPlan,
  result: ExerciseResult | null,
  detector: ExerciseDetector,
) {
  const [state, setState] = useState(() => startWorkout(plan, Date.now()));
  const [now, setNow] = useState(() => Date.now());

  // Refs hold the latest values for the timer to read.
  const stateRef = useRef(state);
  const liveRef = useRef<LiveNumbers>({ totalReps: 0, formScore: 100 });
  const detectorRef = useRef(detector);

  useEffect(() => {
    liveRef.current = { totalReps: result?.reps ?? 0, formScore: result?.formScore ?? 100 };
  }, [result]);

  useEffect(() => {
    detectorRef.current = detector;
  }, [detector]);

  /** Saves a new state. When a new set starts, the form score restarts. */
  const apply = useCallback((next: WorkoutState) => {
    const previous = stateRef.current;
    if (next === previous) return;

    stateRef.current = next;
    setState(next);

    if (next.currentSet !== previous.currentSet) {
      detectorRef.current.startSet();
    }
  }, []);

  // The workout clock.
  useEffect(() => {
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      apply(advance(stateRef.current, liveRef.current, time));
    }, CHECK_EVERY_MS);

    return () => clearInterval(timer);
  }, [apply]);

  const handleSkipRest = useCallback(
    () => apply(skipRest(stateRef.current, liveRef.current, Date.now())),
    [apply],
  );

  const handleEndWorkout = useCallback(
    () => apply(endWorkout(stateRef.current, liveRef.current, Date.now())),
    [apply],
  );

  return { state, now, skipRest: handleSkipRest, endWorkout: handleEndWorkout };
}
