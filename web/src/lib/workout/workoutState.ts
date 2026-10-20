/**
 * Workout state — tracks sets, rest and time during a session.
 *
 * These are plain functions with no React inside, so they are easy to test.
 * Each function takes the current state and returns the NEW state.
 *
 * The flow:
 *   active (doing reps) → resting (60s) → active (next set) → ... → complete
 */
import { REST_SECONDS, type WorkoutPlan } from "./plan";

export type Phase = "active" | "resting" | "complete";

export type CompletedSet = {
  setNumber: number;
  reps: number;
  durationSec: number;
  formScore: number;
  mainIssue: string | null;
};

export type WorkoutState = {
  plan: WorkoutPlan;
  phase: Phase;
  /** The set being done right now (starts at 1). */
  currentSet: number;
  /** The detector's total rep count when this set began. */
  repsAtSetStart: number;
  setStartedAt: number;
  restEndsAt: number | null;
  startedAt: number;
  endedAt: number | null;
  completedSets: CompletedSet[];
};

/** The live numbers coming from the exercise detector. */
export type LiveNumbers = {
  totalReps: number;
  formScore: number;
  mainIssue: string | null;
};

export function startWorkout(plan: WorkoutPlan, now: number): WorkoutState {
  return {
    plan,
    phase: "active",
    currentSet: 1,
    repsAtSetStart: 0,
    setStartedAt: now,
    restEndsAt: null,
    startedAt: now,
    endedAt: null,
    completedSets: [],
  };
}

/** Call this often (several times a second). Moves the workout forward when needed. */
export function advance(state: WorkoutState, live: LiveNumbers, now: number): WorkoutState {
  const setIsFinished =
    state.phase === "active" &&
    repsInCurrentSet(state, live.totalReps) >= state.plan.repsPerSet;

  if (setIsFinished) {
    return finishSet(state, live, now);
  }

  const restIsOver =
    state.phase === "resting" && state.restEndsAt !== null && now >= state.restEndsAt;

  if (restIsOver) {
    return startNextSet(state, live, now);
  }

  return state;
}

/** The user tapped "Skip rest". */
export function skipRest(state: WorkoutState, live: LiveNumbers, now: number): WorkoutState {
  if (state.phase !== "resting") return state;
  return startNextSet(state, live, now);
}

/** The user tapped "End workout". A half-done set is still saved. */
export function endWorkout(state: WorkoutState, live: LiveNumbers, now: number): WorkoutState {
  if (state.phase === "complete") return state;

  const partialReps = repsInCurrentSet(state, live.totalReps);
  const completedSets =
    partialReps > 0
      ? [...state.completedSets, makeSet(state, partialReps, live, now)]
      : state.completedSets;

  return { ...state, phase: "complete", completedSets, restEndsAt: null, endedAt: now };
}

/** Reps done in the set being done right now (0 while resting). */
export function repsInCurrentSet(state: WorkoutState, totalReps: number): number {
  if (state.phase !== "active") return 0;
  const reps = totalReps - state.repsAtSetStart;
  return Math.min(state.plan.repsPerSet, Math.max(0, reps));
}

/** All reps in the workout so far. */
export function totalRepsDone(state: WorkoutState, totalReps: number): number {
  const finished = state.completedSets.reduce((sum, set) => sum + set.reps, 0);
  return finished + repsInCurrentSet(state, totalReps);
}

export function restSecondsLeft(state: WorkoutState, now: number): number {
  if (state.restEndsAt === null) return 0;
  return Math.max(0, Math.ceil((state.restEndsAt - now) / 1000));
}

export function elapsedSeconds(state: WorkoutState, now: number): number {
  return Math.floor(((state.endedAt ?? now) - state.startedAt) / 1000);
}

// ---------- helpers ----------

function finishSet(state: WorkoutState, live: LiveNumbers, now: number): WorkoutState {
  const finished = makeSet(state, state.plan.repsPerSet, live, now);
  const completedSets = [...state.completedSets, finished];
  const wasLastSet = completedSets.length >= state.plan.sets;

  if (wasLastSet) {
    return { ...state, completedSets, phase: "complete", endedAt: now, restEndsAt: null };
  }

  return { ...state, completedSets, phase: "resting", restEndsAt: now + REST_SECONDS * 1000 };
}

function startNextSet(state: WorkoutState, live: LiveNumbers, now: number): WorkoutState {
  return {
    ...state,
    phase: "active",
    currentSet: state.currentSet + 1,
    // Reps done while resting don't count toward the next set.
    repsAtSetStart: live.totalReps,
    setStartedAt: now,
    restEndsAt: null,
  };
}

function makeSet(state: WorkoutState, reps: number, live: LiveNumbers, now: number): CompletedSet {
  return {
    setNumber: state.currentSet,
    reps,
    durationSec: Math.round((now - state.setStartedAt) / 1000),
    formScore: live.formScore,
    mainIssue: live.mainIssue,
  };
}
