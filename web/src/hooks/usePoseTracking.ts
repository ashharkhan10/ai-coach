/**
 * usePoseTracking — the main loop of the live session.
 *
 * For every camera frame it:
 *   1. finds the body with MediaPipe
 *   2. draws the skeleton on the canvas
 *   3. gives the body points to the exercise detector (counts reps)
 */
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { createPoseLandmarker } from "@/lib/pose/createPoseLandmarker";
import { clearCanvas, drawSkeleton } from "@/lib/pose/drawSkeleton";
import type { ExerciseDetector, ExerciseResult } from "@/lib/exercises/types";

export type TrackingStatus = "loading" | "tracking" | "no-pose" | "error";

type Options = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cameraReady: boolean;
  detector: ExerciseDetector;
};

export function usePoseTracking({ videoRef, canvasRef, cameraReady, detector }: Options) {
  const [status, setStatus] = useState<TrackingStatus>("loading");
  const [result, setResult] = useState<ExerciseResult | null>(null);

  // Remember the last result so we only re-render when something changed.
  const lastResultKey = useRef("");

  useEffect(() => {
    if (!cameraReady) return;

    let landmarker: PoseLandmarker | null = null;
    let frameId = 0;
    let lastVideoTime = -1;
    let stopped = false;

    function runEveryFrame() {
      if (stopped) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Only process a NEW video frame (skip duplicates).
      if (landmarker && video && canvas && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        // Make the canvas the same size as the video.
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const detection = landmarker.detectForVideo(video, performance.now());
        const body = detection.landmarks[0];

        if (body) {
          drawSkeleton(canvas, body);
          updateResult(detector.process(body));
          setStatus("tracking");
        } else {
          clearCanvas(canvas);
          setStatus("no-pose");
        }
      }

      frameId = requestAnimationFrame(runEveryFrame);
    }

    function updateResult(next: ExerciseResult) {
      const key = JSON.stringify(next);
      if (key === lastResultKey.current) return;
      lastResultKey.current = key;
      setResult(next);
    }

    async function start() {
      try {
        landmarker = await createPoseLandmarker();
        if (stopped) return;
        frameId = requestAnimationFrame(runEveryFrame);
      } catch (error) {
        console.error("Pose model error:", error);
        setStatus("error");
      }
    }

    start();

    // Clean up when the page closes.
    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      landmarker?.close();
    };
  }, [cameraReady, videoRef, canvasRef, detector]);

  return { status, result };
}
