/**
 * The list of all exercises the app supports.
 *
 * To add a new exercise: write its detector file, then add one line here.
 */
import { BicepsCurlDetector } from "./bicepsCurl";
import { LungeDetector } from "./lunge";
import { PushUpDetector } from "./pushup";
import { ShoulderPressDetector } from "./shoulderPress";
import { SquatDetector } from "./squat";
import type { ExerciseDetector } from "./types";

export type ExerciseId = "squat" | "pushup" | "curl" | "press" | "lunge";

export type Exercise = {
  id: ExerciseId;
  name: string;
  /** Short tip on how to stand in front of the camera. */
  cameraTip: string;
  createDetector: () => ExerciseDetector;
};

export const EXERCISES: Exercise[] = [
  {
    id: "squat",
    name: "Squats",
    cameraTip: "Stand sideways so your whole body is visible.",
    createDetector: () => new SquatDetector(),
  },
  {
    id: "pushup",
    name: "Push-ups",
    cameraTip: "Put the camera at your side, at floor level.",
    createDetector: () => new PushUpDetector(),
  },
  {
    id: "curl",
    name: "Biceps curls",
    cameraTip: "Face the camera with your upper body in view.",
    createDetector: () => new BicepsCurlDetector(),
  },
  {
    id: "press",
    name: "Shoulder press",
    cameraTip: "Stand sideways with arms and hips in view.",
    createDetector: () => new ShoulderPressDetector(),
  },
  {
    id: "lunge",
    name: "Lunges",
    cameraTip: "Stand sideways so both legs are visible.",
    createDetector: () => new LungeDetector(),
  },
];

export function getExercise(id: ExerciseId): Exercise {
  return EXERCISES.find((e) => e.id === id) ?? EXERCISES[0];
}
