/**
 * Backend call for the live voice coach.
 */
import type { ExerciseId } from "@/lib/exercises";
import { apiRequest } from "./client";

export type CoachEvent = "workout_started" | "form_issue" | "set_completed" | "workout_completed";

export type CoachRequest = {
  event: CoachEvent;
  exercise: ExerciseId;
  issue?: string | null;
  set_number?: number;
  total_sets?: number;
  reps?: number;
  form_score?: number;
};

/** Asks the AI coach for one short line to say out loud. */
export async function getCoachLine(token: string, request: CoachRequest): Promise<string> {
  const reply = await apiRequest<{ text: string }>("/coach/feedback", {
    method: "POST",
    token,
    body: request,
  });
  return reply.text;
}
