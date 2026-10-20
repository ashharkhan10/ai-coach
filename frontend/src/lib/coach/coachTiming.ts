/**
 * Decides WHEN the coach should speak about a form problem.
 *
 * - The problem must last a moment (not a one-frame glitch).
 * - The coach waits between corrections, so it doesn't nag.
 */

/** A form problem must last this long before the coach mentions it. */
export const ISSUE_HOLD_MS = 1500;

/** Minimum gap between two spoken corrections. */
export const COOLDOWN_MS = 8000;

type Input = {
  issue: string | null;
  /** When the current problem started (ms), or null if there is none. */
  issueStartedAt: number | null;
  /** When the coach last said anything (ms). */
  lastSpokenAt: number;
  now: number;
};

export function shouldSpeakIssue({ issue, issueStartedAt, lastSpokenAt, now }: Input): boolean {
  if (!issue || issueStartedAt === null) return false;

  const lastedLongEnough = now - issueStartedAt >= ISSUE_HOLD_MS;
  const coachHasRested = now - lastSpokenAt >= COOLDOWN_MS;

  return lastedLongEnough && coachHasRested;
}
