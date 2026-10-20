/**
 * Lunge detector.
 *
 * The "front" leg is the one with the more bent knee.
 * Rep:   front knee below 100° (down) → above 160° (up) = 1 rep
 * Form:  shoulders should stay above the hips (balanced)
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle, midpoint } from "../pose/angle";
import { areVisible, oppositeSide, pickVisibleSide, type BodySide } from "../pose/bodySide";
import { LANDMARK } from "../pose/landmarks";
import { FormScore } from "./formScore";
import { RepCounter } from "./repCounter";
import type { ExerciseDetector, ExerciseResult } from "./types";

const DOWN_ANGLE = 100;
const UP_ANGLE = 160;
const MAX_SIDEWAYS_SHIFT = 0.1; // how far shoulders can move off the hips

export class LungeDetector implements ExerciseDetector {
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
    const front = this.pickFrontLeg(landmarks);
    const [shoulder, hip, knee, ankle] = [front.shoulder, front.hip, front.knee, front.ankle].map(
      (i) => landmarks[i],
    );

    const frontKneeAngle = calculateAngle(hip, knee, ankle);
    const torsoAngle = calculateAngle(shoulder, hip, knee);
    const angles = {
      "Front knee": Math.round(frontKneeAngle),
      "Torso angle": Math.round(torsoAngle),
    };

    if (!areVisible(landmarks, [front.hip, front.knee, front.ankle])) {
      return this.result(angles, "SHOW YOUR LEGS", null);
    }

    this.counter.update(frontKneeAngle);

    const shoulderMid = midpoint(landmarks[LANDMARK.LEFT_SHOULDER], landmarks[LANDMARK.RIGHT_SHOULDER]);
    const hipMid = midpoint(landmarks[LANDMARK.LEFT_HIP], landmarks[LANDMARK.RIGHT_HIP]);
    const sidewaysShift = Math.abs(shoulderMid.x - hipMid.x);

    const issue =
      sidewaysShift > MAX_SIDEWAYS_SHIFT ? "Keep your shoulders right above your hips." : null;
    this.form.record(issue);

    return this.result(angles, issue ? "OFF BALANCE" : "BALANCED", issue);
  }

  /** The front leg is the one whose knee is bent more (smaller angle). */
  private pickFrontLeg(landmarks: NormalizedLandmark[]): BodySide {
    const a = pickVisibleSide(landmarks, "knee");
    const b = oppositeSide(a);
    const kneeAngle = (s: BodySide) =>
      calculateAngle(landmarks[s.hip], landmarks[s.knee], landmarks[s.ankle]);
    return kneeAngle(a) <= kneeAngle(b) ? a : b;
  }

  private result(angles: Record<string, number>, status: string, issue: string | null): ExerciseResult {
    return { reps: this.counter.count, angles, status, issue, formScore: this.form.value };
  }
}
