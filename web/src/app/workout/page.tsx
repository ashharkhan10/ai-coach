/**
 * Workout setup page — open http://localhost:3000/workout
 *
 * The user picks an exercise, sets and reps, then taps Start.
 */
"use client";

import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { ExerciseCard } from "@/components/setup/ExerciseCard";
import { PlanSummary } from "@/components/setup/PlanSummary";
import { EXERCISES, getExercise } from "@/lib/exercises";
import { DEFAULT_PLAN, type WorkoutPlan } from "@/lib/workout/plan";

export default function WorkoutSetupPage() {
  const [plan, setPlan] = useState<WorkoutPlan>(DEFAULT_PLAN);
  const selected = getExercise(plan.exerciseId);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-wrap gap-10 px-6 py-12 lg:px-10">
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight">Choose your exercise</h1>
            <p className="text-muted">Stand 2–3 metres from the camera so your full body is visible.</p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {EXERCISES.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                name={exercise.name}
                tracks={exercise.tracks}
                selected={exercise.id === plan.exerciseId}
                onSelect={() => setPlan({ ...plan, exerciseId: exercise.id })}
              />
            ))}
          </div>
        </section>

        <div className="min-w-0 flex-[1_1_320px]">
          <PlanSummary
            plan={plan}
            exerciseName={selected.name}
            cameraTip={selected.cameraTip}
            onChange={setPlan}
          />
        </div>
      </main>
    </div>
  );
}
