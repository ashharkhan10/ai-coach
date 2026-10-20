/**
 * SessionHeader — top bar of the live session:
 * LIVE badge, exercise, plan, timer and End workout button.
 */
import { formatTime } from "@/lib/workout/formatTime";

type Props = {
  exerciseName: string;
  sets: number;
  repsPerSet: number;
  elapsedSeconds: number;
  onEnd: () => void;
};

export function SessionHeader({ exerciseName, sets, repsPerSet, elapsedSeconds, onEnd }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-4 lg:px-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1.5 text-sm font-semibold text-danger">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF5A4E]" />
          LIVE
        </span>
        <h1 className="font-display text-2xl font-bold">{exerciseName}</h1>
        <span className="text-sm text-muted">
          {sets} sets × {repsPerSet} reps
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-display text-2xl font-bold tabular-nums">
          {formatTime(elapsedSeconds)}
        </span>
        <button
          type="button"
          onClick={onEnd}
          className="h-11 rounded-xl bg-danger-soft px-5 text-sm font-semibold text-danger hover:brightness-125"
        >
          End workout
        </button>
      </div>
    </header>
  );
}
