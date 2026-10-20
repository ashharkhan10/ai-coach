/**
 * Squat detector — counts squat reps and checks depth.
 *
 * How a rep is counted:
 *   1. Knee angle goes BELOW 100°  → user is "down"
 *   2. Knee angle goes ABOVE 160° → user is "up" again → +1 rep
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle } from "../pose/angle";
import { LANDMARK } from "../pose/landmarks";
import type { ExerciseDetector, ExerciseResult } from "./types";

const DOWN_ANGLE = 100;
const UP_ANGLE = 160;
const MIN_VISIBILITY = 0.6;

type Stage = "up" | "down" | null;

export class SquatDetector implements ExerciseDetector {
  private reps = 0;
  private stage: Stage = null;

  reset() {
    this.reps = 0;
    this.stage = null;
  }

  process(landmarks: NormalizedLandmark[]): ExerciseResult {
    // Use whichever side of the body the camera sees better.
    const side = this.pickVisibleSide(landmarks);

    const shoulder = landmarks[side.shoulder];
    const hip = landmarks[side.hip];
    const knee = landmarks[side.knee];
    const ankle = landmarks[side.ankle];

    const kneeAngle = calculateAngle(hip, knee, ankle);
    const backAngle = calculateAngle(shoulder, hip, knee);

    const legVisible = [hip, knee, ankle].every((p) => p.visibility >= MIN_VISIBILITY);

    if (legVisible) {
      this.updateRepCount(kneeAngle);
    }

    return {
      reps: this.reps,
      angles: {
        "Knee angle": Math.round(kneeAngle),
        "Back angle": Math.round(backAngle),
      },
      status: legVisible ? this.getDepthStatus(kneeAngle) : "SHOW YOUR LEGS",
    };
  }

  private updateRepCount(kneeAngle: number) {
    if (kneeAngle < DOWN_ANGLE) {
      this.stage = "down";
    }
    if (kneeAngle > UP_ANGLE && this.stage === "down") {
      this.stage = "up";
      this.reps += 1;
    }
  }

  private getDepthStatus(kneeAngle: number): string {
    if (this.stage === "down" && kneeAngle <= DOWN_ANGLE) return "GOOD DEPTH";
    if (kneeAngle < UP_ANGLE) return "GO LOWER";
    return "STANDING";
  }

  private pickVisibleSide(landmarks: NormalizedLandmark[]) {
    const leftScore = landmarks[LANDMARK.LEFT_KNEE].visibility;
    const rightScore = landmarks[LANDMARK.RIGHT_KNEE].visibility;

    return leftScore >= rightScore
      ? {
          shoulder: LANDMARK.LEFT_SHOULDER,
          hip: LANDMARK.LEFT_HIP,
          knee: LANDMARK.LEFT_KNEE,
          ankle: LANDMARK.LEFT_ANKLE,
        }
      : {
          shoulder: LANDMARK.RIGHT_SHOULDER,
          hip: LANDMARK.RIGHT_HIP,
          knee: LANDMARK.RIGHT_KNEE,
          ankle: LANDMARK.RIGHT_ANKLE,
        };
  }
}
