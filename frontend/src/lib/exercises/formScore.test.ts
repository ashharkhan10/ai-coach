import { describe, expect, it } from "vitest";
import { FormScore } from "./formScore";

describe("FormScore", () => {
  it("starts at 100 before any frames", () => {
    expect(new FormScore().value).toBe(100);
  });

  it("is 100 when every frame has good form", () => {
    const score = new FormScore();
    score.record(null);
    score.record(null);
    expect(score.value).toBe(100);
  });

  it("is 50 when half the frames have a problem", () => {
    const score = new FormScore();
    score.record(null);
    score.record("Leaning forward");
    expect(score.value).toBe(50);
  });

  it("remembers the most common issue", () => {
    const score = new FormScore();
    score.record("Leaning forward");
    score.record("Hips sagging");
    score.record("Leaning forward");
    expect(score.mainIssue).toBe("Leaning forward");
  });

  it("has no main issue when form is always good", () => {
    const score = new FormScore();
    score.record(null);
    expect(score.mainIssue).toBeNull();
  });

  it("goes back to 100 after reset", () => {
    const score = new FormScore();
    score.record("Leaning forward");
    score.reset();
    expect(score.value).toBe(100);
  });
});
