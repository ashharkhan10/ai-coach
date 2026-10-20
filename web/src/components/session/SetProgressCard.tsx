/**
 * SetProgressCard — "Set 2 of 3", the rep ring, one bar per set and totals.
 */
import { RepRing } from "./RepRing";

type Props = {
  currentSet: number;
  totalSets: number;
  setsCompleted: number;
  repsThisSet: number;
  repsPerSet: number;
  totalReps: number;
};

export function SetProgressCard({
  currentSet,
  totalSets,
  setsCompleted,
  repsThisSet,
  repsPerSet,
  totalReps,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface p-6">
      <span className="self-start text-xs font-semibold uppercase tracking-widest text-subtle">
        Set {currentSet} of {totalSets}
      </span>

      <RepRing reps={repsThisSet} target={repsPerSet} />

      {/* One bar per set: done = lime, current = dim lime, later = grey */}
      <div className="flex w-full gap-2">
        {Array.from({ length: totalSets }, (_, i) => {
          const setNumber = i + 1;
          const color =
            setNumber <= setsCompleted
              ? "bg-accent"
              : setNumber === currentSet
                ? "bg-accent-dim"
                : "bg-line";
          return <div key={setNumber} className={`h-2 flex-1 rounded ${color}`} />;
        })}
      </div>

      <span className="text-sm text-muted">
        {totalReps} total reps · {setsCompleted} {setsCompleted === 1 ? "set" : "sets"} done
      </span>
    </div>
  );
}
