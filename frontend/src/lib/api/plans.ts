/**
 * Backend calls for AI weekly workout plans.
 */
import type { ExerciseId } from "@/lib/exercises";
import type { PlanOptions } from "@/lib/plan/planOptions";
import { apiRequest } from "./client";

export type PlannedExercise = {
  exercise: ExerciseId;
  sets: number;
  reps: number;
};

export type PlanDay = {
  day: string; // "Monday"
  focus: string; // "Lower body"
  exercises: PlannedExercise[];
};

export type WeeklyPlan = {
  id: number;
  created_at: string;
  plan: {
    title: string;
    summary: string;
    days: PlanDay[];
    tip: string;
  };
  /** The choices used to make this plan (null for older plans). */
  options: PlanOptions | null;
};

export function getLatestPlan(token: string) {
  return apiRequest<WeeklyPlan | null>("/plans/latest", { token });
}

export function generatePlan(token: string, options: PlanOptions) {
  return apiRequest<WeeklyPlan>("/plans/generate", { method: "POST", token, body: options });
}
