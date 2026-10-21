import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, SPLITS, problemWith, sortWeekdays, toggle } from "./planOptions";

describe("toggle", () => {
  it("adds a missing item", () => {
    expect(toggle(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes an item that is there", () => {
    expect(toggle(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("sortWeekdays", () => {
  it("puts days in calendar order", () => {
    expect(sortWeekdays(["Friday", "Monday", "Wednesday"])).toEqual(["Monday", "Wednesday", "Friday"]);
  });
});

describe("problemWith", () => {
  it("accepts the default options", () => {
    expect(problemWith(DEFAULT_OPTIONS)).toBeNull();
  });

  it("needs at least two days", () => {
    expect(problemWith({ ...DEFAULT_OPTIONS, weekdays: ["Monday"] })).not.toBeNull();
  });

  it("needs a rest day", () => {
    const everyDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
    expect(problemWith({ ...DEFAULT_OPTIONS, weekdays: [...everyDay] })).not.toBeNull();
  });

  it("needs at least one exercise", () => {
    expect(problemWith({ ...DEFAULT_OPTIONS, exercises: [] })).not.toBeNull();
  });
});

describe("SPLITS", () => {
  it("includes Push / Pull / Legs", () => {
    expect(SPLITS.map((s) => s.value)).toContain("push_pull_legs");
  });

  it("starts with letting the AI choose", () => {
    expect(DEFAULT_OPTIONS.split).toBe("auto");
    expect(SPLITS[0].value).toBe("auto");
  });
});
