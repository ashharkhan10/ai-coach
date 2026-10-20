/**
 * Body landmark numbers used by MediaPipe Pose.
 *
 * MediaPipe finds 33 points on the body. Each point has a fixed number.
 * Instead of writing "25" in our code, we write LANDMARK.LEFT_KNEE.
 */
export const LANDMARK = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

/**
 * Which points are joined by a line when we draw the skeleton.
 * Each pair is [start point, end point].
 */
export const SKELETON_LINES: [number, number][] = [
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [11, 23], [12, 24], [23, 24], // body
  [23, 25], [25, 27], // left leg
  [24, 26], [26, 28], // right leg
];
