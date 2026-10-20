/**
 * ActiveSession — the live workout screen while the user is exercising.
 *
 * Connects the pieces:
 *   camera → pose tracking → exercise detector → workout clock → screen
 *
 * When the workout is complete it calls onFinish with the results.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { usePoseTracking } from "@/hooks/usePoseTracking";
import { useWorkout } from "@/hooks/useWorkout";
import { getExercise } from "@/lib/exercises";
import type { WorkoutPlan } from "@/lib/workout/plan";
import {
  elapsedSeconds,
  repsInCurrentSet,
  restSecondsLeft,
  totalRepsDone,
  type WorkoutState,
} from "@/lib/workout/workoutState";
import { CameraView } from "./CameraView";
import { FormCheckCard } from "./FormCheckCard";
import { RestOverlay } from "./RestOverlay";
import { SessionHeader } from "./SessionHeader";
import { SetProgressCard } from "./SetProgressCard";

type Props = {
  plan: WorkoutPlan;
  onFinish: (result: WorkoutState) => void;
};

export function ActiveSession({ plan, onFinish }: Props) {
  const exercise = getExercise(plan.exerciseId);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // One detector for the whole workout.
  const [detector] = useState(() => exercise.createDetector());

  const { videoRef, status: cameraStatus } = useCamera();
  const { status: trackingStatus, result } = usePoseTracking({
    videoRef,
    canvasRef,
    cameraReady: cameraStatus === "ready",
    detector,
  });
  const workout = useWorkout(plan, result, detector);
  const { state, now } = workout;

  // Tell the parent page when the workout is over.
  useEffect(() => {
    if (state.phase === "complete") onFinish(state);
  }, [state, onFinish]);

  const detectedReps = result?.reps ?? 0;
  const isResting = state.phase === "resting";

  // While resting, the ring stays full for the set just finished.
  const repsThisSet = isResting ? plan.repsPerSet : repsInCurrentSet(state, detectedReps);
  const shownSet = isResting ? state.currentSet + 1 : state.currentSet;

  return (
    <div className="flex min-h-screen flex-col">
      <SessionHeader
        exerciseName={exercise.name}
        sets={plan.sets}
        repsPerSet={plan.repsPerSet}
        elapsedSeconds={elapsedSeconds(state, now)}
        onEnd={workout.endWorkout}
      />

      <main className="flex flex-1 flex-wrap gap-6 px-6 py-6 lg:px-8">
        <section className="flex min-w-0 flex-[999_1_640px] flex-col gap-3">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraStatus={cameraStatus}
            trackingStatus={trackingStatus}
            formStatus={result?.status}
            hasIssue={Boolean(result?.issue)}
          >
            {isResting && (
              <RestOverlay
                secondsLeft={restSecondsLeft(state, now)}
                nextSet={state.currentSet + 1}
                totalSets={plan.sets}
                onSkip={workout.skipRest}
              />
            )}
          </CameraView>
          <p className="text-sm text-subtle">{exercise.cameraTip}</p>
        </section>

        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          <SetProgressCard
            currentSet={shownSet}
            totalSets={plan.sets}
            setsCompleted={state.completedSets.length}
            repsThisSet={repsThisSet}
            repsPerSet={plan.repsPerSet}
            totalReps={totalRepsDone(state, detectedReps)}
          />
          <FormCheckCard result={result} />
        </aside>
      </main>
    </div>
  );
}
