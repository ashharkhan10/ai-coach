/**
 * Helpers to pick the body side the camera sees best,
 * and to check whether body points are clearly visible.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { LANDMARK } from "./landmarks";

/** Points below this visibility (0–1) are treated as "not seen". */
export const MIN_VISIBILITY = 0.6;

/** The landmark numbers for one side of the body. */
export type BodySide = {
  shoulder: number;
  elbow: number;
  wrist: number;
  hip: number;
  knee: number;
  ankle: number;
};

const LEFT_SIDE: BodySide = {
  shoulder: LANDMARK.LEFT_SHOULDER,
  elbow: LANDMARK.LEFT_ELBOW,
  wrist: LANDMARK.LEFT_WRIST,
  hip: LANDMARK.LEFT_HIP,
  knee: LANDMARK.LEFT_KNEE,
  ankle: LANDMARK.LEFT_ANKLE,
};

const RIGHT_SIDE: BodySide = {
  shoulder: LANDMARK.RIGHT_SHOULDER,
  elbow: LANDMARK.RIGHT_ELBOW,
  wrist: LANDMARK.RIGHT_WRIST,
  hip: LANDMARK.RIGHT_HIP,
  knee: LANDMARK.RIGHT_KNEE,
  ankle: LANDMARK.RIGHT_ANKLE,
};

/**
 * Picks the left or right side, whichever has the more visible joint.
 * Use "knee" for leg exercises and "elbow" for arm exercises.
 */
export function pickVisibleSide(
  landmarks: NormalizedLandmark[],
  joint: "knee" | "elbow",
): BodySide {
  const left = landmarks[LEFT_SIDE[joint]].visibility;
  const right = landmarks[RIGHT_SIDE[joint]].visibility;
  return left >= right ? LEFT_SIDE : RIGHT_SIDE;
}

/** The other side of the body. */
export function oppositeSide(side: BodySide): BodySide {
  return side === LEFT_SIDE ? RIGHT_SIDE : LEFT_SIDE;
}

/** True if every listed point is clearly visible to the camera. */
export function areVisible(landmarks: NormalizedLandmark[], indexes: number[]): boolean {
  return indexes.every((i) => landmarks[i].visibility >= MIN_VISIBILITY);
}
