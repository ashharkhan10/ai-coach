import { describe, expect, it } from "vitest";
import { COOLDOWN_MS, ISSUE_HOLD_MS, shouldSpeakIssue } from "./coachTiming";

const NOW = 100_000;

describe("shouldSpeakIssue", () => {
  it("stays quiet when form is good", () => {
    expect(shouldSpeakIssue({ issue: null, issueStartedAt: null, lastSpokenAt: 0, now: NOW })).toBe(false);
  });

  it("ignores a problem that only just appeared", () => {
    const result = shouldSpeakIssue({
      issue: "Chest up",
      issueStartedAt: NOW - 200,
      lastSpokenAt: 0,
      now: NOW,
    });
    expect(result).toBe(false);
  });

  it("speaks when a problem lasts and the coach has rested", () => {
    const result = shouldSpeakIssue({
      issue: "Chest up",
      issueStartedAt: NOW - ISSUE_HOLD_MS,
      lastSpokenAt: NOW - COOLDOWN_MS,
      now: NOW,
    });
    expect(result).toBe(true);
  });

  it("waits if the coach spoke recently", () => {
    const result = shouldSpeakIssue({
      issue: "Chest up",
      issueStartedAt: NOW - 5000,
      lastSpokenAt: NOW - 2000,
      now: NOW,
    });
    expect(result).toBe(false);
  });
});
