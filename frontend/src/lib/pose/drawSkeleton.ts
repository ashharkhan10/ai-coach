/**
 * Draws the body skeleton (lines + dots) on a canvas.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { SKELETON_LINES } from "./landmarks";

const LINE_COLOR = "#C6F432"; // lime
const DOT_COLOR = "#4CC3FF"; // blue
const MIN_VISIBILITY = 0.6; // skip points the camera can't see well

export function drawSkeleton(
  canvas: HTMLCanvasElement,
  landmarks: NormalizedLandmark[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // Landmarks are 0–1, so multiply by canvas size to get pixels.
  const toPixel = (p: NormalizedLandmark) => ({ x: p.x * width, y: p.y * height });

  // 1. Lines
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  for (const [start, end] of SKELETON_LINES) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (a.visibility < MIN_VISIBILITY || b.visibility < MIN_VISIBILITY) continue;

    const p1 = toPixel(a);
    const p2 = toPixel(b);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // 2. Dots (only the points used in the lines)
  ctx.fillStyle = DOT_COLOR;
  const usedPoints = new Set(SKELETON_LINES.flat());

  for (const index of usedPoints) {
    const point = landmarks[index];
    if (point.visibility < MIN_VISIBILITY) continue;

    const p = toPixel(point);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
}
