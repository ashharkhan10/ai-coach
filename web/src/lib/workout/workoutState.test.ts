import { describe, expect, it } from "vitest";
import { REST_SECONDS, type WorkoutPlan } from "./plan";
import {
  advance,
  endWorkout,
  repsInCurrentSet,
  restSecondsLeft,
  skipRest,
  startWorkout,
  totalRepsDone,
} from "./workoutState";

const plan: WorkoutPlan = { exerciseId: "squat", sets: 2, repsPerSet: 3 };
const START = 1_000_000; // a fake clock time in ms
const live = (totalReps: number, formScore = 90) => ({ totalReps, formScore });

describe("workout flow", () => {
  it("starts on set 1, active", () => {
    const state = startWorkout(plan, START);
    expect(state.phase).toBe("active");
    expect(state.currentSet).toBe(1);
  });

  it("stays active until the set's reps are done", () => {
    const state = advance(startWorkout(plan, START), live(2), START + 5000);
    expect(state.phase).toBe("active");
    expect(repsInCurrentSet(state, 2)).toBe(2);
  });

  it("rests after finishing a set", () => {
    const state = advance(startWorkout(plan, START), live(3), START + 10_000);
    expect(state.phase).toBe("resting");
    expect(state.completedSets).toEqual([
      { setNumber: 1, reps: 3, durationSec: 10, formScore: 90 },
    ]);
    expect(restSecondsLeft(state, START + 10_000)).toBe(REST_SECONDS);
  });

  it("starts the next set when rest is over", () => {
    let state = advance(startWorkout(plan, START), live(3), START);
    state = advance(state, live(4), START + REST_SECONDS * 1000);
    expect(state.phase).toBe("active");
    expect(state.currentSet).toBe(2);
    // The extra rep done during rest does not count.
    expect(repsInCurrentSet(state, 4)).toBe(0);
  });

  it("can skip the rest", () => {
    let state = advance(startWorkout(plan, START), live(3), START);
    state = skipRest(state, live(3), START + 1000);
    expect(state.phase).toBe("active");
    expect(state.currentSet).toBe(2);
  });

  it("completes after the last set", () => {
    let state = advance(startWorkout(plan, START), live(3), START);
    state = skipRest(state, live(3), START + 1000);
    state = advance(state, live(6), START + 20_000);
    expect(state.phase).toBe("complete");
    expect(state.completedSets).toHaveLength(2);
    expect(totalRepsDone(state, 6)).toBe(6);
  });

  it("saves a half-done set when ending early", () => {
    const state = endWorkout(startWorkout(plan, START), live(2), START + 8000);
    expect(state.phase).toBe("complete");
    expect(state.completedSets).toEqual([
      { setNumber: 1, reps: 2, durationSec: 8, formScore: 90 },
    ]);
  });

  it("never counts more reps than the set target", () => {
    const state = startWorkout(plan, START);
    expect(repsInCurrentSet(state, 10)).toBe(3);
  });
});
