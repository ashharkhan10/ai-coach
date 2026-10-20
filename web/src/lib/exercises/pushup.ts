/**
 * Push-up detector. Works best with the camera at your side.
 *
 * Rep:   elbow angle below 90° (down) → above 160° (up) = 1 rep
 * Form:  body should be a straight line (shoulder → hip → ankle)
 *        hips should not sag down or pike up
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle } from "../pose/angle";
import { areVisible, pickVisibleSide } from "../pose/bodySide";
import { FormScore } from "./formScore";
import { RepCounter } from "./repCounter";
import type { ExerciseDetector, ExerciseResult } from "./types";

const DOWN_ANGLE = 90;
const UP_ANGLE = 160;
const MIN_BODY_ANGLE = 150; // below this the body is bent
const HIP_TOLERANCE = 0.08; // how far hips can move off the straight line

export class PushUpDetector implements ExerciseDetector {
  private counter = new RepCounter({ turnAt: DOWN_ANGLE, finishAt: UP_ANGLE });
  private form = new FormScore();

  reset() {
    this.counter.reset();
    this.form.reset();
  }

  startSet() {
    this.form.reset();
  }

  process(landmarks: NormalizedLandmark[]): ExerciseResult {
    const side = pickVisibleSide(landmarks, "elbow");
    const [shoulder, elbow, wrist, hip, ankle] = [
      side.shoulder, side.elbow, side.wrist, side.hip, side.ankle,
    ].map((i) => landmarks[i]);

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);
    const bodyAngle = calculateAngle(shoulder, hip, ankle);
    const angles = { "Elbow angle": Math.round(elbowAngle), "Body line": Math.round(bodyAngle) };

    if (!areVisible(landmarks, [side.shoulder, side.elbow, side.wrist, side.hip])) {
      return this.result(angles, "TURN SIDEWAYS", null);
    }

    this.counter.update(elbowAngle);

    // Where the hip SHOULD be if the body were straight: halfway between shoulder and ankle.
    // On screen, y grows downward, so a positive gap means the hip is too low.
    const hipGap = hip.y - (shoulder.y + ankle.y) / 2;

    let issue: string | null = null;
    let status = "GOOD FORM";

    if (hipGap > HIP_TOLERANCE) {
      issue = "Your hips are sagging — tighten your core.";
      status = "HIPS SAGGING";
    } else if (hipGap < -HIP_TOLERANCE) {
      issue = "Lower your hips so your body makes a straight line.";
      status = "HIPS TOO HIGH";
    } else if (bodyAngle < MIN_BODY_ANGLE) {
      issue = "Keep your body in one straight line.";
      status = "BODY BENT";
    }

    this.form.record(issue);
    return this.result(angles, status, issue);
  }

  private result(angles: Record<string, number>, status: string, issue: string | null): ExerciseResult {
    return { reps: this.counter.count, angles, status, issue, formScore: this.form.value };
  }
}
