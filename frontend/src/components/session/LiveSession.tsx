/**
 * LiveSession — switches between the live workout and the summary.
 *
 * ActiveSession uses the camera and the clock, which only exist in the
 * browser, so it is loaded in the browser only (ssr: false).
 *
 * When the workout ends, ActiveSession is removed from the page,
 * which turns the camera off automatically.
 */
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { WorkoutPlan } from "@/lib/workout/plan";
import type { WorkoutState } from "@/lib/workout/workoutState";
import { WorkoutComplete } from "./WorkoutComplete";

const ActiveSession = dynamic(
  () => import("./ActiveSession").then((module) => module.ActiveSession),
  {
    ssr: false,
    loading: () => <p className="p-6 text-muted">Starting session…</p>,
  },
);

type Props = {
  plan: WorkoutPlan;
};

export function LiveSession({ plan }: Props) {
  const [finished, setFinished] = useState<WorkoutState | null>(null);

  if (finished) {
    return <WorkoutComplete result={finished} />;
  }

  return <ActiveSession plan={plan} onFinish={setFinished} />;
}
