import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { describe, expect, it } from "vitest";
import { LANDMARK } from "../pose/landmarks";
import { SquatDetector } from "./squat";

/**
 * Builds a fake body (33 points) with the chosen knee angle.
 * Hip, knee and ankle are placed so hip → knee → ankle = kneeAngle.
 * `leanForward` moves the shoulders forward to fake bad form.
 */
function fakeBody(kneeAngle: number, leanForward = false): NormalizedLandmark[] {
  const body: NormalizedLandmark[] = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
    visibility: 1,
  }));

  const radians = (kneeAngle * Math.PI) / 180;
  const hip = { x: 0.5, y: 0.5 };
  const knee = { x: 0.5, y: 0.7 };
  const ankle = { x: knee.x + 0.2 * Math.sin(radians), y: knee.y - 0.2 * Math.cos(radians) };
  const shoulder = leanForward ? { x: 0.8, y: 0.35 } : { x: 0.5, y: 0.2 };

  const place = (index: number, point: { x: number; y: number }) => {
    body[index] = { ...point, z: 0, visibility: 1 };
  };

  // Same position for both sides of the body.
  place(LANDMARK.LEFT_SHOULDER, shoulder);
  place(LANDMARK.RIGHT_SHOULDER, shoulder);
  place(LANDMARK.LEFT_HIP, hip);
  place(LANDMARK.RIGHT_HIP, hip);
  place(LANDMARK.LEFT_KNEE, knee);
  place(LANDMARK.RIGHT_KNEE, knee);
  place(LANDMARK.LEFT_ANKLE, ankle);
  place(LANDMARK.RIGHT_ANKLE, ankle);

  return body;
}

describe("SquatDetector", () => {
  it("measures the knee angle", () => {
    const result = new SquatDetector().process(fakeBody(120));
    expect(result.angles["Knee angle"]).toBe(120);
  });

  it("counts one rep for stand → squat → stand", () => {
    const squat = new SquatDetector();
    squat.process(fakeBody(175));
    squat.process(fakeBody(90));
    const result = squat.process(fakeBody(175));
    expect(result.reps).toBe(1);
  });

  it("says GOOD DEPTH at the bottom of a deep squat", () => {
    const result = new SquatDetector().process(fakeBody(90));
    expect(result.status).toBe("GOOD DEPTH");
  });

  it("reports no issue with an upright back", () => {
    const result = new SquatDetector().process(fakeBody(90));
    expect(result.issue).toBeNull();
    expect(result.formScore).toBe(100);
  });

  it("warns when leaning too far forward", () => {
    const result = new SquatDetector().process(fakeBody(90, true));
    expect(result.issue).not.toBeNull();
    expect(result.formScore).toBe(0);
  });

  it("restarts the form score for a new set, but keeps the reps", () => {
    const squat = new SquatDetector();
    squat.process(fakeBody(175));
    squat.process(fakeBody(90, true));
    squat.process(fakeBody(175));
    squat.startSet();
    const result = squat.process(fakeBody(175));
    expect(result.reps).toBe(1);
    expect(result.formScore).toBe(100);
  });
});
