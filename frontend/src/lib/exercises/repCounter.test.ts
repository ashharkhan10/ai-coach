import { describe, expect, it } from "vitest";
import { RepCounter } from "./repCounter";

/** Feeds a list of angles to the counter and returns the final rep count. */
function feed(counter: RepCounter, angles: number[]): number {
  let reps = 0;
  for (const angle of angles) reps = counter.update(angle);
  return reps;
}

describe("RepCounter (bend first, like a squat)", () => {
  it("counts one rep for down then up", () => {
    const counter = new RepCounter({ turnAt: 100, finishAt: 160 });
    expect(feed(counter, [170, 130, 95, 130, 165])).toBe(1);
  });

  it("does not count a half rep that never goes low enough", () => {
    const counter = new RepCounter({ turnAt: 100, finishAt: 160 });
    expect(feed(counter, [170, 120, 110, 170])).toBe(0);
  });

  it("does not count until the user stands back up", () => {
    const counter = new RepCounter({ turnAt: 100, finishAt: 160 });
    expect(feed(counter, [170, 90, 140])).toBe(0);
    expect(counter.isMidRep()).toBe(true);
  });

  it("counts three reps in a row", () => {
    const counter = new RepCounter({ turnAt: 100, finishAt: 160 });
    expect(feed(counter, [170, 90, 170, 90, 170, 90, 170])).toBe(3);
  });
});

describe("RepCounter (extend first, like a shoulder press)", () => {
  it("counts one rep for up then down", () => {
    const counter = new RepCounter({ turnAt: 160, finishAt: 90 });
    expect(feed(counter, [80, 120, 165, 120, 85])).toBe(1);
  });
});

describe("RepCounter.reset", () => {
  it("sets the count back to zero", () => {
    const counter = new RepCounter({ turnAt: 100, finishAt: 160 });
    feed(counter, [170, 90, 170]);
    counter.reset();
    expect(counter.count).toBe(0);
  });
});
