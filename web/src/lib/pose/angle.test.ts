import { describe, expect, it } from "vitest";
import { angleFromVertical, calculateAngle, midpoint } from "./angle";

describe("calculateAngle", () => {
  it("gives 180° for three points in a straight line", () => {
    expect(calculateAngle({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 })).toBeCloseTo(180);
  });

  it("gives 90° for a right angle", () => {
    expect(calculateAngle({ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(90);
  });

  it("gives 0 when two points are in the same place", () => {
    expect(calculateAngle({ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 2 })).toBe(0);
  });
});

describe("angleFromVertical", () => {
  it("gives 0° for an upright body", () => {
    expect(angleFromVertical({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.6 })).toBeCloseTo(0);
  });

  it("gives 45° for a body leaning halfway over", () => {
    expect(angleFromVertical({ x: 0.6, y: 0.4 }, { x: 0.5, y: 0.5 })).toBeCloseTo(45);
  });
});

describe("midpoint", () => {
  it("finds the point halfway between two points", () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 1, y: 2 })).toEqual({ x: 0.5, y: 1 });
  });
});
