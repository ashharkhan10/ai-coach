/**
 * Squat detector.
 *
 * Rep:   knee angle below 100° (down) → above 160° (up) = 1 rep
 * Form:  back angle below 130° = leaning too far forward
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle } from "../pose/angle";
import { areVisible, pickVisibleSide } from "../pose/bodySide";
import { FormScore } from "./formScore";
import { RepCounter } from "./repCounter";
import type { ExerciseDetector, ExerciseResult } from "./types";

const DOWN_ANGLE = 100;
const UP_ANGLE = 160;
const MIN_BACK_ANGLE = 130;

export class SquatDetector implements ExerciseDetector {
  private counter = new RepCounter({ turnAt: DOWN_ANGLE, finishAt: UP_ANGLE });
  private form = new FormScore();

  reset() {
    this.counter.reset();
    this.form.reset();
  }

  process(landmarks: NormalizedLandmark[]): ExerciseResult {
    const side = pickVisibleSide(landmarks, "knee");
    const [shoulder, hip, knee, ankle] = [side.shoulder, side.hip, side.knee, side.ankle].map(
      (i) => landmarks[i],
    );

    const kneeAngle = calculateAngle(hip, knee, ankle);
    const backAngle = calculateAngle(shoulder, hip, knee);
    const angles = { "Knee angle": Math.round(kneeAngle), "Back angle": Math.round(backAngle) };

    if (!areVisible(landmarks, [side.hip, side.knee, side.ankle])) {
      return this.result(angles, "SHOW YOUR LEGS", null);
    }

    this.counter.update(kneeAngle);

    const issue =
      backAngle < MIN_BACK_ANGLE ? "Keep your chest up — you're leaning too far forward." : null;
    this.form.record(issue);

    return this.result(angles, this.depthLabel(kneeAngle), issue);
  }

  private depthLabel(kneeAngle: number): string {
    if (kneeAngle <= DOWN_ANGLE) return "GOOD DEPTH";
    if (kneeAngle < UP_ANGLE) return this.counter.isMidRep() ? "STAND UP" : "GO LOWER";
    return "STANDING";
  }

  private result(angles: Record<string, number>, status: string, issue: string | null): ExerciseResult {
    return { reps: this.counter.count, angles, status, issue, formScore: this.form.value };
  }
}
