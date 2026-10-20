/**
 * SaveStatusBanner — tells the user whether the workout was saved,
 * and shows any badges they just unlocked.
 */
import type { Badge } from "@/lib/api/workouts";
import type { SaveStatus } from "@/hooks/useSaveWorkout";

type Props = {
  status: SaveStatus;
  newBadges: Badge[];
  onRetry: () => void;
};

export function SaveStatusBanner({ status, newBadges, onRetry }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {status === "saving" && <p className="text-sm text-muted">Saving to your history…</p>}

      {status === "saved" && <p className="text-sm text-accent">✓ Saved to your history</p>}

      {status === "nothing-to-save" && (
        <p className="text-sm text-muted">No reps done, so nothing was saved.</p>
      )}

      {status === "error" && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          Couldn&apos;t save this workout.
          <button type="button" onClick={onRetry} className="font-semibold underline">
            Try again
          </button>
        </div>
      )}

      {newBadges.map((badge) => (
        <div
          key={badge.id}
          className="flex items-center gap-4 rounded-2xl border border-accent bg-accent-soft px-5 py-4"
        >
          <span className="font-display text-2xl" aria-hidden="true">
            ★
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold">Badge unlocked: {badge.name}</span>
            <span className="text-sm text-muted">{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
