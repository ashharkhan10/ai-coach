/**
 * Small geometry helpers for body points.
 */

type Point = { x: number; y: number };

/**
 * Angle (in degrees) at point B, made by points A → B → C.
 *
 * Example: hip → knee → ankle gives the knee angle.
 *   - Straight leg ≈ 180°
 *   - Deep squat   ≈ 90° or less
 */
export function calculateAngle(a: Point, b: Point, c: Point): number {
  // Two arrows starting at B: one pointing to A, one pointing to C.
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dot = ba.x * bc.x + ba.y * bc.y;
  const lengthBA = Math.hypot(ba.x, ba.y);
  const lengthBC = Math.hypot(bc.x, bc.y);

  if (lengthBA === 0 || lengthBC === 0) return 0;

  // Keep the value between -1 and 1 so Math.acos never fails.
  const cosine = Math.max(-1, Math.min(1, dot / (lengthBA * lengthBC)));

  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * How far a line (top → bottom) leans away from straight up-and-down.
 * 0° = perfectly upright. Bigger = leaning more.
 */
export function angleFromVertical(top: Point, bottom: Point): number {
  const dx = Math.abs(top.x - bottom.x);
  const dy = Math.abs(top.y - bottom.y);
  if (dy === 0) return 90;
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

/** The point exactly halfway between A and B. */
export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
