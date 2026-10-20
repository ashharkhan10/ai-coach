/**
 * RestOverlay — the big rest countdown shown over the camera between sets.
 */
import { formatTime } from "@/lib/workout/formatTime";

type Props = {
  secondsLeft: number;
  nextSet: number;
  totalSets: number;
  onSkip: () => void;
};

export function RestOverlay({ secondsLeft, nextSet, totalSets, onSkip }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ground/85 text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-subtle">Rest</span>
      <span className="font-display text-8xl font-bold tabular-nums text-accent">
        {formatTime(secondsLeft)}
      </span>
      <span className="text-lg text-muted">
        Next: set {nextSet} of {totalSets}
      </span>
      <button
        type="button"
        onClick={onSkip}
        className="h-12 rounded-xl border border-line-strong bg-raised px-6 font-semibold hover:bg-line"
      >
        Skip rest
      </button>
    </div>
  );
}
