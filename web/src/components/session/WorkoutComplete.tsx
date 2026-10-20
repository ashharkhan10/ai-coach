/**
 * WorkoutComplete — the summary shown after the last set (or End workout).
 */
import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { getExercise } from "@/lib/exercises";
import { formatTime } from "@/lib/workout/formatTime";
import { buildSessionUrl } from "@/lib/workout/plan";
import { elapsedSeconds, type WorkoutState } from "@/lib/workout/workoutState";

type Props = {
  result: WorkoutState;
};

export function WorkoutComplete({ result }: Props) {
  const exercise = getExercise(result.plan.exerciseId);
  const sets = result.completedSets;

  const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
  const averageForm =
    sets.length > 0 ? Math.round(sets.reduce((sum, set) => sum + set.formScore, 0) / sets.length) : 0;
  const duration = elapsedSeconds(result, result.endedAt ?? result.startedAt);

  const stats = [
    { label: "Total reps", value: String(totalReps) },
    { label: "Sets done", value: `${sets.length} / ${result.plan.sets}` },
    { label: "Time", value: formatTime(duration) },
    { label: "Avg form score", value: `${averageForm}` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Workout complete
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight">Nice work on {exercise.name}!</h1>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5">
              <span className="text-sm text-muted">{stat.label}</span>
              <span className="font-display text-3xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Set by set */}
        {sets.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[480px] text-left">
              <thead className="text-xs uppercase tracking-wider text-subtle">
                <tr>
                  <th className="px-6 py-4 font-semibold">Set</th>
                  <th className="px-6 py-4 font-semibold">Reps</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Form score</th>
                </tr>
              </thead>
              <tbody>
                {sets.map((set) => (
                  <tr key={set.setNumber} className="border-t border-line">
                    <td className="px-6 py-4 font-semibold">{set.setNumber}</td>
                    <td className="px-6 py-4">{set.reps}</td>
                    <td className="px-6 py-4 text-muted">{formatTime(set.durationSec)}</td>
                    <td className="px-6 py-4">{set.formScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href="/workout"
            className="flex h-12 items-center rounded-xl bg-accent px-6 font-semibold text-ground hover:brightness-110"
          >
            New workout
          </Link>
          <a
            href={buildSessionUrl(result.plan)}
            className="flex h-12 items-center rounded-xl border border-line-strong bg-raised px-6 font-semibold hover:bg-line"
          >
            Repeat this workout
          </a>
        </div>
      </main>
    </div>
  );
}
