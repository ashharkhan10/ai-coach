/**
 * The workout plan: which exercise, how many sets, how many reps per set.
 *
 * The plan travels in the page address, for example:
 *   /session?exercise=squat&sets=3&reps=10
 */
import { EXERCISES, type ExerciseId } from "../exercises";

/** Seconds of rest between sets. */
export const REST_SECONDS = 60;

export const LIMITS = {
  sets: { min: 1, max: 10 },
  reps: { min: 1, max: 50 },
};

export type WorkoutPlan = {
  exerciseId: ExerciseId;
  sets: number;
  repsPerSet: number;
};

export const DEFAULT_PLAN: WorkoutPlan = {
  exerciseId: "squat",
  sets: 3,
  repsPerSet: 10,
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads the plan from the page address. Bad or missing values fall back to defaults. */
export function parsePlan(params: SearchParams): WorkoutPlan {
  const exercise = firstValue(params.exercise);
  const isKnownExercise = EXERCISES.some((e) => e.id === exercise);

  return {
    exerciseId: isKnownExercise ? (exercise as ExerciseId) : DEFAULT_PLAN.exerciseId,
    sets: readNumber(params.sets, DEFAULT_PLAN.sets, LIMITS.sets.min, LIMITS.sets.max),
    repsPerSet: readNumber(params.reps, DEFAULT_PLAN.repsPerSet, LIMITS.reps.min, LIMITS.reps.max),
  };
}

/** Builds the session page address for a plan. */
export function buildSessionUrl(plan: WorkoutPlan): string {
  return `/session?exercise=${plan.exerciseId}&sets=${plan.sets}&reps=${plan.repsPerSet}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  const number = Number(firstValue(value));
  if (!Number.isInteger(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
