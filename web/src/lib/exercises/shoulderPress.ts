/**
 * Shoulder press detector.
 *
 * Rep:   elbow angle above 160° (arms up) → below 90° (back down) = 1 rep
 * Form:  lower back should not arch (shoulder → hip → knee stays straight)
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle } from "../pose/angle";
import { areVisible, pickVisibleSide } from "../pose/bodySide";
import { FormScore } from "./formScore";
import { RepCounter } from "./repCounter";
import type { ExerciseDetector, ExerciseResult } from "./types";

const UP_ANGLE = 160;
const DOWN_ANGLE = 90;
const MIN_BACK_ANGLE = 150; // below this the lower back is arching

export class ShoulderPressDetector implements ExerciseDetector {
  private counter = new RepCounter({ turnAt: UP_ANGLE, finishAt: DOWN_ANGLE });
  private form = new FormScore();

  reset() {
    this.counter.reset();
    this.form.reset();
  }

  process(landmarks: NormalizedLandmark[]): ExerciseResult {
    const side = pickVisibleSide(landmarks, "elbow");
    const [shoulder, elbow, wrist, hip, knee] = [
      side.shoulder, side.elbow, side.wrist, side.hip, side.knee,
    ].map((i) => landmarks[i]);

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);
    const backAngle = calculateAngle(shoulder, hip, knee);
    const angles = { "Elbow angle": Math.round(elbowAngle), "Back angle": Math.round(backAngle) };

    if (!areVisible(landmarks, [side.shoulder, side.elbow, side.wrist])) {
      return this.result(angles, "SHOW YOUR ARMS", null);
    }

    this.counter.update(elbowAngle);

    const issue =
      backAngle < MIN_BACK_ANGLE ? "Don't arch your lower back — brace your core." : null;
    this.form.record(issue);

    const status = issue ? "BACK ARCHING" : this.extensionLabel(elbowAngle);
    return this.result(angles, status, issue);
  }

  private extensionLabel(elbowAngle: number): string {
    if (elbowAngle >= UP_ANGLE) return "FULL EXTENSION";
    if (elbowAngle >= DOWN_ANGLE) return "PRESSING";
    return "START POSITION";
  }

  private result(angles: Record<string, number>, status: string, issue: string | null): ExerciseResult {
    return { reps: this.counter.count, angles, status, issue, formScore: this.form.value };
  }
}
