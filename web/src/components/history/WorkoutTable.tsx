/**
 * WorkoutTable — the list of recent workouts.
 */
import { getExercise, type ExerciseId } from "@/lib/exercises";
import type { SavedWorkout } from "@/lib/api/workouts";
import { formatDateTime } from "@/lib/history/format";
import { formatTime } from "@/lib/workout/formatTime";

function averageForm(workout: SavedWorkout): number {
  if (workout.sets.length === 0) return 0;
  const total = workout.sets.reduce((sum, set) => sum + set.form_score, 0);
  return Math.round(total / workout.sets.length);
}

export function WorkoutTable({ workouts }: { workouts: SavedWorkout[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-bold">Recent workouts</h2>

      {workouts.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-muted">
          No workouts yet. Finish one and it will show up here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left">
            <thead className="text-xs uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Exercise</th>
                <th className="px-6 py-4 font-semibold">Sets</th>
                <th className="px-6 py-4 font-semibold">Reps</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Avg form</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id} className="border-t border-line">
                  <td className="px-6 py-4 text-muted">{formatDateTime(workout.started_at)}</td>
                  <td className="px-6 py-4 font-semibold">
                    {getExercise(workout.exercise as ExerciseId).name}
                  </td>
                  <td className="px-6 py-4">
                    {workout.sets.length} / {workout.target_sets}
                  </td>
                  <td className="px-6 py-4">{workout.total_reps}</td>
                  <td className="px-6 py-4 text-muted">{formatTime(workout.duration_sec)}</td>
                  <td className="px-6 py-4">{averageForm(workout)}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
