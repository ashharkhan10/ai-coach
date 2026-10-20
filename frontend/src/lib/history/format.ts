/**
 * Small helpers for showing dates and numbers on the history page.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-20" → "20 Oct" (read as a plain date, no time zone shifting). */
export function formatDay(isoDay: string): string {
  const [, month, day] = isoDay.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

/** "2026-10-20" → "20" */
export function dayNumber(isoDay: string): string {
  return String(Number(isoDay.split("-")[2]));
}

/** A full timestamp → "20 Oct, 7:45 pm" in the user's own time. */
export function formatDateTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Rounds a number UP to a clean chart top, e.g. 37 → 40, 140 → 150, 0 → 10.
 */
export function niceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => s * magnitude >= value) ?? 10;
  return step * magnitude;
}
