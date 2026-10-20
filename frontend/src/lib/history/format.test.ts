import { describe, expect, it } from "vitest";
import { dayNumber, formatDay, niceMax } from "./format";

describe("formatDay", () => {
  it("shows day and short month", () => {
    expect(formatDay("2026-10-20")).toBe("20 Oct");
    expect(formatDay("2026-01-05")).toBe("5 Jan");
  });
});

describe("dayNumber", () => {
  it("drops the leading zero", () => {
    expect(dayNumber("2026-10-05")).toBe("5");
  });
});

describe("niceMax", () => {
  it("rounds up to a clean number", () => {
    expect(niceMax(37)).toBe(40);
    expect(niceMax(140)).toBe(150);
    expect(niceMax(100)).toBe(100);
  });

  it("uses 10 when there is no data", () => {
    expect(niceMax(0)).toBe(10);
  });
});
