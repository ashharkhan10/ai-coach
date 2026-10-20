/**
 * PlanSummary — the right-side card on the setup screen:
 * sets, reps, total and the Start button.
 */
import Link from "next/link";
import { NumberStepper } from "./NumberStepper";
import { LIMITS, REST_SECONDS, buildSessionUrl, type WorkoutPlan } from "@/lib/workout/plan";

type Props = {
  plan: WorkoutPlan;
  exerciseName: string;
  cameraTip: string;
  onChange: (plan: WorkoutPlan) => void;
};

export function PlanSummary({ plan, exerciseName, cameraTip, onChange }: Props) {
  return (
    <aside className="flex flex-col gap-6 self-start rounded-3xl border border-line bg-surface p-7">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-subtle">Your plan</span>
        <span className="font-display text-3xl font-bold">{exerciseName}</span>
      </div>

      <NumberStepper
        label="Sets"
        value={plan.sets}
        min={LIMITS.sets.min}
        max={LIMITS.sets.max}
        onChange={(sets) => onChange({ ...plan, sets })}
      />
      <NumberStepper
        label="Reps per set"
        value={plan.repsPerSet}
        min={LIMITS.reps.min}
        max={LIMITS.reps.max}
        onChange={(repsPerSet) => onChange({ ...plan, repsPerSet })}
      />

      <div className="h-px bg-line" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Total reps</span>
        <span className="font-display text-xl font-bold text-accent">
          {plan.sets * plan.repsPerSet}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Rest between sets</span>
        <span className="font-semibold">{REST_SECONDS}s</span>
      </div>

      <Link
        href={buildSessionUrl(plan)}
        className="flex h-14 items-center justify-center rounded-2xl bg-accent font-semibold text-ground hover:brightness-110"
      >
        Start workout
      </Link>

      <p className="text-sm leading-relaxed text-subtle">
        {cameraTip} Your browser will ask for camera access.
      </p>
    </aside>
  );
}
