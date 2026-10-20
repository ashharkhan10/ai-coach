/**
 * PlanDayCard — one training day of the weekly plan.
 * Each exercise has a Start button that opens the live session with that plan.
 */
import Link from "next/link";
import type { PlanDay } from "@/lib/api/plans";
import { getExercise } from "@/lib/exercises";
import { buildSessionUrl } from "@/lib/workout/plan";

export function PlanDayCard({ day }: { day: PlanDay }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-subtle">{day.day}</span>
        <span className="font-display text-xl font-bold">{day.focus}</span>
      </div>

      <ul className="flex flex-col gap-3">
        {day.exercises.map((item, index) => (
          <li
            key={`${item.exercise}-${index}`}
            className="flex items-center justify-between gap-3 rounded-2xl bg-raised px-4 py-3"
          >
            <div className="flex flex-col">
              <span className="font-semibold">{getExercise(item.exercise).name}</span>
              <span className="text-sm text-muted">
                {item.sets} sets × {item.reps} reps
              </span>
            </div>
            <Link
              href={buildSessionUrl({ exerciseId: item.exercise, sets: item.sets, repsPerSet: item.reps })}
              className="flex h-11 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-ground hover:brightness-110"
            >
              Start
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
