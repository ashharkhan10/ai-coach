/**
 * Shared types that every exercise detector follows.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

/** What a detector reports after looking at one camera frame. */
export type ExerciseResult = {
  reps: number;
  /** Numbers shown to the user, e.g. { "Knee angle": 92 } */
  angles: Record<string, number>;
  /** Short label shown on the camera, e.g. "GOOD DEPTH" */
  status: string;
  /** A form problem in plain words, or null if form is good. Used by the coach. */
  issue: string | null;
  /** 0–100, how clean the form has been in the current set. */
  formScore: number;
  /** The most common form problem in the current set, or null. */
  mainIssue: string | null;
};

/** Every exercise (squat, push-up, ...) must have these functions. */
export interface ExerciseDetector {
  /** Looks at one camera frame and returns the latest numbers. */
  process(landmarks: NormalizedLandmark[]): ExerciseResult;
  /** Called when a new set begins: restarts the form score for that set. */
  startSet(): void;
  /** Clears everything (reps and form score). */
  reset(): void;
}
