/**
 * Calculates the angle (in degrees) at point B, made by points A → B → C.
 *
 * Example: hip → knee → ankle gives the knee angle.
 *   - Standing straight ≈ 180°
 *   - Deep squat       ≈ 90° or less
 */

type Point = { x: number; y: number };

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
