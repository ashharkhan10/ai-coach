/**
 * Shared types that every exercise detector follows.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

/** What a detector reports after looking at one camera frame. */
export type ExerciseResult = {
  reps: number;
  /** Numbers shown to the user, e.g. { "Knee angle": 92 } */
  angles: Record<string, number>;
  /** Short form status, e.g. "GOOD DEPTH" */
  status: string;
};

/** Every exercise (squat, push-up, ...) must have these two functions. */
export interface ExerciseDetector {
  process(landmarks: NormalizedLandmark[]): ExerciseResult;
  reset(): void;
}
