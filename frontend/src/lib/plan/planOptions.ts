/**
 * The choices a user makes before the AI creates their weekly plan.
 */
import { EXERCISES, type ExerciseId } from "@/lib/exercises";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];
export type Level = "beginner" | "intermediate" | "advanced";
export type SessionMinutes = 10 | 20 | 30;

/** How the week is divided up. "auto" lets the AI decide. */
export type Split =
  | "auto"
  | "full_body"
  | "upper_lower"
  | "push_pull_legs"
  | "ppl_upper_lower"
  | "full_body_upper_lower";

export const SPLITS: { value: Split; label: string; description: string }[] = [
  { value: "auto", label: "Let AI choose", description: "The coach picks the best split for your days and goal." },
  { value: "full_body", label: "Full body", description: "Every session works your whole body." },
  {
    value: "upper_lower",
    label: "Upper / Lower",
    description: "Upper days (push-ups, press, curls) alternate with leg days (squats, lunges).",
  },
  {
    value: "push_pull_legs",
    label: "Push / Pull / Legs",
    description: "Push (push-ups, press) → Pull (curls) → Legs (squats, lunges), then repeat.",
  },
  {
    value: "ppl_upper_lower",
    label: "PPL + Upper / Lower",
    description: "A 5-day hybrid: Push, Pull, Legs, then Upper and Lower.",
  },
  {
    value: "full_body_upper_lower",
    label: "Full body + Upper / Lower",
    description: "Mixes full-body days with upper and lower days.",
  },
];

export type PlanOptions = {
  weekdays: Weekday[];
  level: Level;
  split: Split;
  exercises: ExerciseId[];
  minutes: SessionMinutes;
};

export const MIN_DAYS = 2;
export const MAX_DAYS = 6;

export const DEFAULT_OPTIONS: PlanOptions = {
  weekdays: ["Monday", "Wednesday", "Friday"],
  level: "beginner",
  split: "auto",
  exercises: EXERCISES.map((e) => e.id),
  minutes: 20,
};

/** Adds the item if it's missing, removes it if it's there. */
export function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/** Keeps weekdays in calendar order (Monday first). */
export function sortWeekdays(days: Weekday[]): Weekday[] {
  return [...days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
}

/** A short reason the form can't be sent yet, or null if it's ready. */
export function problemWith(options: PlanOptions): string | null {
  if (options.weekdays.length < MIN_DAYS) return `Pick at least ${MIN_DAYS} training days.`;
  if (options.weekdays.length > MAX_DAYS) return `Pick at most ${MAX_DAYS} days — keep one for rest.`;
  if (options.exercises.length === 0) return "Pick at least one exercise.";
  return null;
}
