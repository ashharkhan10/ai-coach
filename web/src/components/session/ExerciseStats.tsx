/**
 * ExerciseStats — the side panel: rep count, form score, angles and tips.
 */
import type { ExerciseResult } from "@/lib/exercises/types";

type Props = {
  exerciseName: string;
  result: ExerciseResult | null;
  onReset: () => void;
};

export function ExerciseStats({ exerciseName, result, onReset }: Props) {
  const reps = result?.reps ?? 0;
  const formScore = result?.formScore ?? 100;
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

      {/* Form score + angles */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#23262B] bg-[#17191D] p-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8B9099]">
          Form check
        </span>

        <div className="flex items-center justify-between">
          <span>Form score</span>
          <span className={`text-xl font-bold ${scoreColor(formScore)}`}>{formScore}/100</span>
        </div>

        {Object.entries(angles).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span>{label}</span>
            <span className="text-xl font-bold">{value}°</span>
          </div>
        ))}

        {result?.issue && (
          <p className="rounded-lg bg-[#2E2210] px-3 py-2 text-sm text-[#FFB35C]">{result.issue}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="h-12 rounded-xl border border-[#2E3238] bg-[#1D2024] font-semibold hover:bg-[#23262B]"
      >
        Reset
      </button>
    </aside>
  );
}

/** Green for good, orange for okay, red for poor. */
function scoreColor(score: number): string {
  if (score >= 80) return "text-[#C6F432]";
  if (score >= 50) return "text-[#FFB35C]";
  return "text-[#FF8A80]";
}
