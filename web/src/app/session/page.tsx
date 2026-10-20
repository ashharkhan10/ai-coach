/**
 * Live session page — open http://localhost:3000/session
 *
 * This page connects the pieces:
 *   camera → pose tracking → squat detector → screen
 */
"use client";

import { useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { usePoseTracking } from "@/hooks/usePoseTracking";
import { SquatDetector } from "@/lib/exercises/squat";
import { CameraView } from "@/components/session/CameraView";
import { ExerciseStats } from "@/components/session/ExerciseStats";

export default function SessionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create the detector once and keep it for the whole session.
  const [detector] = useState(() => new SquatDetector());

  const { videoRef, status: cameraStatus } = useCamera();

  const { status: trackingStatus, result } = usePoseTracking({
    videoRef,
    canvasRef,
    cameraReady: cameraStatus === "ready",
    detector,
  });

  return (
    <main className="min-h-screen bg-[#0E0F11] p-6 text-[#F2F3F5]">
      <h1 className="mb-6 text-3xl font-bold">AI Coach — Live session</h1>

      <div className="flex flex-wrap gap-6">
        <section className="min-w-0 flex-[999_1_640px]">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraStatus={cameraStatus}
            trackingStatus={trackingStatus}
            formStatus={result?.status}
          />
        </section>

        <div className="min-w-0 flex-[1_1_300px]">
          <ExerciseStats
            exerciseName="Squats"
            result={result}
            onReset={() => detector.reset()}
          />
        </div>
      </div>
    </main>
  );
}
