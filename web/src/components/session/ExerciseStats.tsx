/**
 * ExerciseStats — the side panel with the rep count and angles.
 */
import type { ExerciseResult } from "@/lib/exercises/types";

type Props = {
  exerciseName: string;
  result: ExerciseResult | null;
  onReset: () => void;
};

export function ExerciseStats({ exerciseName, result, onReset }: Props) {
  const reps = result?.reps ?? 0;
  const angles = result?.angles ?? {};

  return (
    <aside className="flex flex-col gap-4">
      {/* Rep counter */}
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#23262B] bg-[#17191D] p-6">
        <span className="self-start text-xs font-semibold uppercase tracking-widest text-[#8B9099]">
          {exerciseName}
        </span>
        <span className="text-8xl font-bold tabular-nums">{reps}</span>
        <span className="text-[#A3A8B0]">reps</span>
      </div>

      {/* Angles */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#23262B] bg-[#17191D] p-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8B9099]">
          Form check
        </span>
        {Object.entries(angles).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span>{label}</span>
            <span className="text-xl font-bold">{value}°</span>
          </div>
        ))}
        {Object.keys(angles).length === 0 && (
          <span className="text-sm text-[#8B9099]">Waiting for your body…</span>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="h-12 rounded-xl border border-[#2E3238] bg-[#1D2024] font-semibold hover:bg-[#23262B]"
      >
        Reset reps
      </button>
    </aside>
  );
}
