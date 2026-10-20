/**
 * Backend calls for workouts, stats and badges.
 */
import type { WorkoutState } from "@/lib/workout/workoutState";
import { apiRequest } from "./client";

export type SavedSet = {
  set_number: number;
  reps: number;
  duration_sec: number;
  form_score: number;
  main_issue: string | null;
};

export type SavedWorkout = {
  id: number;
  exercise: string;
  target_sets: number;
  target_reps: number;
  started_at: string;
  ended_at: string;
  total_reps: number;
  duration_sec: number;
  sets: SavedSet[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  earned_at: string | null;
};

export type DayProgress = {
  day: string; // "2026-10-20"
  reps: number;
  avg_form: number | null;
};

export type Stats = {
  week_reps: number;
  week_sets: number;
  week_minutes: number;
  streak_days: number;
  daily: DayProgress[];
};

/** The browser's time zone offset, so streaks use the user's own days. */
function timezoneOffset(): number {
  return new Date().getTimezoneOffset();
}

/** Saves a finished workout. Returns the saved workout and any new badges. */
export function saveWorkout(token: string, workout: WorkoutState) {
  return apiRequest<{ workout: SavedWorkout; new_badges: Badge[] }>("/workouts", {
    method: "POST",
    token,
    body: {
      exercise: workout.plan.exerciseId,
      target_sets: workout.plan.sets,
      target_reps: workout.plan.repsPerSet,
      started_at: new Date(workout.startedAt).toISOString(),
      ended_at: new Date(workout.endedAt ?? workout.startedAt).toISOString(),
      tz_offset_minutes: timezoneOffset(),
      sets: workout.completedSets.map((set) => ({
        set_number: set.setNumber,
        reps: set.reps,
        duration_sec: set.durationSec,
        form_score: set.formScore,
        main_issue: set.mainIssue,
      })),
    },
  });
}

export function getWorkouts(token: string, limit = 20) {
  return apiRequest<SavedWorkout[]>(`/workouts?limit=${limit}`, { token });
}

export function getStats(token: string) {
  return apiRequest<Stats>(`/stats?tz_offset_minutes=${timezoneOffset()}`, { token });
}

export function getBadges(token: string) {
  return apiRequest<Badge[]>("/badges", { token });
}
