/**
 * useVoiceCoach — the AI coach that talks during a workout.
 *
 * It speaks at four moments:
 *   1. the workout starts
 *   2. a form problem lasts a moment (with a pause between corrections)
 *   3. a set is finished
 *   4. the workout is finished
 *
 * Each line comes from the AI (backend). If that fails, a simple
 * built-in line is used, so the coach never goes silent.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCoachLine, type CoachRequest } from "@/lib/api/coach";
import { shouldSpeakIssue } from "@/lib/coach/coachTiming";
import { loadMuted, saveMuted } from "@/lib/coach/muteSetting";
import { isSpeaking, speak, stopSpeaking } from "@/lib/coach/speech";
import type { ExerciseResult } from "@/lib/exercises/types";
import type { WorkoutState } from "@/lib/workout/workoutState";

type Options = {
  state: WorkoutState;
  result: ExerciseResult | null;
  /** The workout clock's current time (updates 5 times a second). */
  now: number;
};

export function useVoiceCoach({ state, result, now }: Options) {
  const { token } = useAuth();
  const { plan } = state;

  const [muted, setMuted] = useState(loadMuted);
  const [caption, setCaption] = useState<string | null>(null);

  const mutedRef = useRef(muted);
  const lastSpokenAt = useRef(0);
  const waitingForAI = useRef(false);
  const currentIssue = useRef<string | null>(null);
  const issueStartedAt = useRef<number | null>(null);
  const saidStart = useRef(false);
  const saidFinish = useRef(false);
  const setsAnnounced = useRef(0);

  /** Gets a line from the AI, shows it, and says it (unless muted). */
  const say = useCallback(
    async (request: CoachRequest, fallback: string) => {
      if (!token) return;
      waitingForAI.current = true;
      lastSpokenAt.current = Date.now();

      let text = fallback;
      try {
        text = await getCoachLine(token, request);
      } catch {
        // keep the fallback line
      }

      waitingForAI.current = false;
      setCaption(text);
      if (!mutedRef.current) speak(text);
    },
    [token],
  );

  // 1. Workout starts
  useEffect(() => {
    if (saidStart.current) return;
    saidStart.current = true;
    say({ event: "workout_started", exercise: plan.exerciseId, total_sets: plan.sets }, "Let's go!");
  }, [say, plan]);

  // 3 + 4. A set or the whole workout is finished
  useEffect(() => {
    const sets = state.completedSets;

    if (state.phase === "complete") {
      if (saidFinish.current) return;
      saidFinish.current = true;
      const reps = sets.reduce((sum, s) => sum + s.reps, 0);
      const avgForm = sets.length ? Math.round(sets.reduce((sum, s) => sum + s.formScore, 0) / sets.length) : 0;
      say(
        { event: "workout_completed", exercise: plan.exerciseId, reps, form_score: avgForm },
        "Workout complete. Great job today!",
      );
      return;
    }

    if (sets.length > setsAnnounced.current) {
      setsAnnounced.current = sets.length;
      const last = sets[sets.length - 1];
      say(
        {
          event: "set_completed",
          exercise: plan.exerciseId,
          set_number: last.setNumber,
          total_sets: plan.sets,
          form_score: last.formScore,
          issue: last.mainIssue,
        },
        `Set ${last.setNumber} done. Great work!`,
      );
    }
  }, [state.phase, state.completedSets, plan, say]);

  // 2. Form problems during a set
  useEffect(() => {
    const issue = result?.issue ?? null;

    // Note when a new problem starts (or ends).
    if (issue !== currentIssue.current) {
      currentIssue.current = issue;
      issueStartedAt.current = issue ? now : null;
    }

    if (state.phase !== "active" || waitingForAI.current || isSpeaking()) return;

    const timeToSpeak = shouldSpeakIssue({
      issue,
      issueStartedAt: issueStartedAt.current,
      lastSpokenAt: lastSpokenAt.current,
      now,
    });

    if (timeToSpeak && issue) {
      say({ event: "form_issue", exercise: plan.exerciseId, issue }, issue);
    }
  }, [result, now, state.phase, plan, say]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    saveMuted(next);
    if (next) stopSpeaking();
  }, []);

  return { muted, toggleMute, caption };
}
