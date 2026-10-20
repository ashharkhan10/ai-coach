/**
 * Live session page — open http://localhost:3000/session
 *
 * This page connects the pieces:
 *   camera → pose tracking → exercise detector → screen
 */
"use client";

import { useMemo, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { usePoseTracking } from "@/hooks/usePoseTracking";
import { getExercise, type ExerciseId } from "@/lib/exercises";
import { CameraView } from "@/components/session/CameraView";
import { ExercisePicker } from "@/components/session/ExercisePicker";
import { ExerciseStats } from "@/components/session/ExerciseStats";

export default function SessionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exerciseId, setExerciseId] = useState<ExerciseId>("squat");

  const exercise = getExercise(exerciseId);

  // A fresh detector every time the exercise changes.
  const detector = useMemo(() => getExercise(exerciseId).createDetector(), [exerciseId]);

  const { videoRef, status: cameraStatus } = useCamera();

  const { status: trackingStatus, result } = usePoseTracking({
    videoRef,
    canvasRef,
    cameraReady: cameraStatus === "ready",
    detector,
  });

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-[#0E0F11] p-6 text-[#F2F3F5]">
      <h1 className="text-3xl font-bold">AI Coach — Live session</h1>

      <ExercisePicker selected={exerciseId} onSelect={setExerciseId} />
      <p className="text-sm text-[#A3A8B0]">{exercise.cameraTip}</p>

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
            exerciseName={exercise.name}
            result={result}
            onReset={() => detector.reset()}
          />
        </div>
      </div>
    </main>
  );
}
