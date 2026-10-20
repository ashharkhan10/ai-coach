/**
 * Biceps curl detector. Face the camera.
 *
 * Rep:   elbow angle below 50° (curled up) → above 160° (arm down) = 1 rep
 * Form:  body should stay still (no swinging)
 *        elbow should stay close to the body
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { angleFromVertical, calculateAngle, midpoint } from "../pose/angle";
import { areVisible, pickVisibleSide } from "../pose/bodySide";
import { LANDMARK } from "../pose/landmarks";
import { FormScore } from "./formScore";
import { RepCounter } from "./repCounter";
import type { ExerciseDetector, ExerciseResult } from "./types";

const UP_ANGLE = 50;
const DOWN_ANGLE = 160;
const MAX_SWING = 15; // degrees the torso can lean
const MAX_ELBOW_DRIFT = 0.06; // how far the elbow can move away from the shoulder line

export class BicepsCurlDetector implements ExerciseDetector {
  private counter = new RepCounter({ turnAt: UP_ANGLE, finishAt: DOWN_ANGLE });
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
    const [shoulder, elbow, wrist] = [side.shoulder, side.elbow, side.wrist].map(
      (i) => landmarks[i],
    );

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);

    // Torso lean: line from middle of hips up to middle of shoulders.
    const shoulderMid = midpoint(landmarks[LANDMARK.LEFT_SHOULDER], landmarks[LANDMARK.RIGHT_SHOULDER]);
    const hipMid = midpoint(landmarks[LANDMARK.LEFT_HIP], landmarks[LANDMARK.RIGHT_HIP]);
    const torsoLean = angleFromVertical(shoulderMid, hipMid);

    const angles = { "Elbow angle": Math.round(elbowAngle), "Torso lean": Math.round(torsoLean) };

    if (!areVisible(landmarks, [side.shoulder, side.elbow, side.wrist])) {
      return this.result(angles, "SHOW YOUR ARM", null);
    }

    this.counter.update(elbowAngle);

    const elbowDrift = Math.abs(elbow.x - shoulder.x);

    let issue: string | null = null;
    let status = "GOOD FORM";

    if (torsoLean > MAX_SWING) {
      issue = "Keep your body still — don't swing.";
      status = "SWINGING";
    } else if (elbowDrift > MAX_ELBOW_DRIFT) {
      issue = "Keep your elbow pinned to your side.";
      status = "ELBOW DRIFTING";
    }

    this.form.record(issue);
    return this.result(angles, status, issue);
  }

  private result(angles: Record<string, number>, status: string, issue: string | null): ExerciseResult {
    return { reps: this.counter.count, angles, status, issue, formScore: this.form.value };
  }
}
