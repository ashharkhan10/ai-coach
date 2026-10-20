import { describe, expect, it } from "vitest";
import { DEFAULT_PLAN, LIMITS, buildSessionUrl, parsePlan } from "./plan";

describe("parsePlan", () => {
  it("reads a valid plan from the address", () => {
    expect(parsePlan({ exercise: "pushup", sets: "4", reps: "12" })).toEqual({
      exerciseId: "pushup",
      sets: 4,
      repsPerSet: 12,
    });
  });

  it("uses defaults when values are missing", () => {
    expect(parsePlan({})).toEqual(DEFAULT_PLAN);
  });

  it("ignores an unknown exercise", () => {
    expect(parsePlan({ exercise: "jumping-jacks" }).exerciseId).toBe(DEFAULT_PLAN.exerciseId);
  });

  it("keeps numbers inside the allowed limits", () => {
    const plan = parsePlan({ sets: "999", reps: "0" });
    expect(plan.sets).toBe(LIMITS.sets.max);
    expect(plan.repsPerSet).toBe(LIMITS.reps.min);
  });
});

describe("buildSessionUrl", () => {
  it("puts the plan in the address", () => {
    expect(buildSessionUrl({ exerciseId: "lunge", sets: 2, repsPerSet: 8 })).toBe(
      "/session?exercise=lunge&sets=2&reps=8",
    );
  });
});
